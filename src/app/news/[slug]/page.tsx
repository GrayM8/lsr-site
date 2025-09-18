import { notFound } from "next/navigation"
import { getAllPosts, getPostContent } from "@/lib/news"

import { Separator } from "@/components/ui/separator"

export const revalidate = 60

export async function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }))
}

type RouteParams = { slug: string }

export default async function NewsPostPage({
                                             params,
                                           }: {
  params: Promise<RouteParams> // 👈 Next 15: params can be async
}) {
  const { slug } = await params // 👈 await before using

  const post = getAllPosts().find((p) => p.slug === slug)
  if (!post) return notFound()

  const { content, frontmatter } = await getPostContent(slug)

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-3xl px-6 md:px-8 py-10">
        <header className="mb-6">
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">{frontmatter.title}</h1>
          <div className="text-sm text-white/60 mt-2">
            <time>{new Date(frontmatter.date).toLocaleString()}</time>
            {frontmatter.author ? ` • ${frontmatter.author}` : null}
          </div>
        </header>

        <Separator className="my-6 bg-white/10" />

        <article className="prose prose-zinc dark:prose-invert mx-auto
                            prose-a:underline prose-a:text-lsr-orange hover:prose-a:opacity-80
                            prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-pre:rounded-xl">
          {content}
        </article>
      </div>
    </main>
  )
}
