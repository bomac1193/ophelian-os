import type { FastifyInstance } from 'fastify';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { randomUUID } from 'crypto';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './storage/uploads';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function uploadRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /uploads - Upload a file
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

      // Generate unique filename
      const ext = path.extname(data.filename) || '.jpg';
      const filename = `${randomUUID()}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Save file
      await pipeline(data.file, createWriteStream(filepath));

      // Check if file was truncated (exceeded size limit)
      if (data.file.truncated) {
        return reply.code(400).send({
          error: 'File too large',
          message: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      // Return the URL path
      const url = `/uploads/${filename}`;

      return reply.code(201).send({
        url,
        filename,
        mimetype: data.mimetype,
        size: data.file.bytesRead,
      });
    } catch (error) {
      console.error('Upload error:', error);
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });
}
