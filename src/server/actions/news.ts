'use server';

import { prisma } from '@/server/db';
import { requireRole } from '@/server/auth/guards';
import { newsPostSchema, NewsPostSchema } from '@/schemas/news.schema';
import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function createPost(data: NewsPostSchema) {
  const user = await requireRole(['admin', 'officer']);
  
  const validated = newsPostSchema.parse(data);

  try {
    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        bodyMd: validated.bodyMd,
        publishedAt: validated.published ? new Date() : null,
        authorId: user.id,
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true, post };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' };
    }
    return { success: false, error: 'Failed to create post' };
  }
}

export async function updatePost(id: string, data: NewsPostSchema) {
  await requireRole(['admin', 'officer']);

  const validated = newsPostSchema.parse(data);

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return { success: false, error: 'Post not found' };
  }

  let publishedAt = existingPost.publishedAt;
  if (validated.published && !publishedAt) {
    publishedAt = new Date();
  } else if (!validated.published) {
    publishedAt = null;
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt,
        bodyMd: validated.bodyMd,
        publishedAt,
      },
    });

    revalidatePath('/admin/news');
    revalidatePath('/news');
    if (post.slug !== existingPost.slug) {
        revalidatePath(`/news/${existingPost.slug}`); // In case old slug is cached?
    }
    revalidatePath(`/news/${post.slug}`);
    
    return { success: true, post };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' };
    }
    return { success: false, error: 'Failed to update post' };
  }
}
