import Link from "next/link"
import SectionReveal from "./SectionReveal"
import { type NewsFrontmatter } from "@/lib/news"

export default function NewsHighlights({ index, posts }: { index: number, posts: Array<NewsFrontmatter & { slug: string }> }) {
  const latest = posts.slice(0, 3)

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-lsr-orange tracking-wide">Latest News</h2>
          <Link href="/news" className="text-sm underline hover:no-underline">All news</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latest.map((p) => (
            <Link key={p.slug} href={`/news/${p.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              {p.tags && p.tags.length > 0 && (
                <div className="text-xs text-white/60 mb-1">
                  {p.tags.join(", ")}
                </div>
              )}
              <div className="font-semibold">{p.title}</div>
              {p.excerpt && <div className="text-white/70 text-sm mt-1">{p.excerpt}</div>}
            </Link>
          ))}
          {Array.from({ length: Math.max(0, 3 - latest.length) }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/60 mb-1">Coming Soon</div>
              <div className="font-semibold">Future post</div>
              <div className="text-white/70 text-sm mt-1">Stay tuned for more news...</div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
