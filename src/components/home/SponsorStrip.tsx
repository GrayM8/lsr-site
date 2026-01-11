import Link from "next/link"
import SectionReveal from "./SectionReveal"

export default function SponsorStrip({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-none">
      <div className="bg-lsr-charcoal border border-white/5 p-8 md:p-12 relative overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] [background-size:10px_10px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display font-black italic text-4xl md:text-5xl text-white uppercase tracking-normal">
              The <span className="text-lsr-orange">Partners</span>
            </h2>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Support from the industry</p>
          </div>
          <Link href="/sponsors" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-lsr-orange hover:text-white transition-colors">
            Become a Partner
            <div className="h-px w-8 bg-lsr-orange/30 group-hover:bg-white group-hover:w-12 transition-all" />
          </Link>
        </div>

        <div className="relative z-10">
          <div className="border border-white/5 bg-white/[0.01] p-8 text-center">
            <p className="font-sans font-bold text-white/20 uppercase tracking-[0.4em] text-[10px]">
              Sponsorship Opportunities Available for 2025-2026
            </p>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
