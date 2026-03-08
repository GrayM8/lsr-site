import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { prisma } from "@/server/db"
import { notFound } from "next/navigation"

export type NewsFrontmatter = {
  title: string
  date: string      // ISO date
  author?: string
  excerpt?: string
  tags?: string[]
  published?: boolean
}

export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    where: {
      publishedAt: { not: null } // Only show published posts publicly
    },
    include: {
      author: true
    }
  });

  // Fetch tags for these posts
  // Since we can't easily include polymorphic relations in a single query via standard include without defining the relation on the other side nicely (and EntityTag is loose),
  // we can fetch all relevant EntityTags.
  const postIds = posts.map(p => p.id);
  const entityTags = await prisma.entityTag.findMany({
    where: { 
        entityType: 'post',
        entityId: { in: postIds }
    },
    include: { tag: true }
  });

  return posts.map(p => {
    const tags = entityTags
        .filter(et => et.entityId === p.id)
        .map(et => et.tag.name);

    return {
        slug: p.slug,
        title: p.title,
        date: p.publishedAt?.toISOString() ?? new Date().toISOString(),
        excerpt: p.excerpt ?? undefined,
        author: p.author?.displayName ?? "LSR Team",
        published: true,
        tags: tags
    };
  });
}

export async function getPostContent(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) notFound();

  // Fetch tags for this specific post
  const entityTags = await prisma.entityTag.findMany({
    where: { entityType: 'post', entityId: post.id },
    include: { tag: true }
  });
  const tags = entityTags.map(et => et.tag.name);

  // MDX content is stored in bodyMd
  const mdx = await compileMDX<NewsFrontmatter>({
    source: post.bodyMd,
    options: {
      parseFrontmatter: false, // content is pure MDX, metadata is in DB columns
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  })

  // Construct frontmatter from DB fields to maintain compatibility
  const frontmatter: NewsFrontmatter = {
    title: post.title,
    date: post.publishedAt?.toISOString() ?? new Date().toISOString(),
    excerpt: post.excerpt ?? undefined,
    author: post.author?.displayName ?? "LSR Team",
    published: true,
    tags: tags
  }

  return { content: mdx.content, frontmatter }
}