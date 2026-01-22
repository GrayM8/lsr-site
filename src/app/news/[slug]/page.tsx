import { notFound } from "next/navigation"
import { getAllPosts, getPostContent } from "@/lib/news"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `/news/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(({ slug }) => ({ slug }))
}

type RouteParams = { slug: string }

export default async function NewsPostPage({
                                             params,
                                           }: {
  params: Promise<RouteParams> // 👈 Next 15: params can be async
}) {
  const { slug } = await params // 👈 await before using

  const { content, frontmatter } = await getPostContent(slug)

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 md:px-8 py-14 md:py-20">
        <div className="mb-8">
          <Link href="/news" className="group inline-flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-white/50 hover:text-lsr-orange transition-colors">
            <div className="h-px w-8 bg-lsr-orange/30 group-hover:bg-lsr-orange group-hover:w-12 transition-all" />
            Back to News
          </Link>
        </div>

        <header className="mb-12 border-b border-white/10 pb-12">
          <div className="flex items-center gap-4 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-lsr-orange mb-6">
            <time>{new Date(frontmatter.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span className="text-white/20">|</span>
            <span>{frontmatter.author || "Official Team Report"}</span>
          </div>
          
          <h1 className="font-display font-black italic text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-normal leading-[0.9] mb-8">
            {frontmatter.title}
          </h1>
          
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-widest text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <article className="prose prose-invert prose-lg max-w-none 
                            prose-headings:font-display prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-normal
                            prose-p:font-sans prose-p:text-white/80 prose-p:leading-relaxed
                            prose-a:text-lsr-orange prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-strong:font-bold
                            prose-li:font-sans prose-li:text-white/80
                            prose-blockquote:border-lsr-orange prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                            prose-code:text-lsr-orange prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
          {content}
        </article>
        
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-white/30">End of Transmission</span>
            <div className="h-1 w-12 bg-lsr-orange" />
          </div>
        </div>
      </div>
    </main>
  )
}
