import type { FastifyInstance } from 'fastify';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload stream to Cloudinary
function uploadToCloudinary(stream: Readable, folder: string): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({ url: result.secure_url, public_id: result.public_id });
        } else {
          reject(new Error('No result from Cloudinary'));
        }
      }
    );
    stream.pipe(uploadStream);
  });
}

export async function uploadRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /uploads - Upload a file to Cloudinary
  fastify.post('/uploads', async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(data.mimetype)) {
        return reply.code(400).send({
          error: 'Invalid file type',
          message: `Allowed types: ${ALLOWED_TYPES.join(', ')}`,
        });
      }

      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return reply.code(500).send({
          error: 'Cloudinary not configured',
          message: 'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables'
        });
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(data.file, 'lcos-avatars');

      return reply.code(201).send({
        url: result.url,
        public_id: result.public_id,
        mimetype: data.mimetype,
      });
    } catch (error) {
      console.error('Upload error:', error);
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });
}
