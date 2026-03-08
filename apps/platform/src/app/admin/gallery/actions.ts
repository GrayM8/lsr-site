'use server';

import { prisma } from '@/server/db';
import { revalidatePath } from 'next/cache';
import { requireOfficer } from '@/server/auth/guards';
import { createAuditLog } from '@/server/audit/log';

export async function createImage(publicId: string) {
  const user = await requireOfficer();

  const newImage = await prisma.galleryImage.create({
    data: {
      publicId,
      order: (await prisma.galleryImage.count()) + 1,
    },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "CREATE",
    entityType: "GALLERY_IMAGE",
    entityId: newImage.id,
    summary: `Uploaded gallery image ${publicId}`,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  return newImage;
}

export async function updateImageOrder(images: { id: string; order: number }[]) {
  const user = await requireOfficer();

  const transactions = images.map((image) =>
    prisma.galleryImage.update({
      where: { id: image.id },
      data: { order: image.order },
    }),
  );
  await prisma.$transaction(transactions);

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "GALLERY_IMAGE",
    entityId: "BATCH",
    summary: `Reordered ${images.length} gallery images`,
    metadata: { count: images.length },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function deleteImage(id: string) {
  const user = await requireOfficer();

  await prisma.galleryImage.delete({ where: { id } });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "DELETE",
    entityType: "GALLERY_IMAGE",
    entityId: id,
    summary: `Deleted gallery image ${id}`,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function updateImageCredit(id: string, creditName: string | null, creditUrl: string | null) {
  const user = await requireOfficer();

  await prisma.galleryImage.update({
    where: { id },
    data: { creditName, creditUrl },
  });

  await createAuditLog({
    actorUserId: user.id,
    actionType: "UPDATE",
    entityType: "GALLERY_IMAGE",
    entityId: id,
    summary: `Updated credit for gallery image ${id}`,
    after: { creditName, creditUrl },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
