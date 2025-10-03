import SectionReveal from "./SectionReveal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Hotlap({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="aspect-[21/9] w-full bg-black/30">
          <iframe
            src="https://www.youtube.com/embed/fbS2ExGupLU?autoplay=1&mute=1&loop=1&playlist=fbS2ExGupLU&controls=0&showinfo=0&modestbranding=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-lsr-orange tracking-wide">Hotlap of the Week</h2>
            <p className="text-white/75">Bryan Reyes · GT-M Hyperion V8 (GT3) · Daytona · 1:46.043</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm underline cursor-pointer">See analysis</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>This feature is coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </SectionReveal>
  )
}
