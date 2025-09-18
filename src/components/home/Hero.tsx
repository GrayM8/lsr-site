import {useRef} from "react";
import {motion, useReducedMotion, useScroll, useTransform} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"], // 0 at hero top, 1 at hero bottom
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0px", "-250px"]) // subtle upward drift

  return (
    <section ref={heroRef} className="relative min-h-dvh bg-lsr-charcoal text-white grid place-items-center px-6 md:px-8 overflow-x-clip mb-10 md:mb-14">
      {/* Background image (blurred + dimmed) */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 overflow-hidden transform-gpu [will-change:transform]"
        style={{y: prefersReduced ? 0 : y}}
      >
        <Image
          src="/images/lsr-hero3.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[2.5px] md:blur-[3px] scale-110 opacity-60"
        />
        {/* soft radial vignette toward the center */}
        <div className="absolute inset-1 bg-[radial-gradient(900px_circle_at_50%_35%,transparent,rgba(0,0,0,0.65))]"/>
        {/* extra readability layers */}
        <div className="absolute inset-0 bg-lsr-charcoal/30"/>
        <div className="absolute inset-0 bg-gradient-to-b from-lsr-charcoal/80 via-transparent to-lsr-charcoal/90"/>
        {/* subtle tech pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay [background-image:repeating-linear-gradient(135deg,white_0px,white_1px,transparent_1px,transparent_11px)]"/>
      </motion.div>

      {/* Content */}
      <motion.section
        initial={{opacity: 0, y: 24}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="z-10 max-w-5xl w-full text-center py-16 md:py-24"
      >
        {/* Badge (forces its own line) */}
        <div className="mb-6">
          <div
            className="mx-auto w-fit inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-wider text-white/70">
            <span className="inline-block h-2 w-2 rounded-full bg-lsr-orange"/>
            Established 2025 · UT Austin
          </div>
        </div>

        {/* Headline with searchlight-on-text */}
        <div className="relative block w-fit mx-auto isolate">
          {/* Base orange text */}
          <h1
            className="relative z-10 font-display text-lsr-orange text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide drop-shadow-[0_6px_24px_rgba(191,87,0,0.45)] font-bold">
            LONGHORN&nbsp;SIM&nbsp;RACING
          </h1>

          {/* Moving searchlight, clipped to letters only */}
          {(() => {
            type SpotlightVars = {
              "--gx": number
              "--gy": number
              backgroundImage: string
              WebkitTextFillColor: string
              WebkitBackgroundClip: string
              backgroundClip: string
            }
            const style: React.CSSProperties & SpotlightVars = {
              "--gx": 0.25,
              "--gy": 0.35,
              backgroundImage:
                "radial-gradient(170px 120px at calc(var(--gx) * 100%) calc(var(--gy) * 100%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%)",
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }
            return (
              <motion.span
                aria-hidden
                className="pointer-events-none select-none absolute inset-0 z-20 font-display font-bold text-transparent mix-blend-screen
                   text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide"
                style={style}
                animate={{
                  ["--gx"]: [0.15, 0.85, 0.25, 0.70, 0.40],
                  ["--gy"]: [0.30, 0.30, 0.65, 0.50, 0.35],
                }}
                transition={{duration: 12, ease: "easeInOut", repeat: Infinity, repeatType: "mirror"}}
              >
                LONGHORN&nbsp;SIM&nbsp;RACING
              </motion.span>
            )
          })()}
        </div>


        <p className="mt-5 md:mt-6 text-base md:text-xl text-white/85">
          Bringing motorsports closer to Longhorns and Longhorns closer to the podium.
        </p>

        {/* credibility chips */}
        <ul
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/70">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange"/> iRacing
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange"/> Assetto Corsa
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange"/> Weekly Events
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lsr-orange"/> Driver Development
          </li>
        </ul>

        <div className="mt-8 md:mt-10 flex items-center justify-center gap-4">
          <Button
            size="lg"
            asChild
            className="bg-lsr-orange text-white hover:bg-lsr-orange/90 font-semibold px-7 py-6 rounded-xl shadow-lg"
          >
            <Link href="#join-the-grid">Join the Grid</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/20 text-white hover:bg-white/10 px-7 py-6 rounded-xl"
          >
            <Link href="/sponsors">Sponsor LSR</Link>
          </Button>
        </div>

        {/* subtle divider */}
        <div className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent"/>

        {/* development note */}
        <p className="mt-6 text-xs text-white/60 italic">
          ⚠️ This website is in active development.
        </p>
      </motion.section>

      {/* scrolling stat ticker banner */}
      <div
        className="group absolute bottom-0 inset-x-0 -mx-6 md:-mx-8 overflow-hidden border-t border-white/10 bg-black/20 backdrop-blur-sm z-20">        {/* edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-lsr-charcoal to-transparent z-20"/>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-lsr-charcoal to-transparent z-20"/>

        {/* track (two copies for seamless loop) */}
        <div
          className="flex w-[200%] will-change-transform animate-[lsr-ticker_28s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* 1st copy */}
          <ul className="flex shrink-0 items-center gap-10 whitespace-nowrap px-8 py-3">
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">100+
              Discord Members
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Weekly
              Events
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">iRacing
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Assetto
              Corsa
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Driver
              Development
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Watch
              Parties
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">F1
              Fan Community
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Open
              Practices
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">In-House
              League
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Collegiate
              Racing
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Competitive
              Events
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Racing
              Rivalries
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Telemetry
              Analysis
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Automotive
              Engineering
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">IRL
              Motorsports
            </li>
            <li className="text-white/60">•</li>
          </ul>

          {/* 2nd copy (identical) */}
          <ul className="flex shrink-0 items-center gap-10 whitespace-nowrap px-8 py-3">
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">100+
              Discord Members
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Weekly
              Events
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">iRacing
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Assetto
              Corsa
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Driver
              Development
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Watch
              Parties
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">F1
              Fan Community
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Open
              Practices
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">In-House
              League
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Collegiate
              Racing
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Competitive
              Events
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Racing
              Rivalries
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Telemetry
              Analysis
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Automotive
              Engineering
            </li>
            <li className="text-white/60">•</li>
            <li
              className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">IRL
              Motorsports
            </li>
            <li className="text-white/60">•</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
