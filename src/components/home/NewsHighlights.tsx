import Link from "next/link"
import SectionReveal from "./SectionReveal"
import { type NewsFrontmatter } from "@/lib/news"

export default function NewsHighlights({ index, posts }: { index: number, posts: Array<NewsFrontmatter & { slug: string }> }) {
  const latest = posts.slice(0, 3)

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-none">
      <div className="bg-lsr-charcoal border border-white/5 p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display font-black italic text-4xl md:text-5xl text-white uppercase tracking-normal">
              The <span className="text-lsr-orange">Bulletin</span>
            </h2>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Latest from the paddock</p>
          </div>
          <Link href="/news" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-lsr-orange transition-colors">
            All News
            <div className="h-px w-8 bg-white/20 group-hover:bg-lsr-orange group-hover:w-12 transition-all" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((p) => (
            <Link key={p.slug} href={`/news/${p.slug}`} className="group relative border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.07] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-lsr-orange transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-lsr-orange bg-lsr-orange/10 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <h3 className="font-sans font-bold text-lg text-white group-hover:text-lsr-orange transition-colors leading-snug mb-3">
                {p.title}
              </h3>
              
              {p.excerpt && (
                <p className="font-sans text-sm text-white/50 line-clamp-3 mb-6 leading-relaxed">
                  {p.excerpt}
                </p>
              )}
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Read Report</span>
                <div className="h-px flex-1 bg-white/5 mx-3 group-hover:bg-lsr-orange/50 transition-colors" />
              </div>
            </Link>
          ))}
          
          {Array.from({ length: Math.max(0, 3 - latest.length) }).map((_, i) => (
            <div key={i} className="border border-white/5 bg-white/5 p-6 opacity-30 flex flex-col justify-center text-center py-12">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Transmission</div>
              <div className="font-sans font-bold text-white/40 text-sm">Upcoming Report</div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}
