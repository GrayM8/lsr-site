import SectionReveal from "./SectionReveal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Hotlap({ index }: { index: number }) {
  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl mt-10 md:mt-14" clipClass="rounded-2xl">
      <div className="block rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="aspect-[16/9] w-full bg-black/30 grid place-items-center text-white/60">
          <span>Hotlap clip coming soon</span>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl text-lsr-orange tracking-wide">Hotlap of the Week</h3>
            <p className="text-white/75">GT3 · COTA · 1:46.302 (placeholder)</p>
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
