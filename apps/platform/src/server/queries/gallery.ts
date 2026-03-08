import { prisma } from '@/server/db';

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: {
      order: 'asc',
    },
  });
}
