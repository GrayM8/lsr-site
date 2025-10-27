'use server';

import { prisma } from '@/server/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/authz';

export async function createImage(publicId: string) {
  await requireAdmin();
  const newImage = await prisma.galleryImage.create({
    data: {
      publicId,
      order: (await prisma.galleryImage.count()) + 1,
    },
  });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return newImage;
}

export async function updateImageOrder(images: { id: string; order: number }[]) {
  await requireAdmin();
  const transactions = images.map((image) =>
    prisma.galleryImage.update({
      where: { id: image.id },
      data: { order: image.order },
    }),
  );
  await prisma.$transaction(transactions);
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function deleteImage(id: string) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
