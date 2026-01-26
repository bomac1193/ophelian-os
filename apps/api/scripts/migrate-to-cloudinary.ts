import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOAD_DIR = './storage/uploads';

async function migrateToCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary environment variables not set');
    process.exit(1);
  }

  if (!existsSync(UPLOAD_DIR)) {
    console.log('No uploads directory found, nothing to migrate');
    return;
  }

  const files = readdirSync(UPLOAD_DIR).filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
  console.log(`Found ${files.length} images to migrate`);

  const urlMap: Record<string, string> = {};

  for (const file of files) {
    const localPath = path.join(UPLOAD_DIR, file);
    const localUrl = `/uploads/${file}`;

    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'lcos-avatars',
        resource_type: 'image',
      });
      urlMap[localUrl] = result.secure_url;
      console.log(`  -> ${result.secure_url}`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }

  // Update character avatars in database
  console.log('\nUpdating database records...');
  const characters = await prisma.character.findMany({
    where: {
      avatarUrl: {
        startsWith: '/uploads/',
      },
    },
  });

  for (const character of characters) {
    if (character.avatarUrl && urlMap[character.avatarUrl]) {
      await prisma.character.update({
        where: { id: character.id },
        data: { avatarUrl: urlMap[character.avatarUrl] },
      });
      console.log(`Updated ${character.name}: ${urlMap[character.avatarUrl]}`);
    }
  }

  // Update scene images
  const scenes = await prisma.scene.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/',
      },
    },
  });

  for (const scene of scenes) {
    if (scene.imageUrl && urlMap[scene.imageUrl]) {
      await prisma.scene.update({
        where: { id: scene.id },
        data: { imageUrl: urlMap[scene.imageUrl] },
      });
      console.log(`Updated scene ${scene.name}: ${urlMap[scene.imageUrl]}`);
    }
  }

  // Update world images
  const worlds = await prisma.world.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/',
      },
    },
  });

  for (const world of worlds) {
    if (world.imageUrl && urlMap[world.imageUrl]) {
      await prisma.world.update({
        where: { id: world.id },
        data: { imageUrl: urlMap[world.imageUrl] },
      });
      console.log(`Updated world ${world.name}: ${urlMap[world.imageUrl]}`);
    }
  }

  console.log('\nMigration complete!');
  console.log(`Migrated ${Object.keys(urlMap).length} images`);
  console.log('You can now safely delete the local storage/uploads folder');

  await prisma.$disconnect();
}

migrateToCloudinary().catch(console.error);
