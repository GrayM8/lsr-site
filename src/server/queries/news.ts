import { prisma } from "@/server/db";

export async function getAllPostsForAdmin() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const postIds = posts.map(p => p.id);
  const entityTags = await prisma.entityTag.findMany({
    where: {
      entityType: 'post',
      entityId: { in: postIds }
    },
    include: { tag: true }
  });

  return posts.map(p => ({
    ...p,
    tags: entityTags
      .filter(et => et.entityId === p.id)
      .map(et => et.tag)
  }));
}
