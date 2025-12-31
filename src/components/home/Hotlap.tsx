import SectionReveal from "./SectionReveal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Hotlap({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-none">
      <div className="relative border border-white/5 bg-lsr-charcoal overflow-hidden group">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-lsr-orange z-10" />
        
        <div className="aspect-[21/9] w-full bg-black relative">
          <iframe
            src="https://www.youtube.com/embed/fbS2ExGupLU?autoplay=1&mute=1&loop=1&playlist=fbS2ExGupLU&controls=0&showinfo=0&modestbranding=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 pointer-events-none border-[20px] border-lsr-charcoal/20" />
        </div>
        
        <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-lsr-charcoal to-black/40">
          <div>
            <h2 className="font-display font-black italic text-4xl text-white uppercase tracking-tighter mb-2">
              Hotlap <span className="text-lsr-orange">of the week</span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-sans font-black text-xs uppercase tracking-[0.2em] text-white">Bryan Reyes</span>
              <span className="text-white/20 text-xs">•</span>
              <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-white/50">GT-M Hyperion V8 (GT3)</span>
              <span className="text-white/20 text-xs">•</span>
              <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-white/50">Daytona International</span>
              <span className="text-white/20 text-xs md:hidden">•</span>
              <span className="font-display font-black italic text-lsr-orange text-xl md:ml-4 tracking-tighter">1:46.043</span>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="h-12 border border-white/10 hover:border-lsr-orange hover:bg-lsr-orange/5 px-8 font-sans font-black uppercase tracking-widest text-[10px] text-white transition-all">
                  Telemetry Analysis
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-lsr-orange text-white border-none rounded-none font-bold uppercase tracking-widest text-[10px] py-2">
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </SectionReveal>
  )
}
