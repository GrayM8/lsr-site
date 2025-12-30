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

  return posts.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.publishedAt?.toISOString() ?? new Date().toISOString(),
    excerpt: p.excerpt ?? undefined,
    author: p.author?.displayName ?? "LSR Team",
    published: true,
    tags: [] as string[] // TODO: Implement tags fetching
  }));
}

export async function getPostContent(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) notFound();

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
    published: true
  }

  return { content: mdx.content, frontmatter }
}
