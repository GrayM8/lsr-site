import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

export type NewsFrontmatter = {
  title: string
  date: string      // ISO date
  author?: string
  excerpt?: string
  tags?: string[]
  published?: boolean
}

const NEWS_DIR = path.join(process.cwd(), "content", "news")

export function getNewsSlugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return []
  return fs.readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
}

export function getPostMeta(slug: string): NewsFrontmatter & { slug: string } | null {
  const file = path.join(NEWS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null
  const src = fs.readFileSync(file, "utf8")
  const { data } = matter(src)
  const fm = data as NewsFrontmatter
  if (fm.published === false) return null
  return { ...fm, slug }
}

export function getAllPosts(): Array<NewsFrontmatter & { slug: string }> {
  const metas = getNewsSlugs()
    .map(getPostMeta)
    .filter(Boolean) as Array<NewsFrontmatter & { slug: string }>
  // sort by date desc
  return metas.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))
}

export async function getPostContent(slug: string) {
  const file = path.join(NEWS_DIR, `${slug}.mdx`)
  const source = fs.readFileSync(file, "utf8")

  // compileMDX can parse frontmatter too, but we already used gray-matter above.
  const mdx = await compileMDX<NewsFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  })

  return mdx // { content, frontmatter }
}
