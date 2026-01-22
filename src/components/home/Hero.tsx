"use client"
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
    <section ref={heroRef} className="relative min-h-dvh bg-lsr-charcoal text-white flex flex-col items-center justify-center overflow-hidden mb-10 md:mb-14">
      {/* Background image (intense + dynamic) */}
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
          fetchPriority="high"
          sizes="100vw"
          className="object-cover scale-105 opacity-50"
        />
        {/* strong vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]"/>
        {/* extra readability layers */}
        <div className="absolute inset-0 bg-lsr-charcoal/40"/>
        <div className="absolute inset-0 bg-gradient-to-b from-lsr-charcoal/80 via-transparent to-lsr-charcoal"/>
        {/* subtle tech pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:repeating-linear-gradient(45deg,white_0px,white_1px,transparent_1px,transparent_10px)]"/>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, ease: "easeOut"}}
        className="relative z-10 max-w-6xl w-full px-6 md:px-8 text-center min-h-dvh flex flex-col pt-16 pb-24"
      >
        {/* Top Spacer / Badge */}
        <div className="flex-[0.6] flex flex-col justify-end pb-8 md:pb-12">
          <div
            className="mx-auto w-fit inline-flex items-center gap-2 rounded-full border border-lsr-orange/30 bg-lsr-orange/10 px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-lsr-orange font-bold">
            <span className="inline-block h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-lsr-orange animate-pulse"/>
            ESTABLISHED 2025 · UT AUSTIN
          </div>
        </div>

        {/* Headline / Logo (Centered Vertically) */}
        <div className="relative block mx-auto isolate overflow-visible shrink-0">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h1 className="font-display font-black italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-normal leading-[0.85] sm:leading-none uppercase text-white text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span className="block sm:inline">Longhorn</span>
              <span className="block sm:inline sm:ml-4">Sim Racing</span>
            </h1>
            <span className="font-sans font-bold text-[9px] sm:text-base md:text-xl lg:text-2xl uppercase tracking-[0.1em] sm:tracking-[0.6em] text-white/50 leading-none mt-4 md:mt-6 text-center mr-[-0.1em] sm:mr-[-0.6em] whitespace-nowrap">
              UNIVERSITY OF TEXAS AT AUSTIN
            </span>
          </div>
          
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 -z-10 bg-lsr-orange/20 blur-[120px] opacity-40 pointer-events-none scale-75" />
        </div>

        {/* Bottom Spacer / Buttons */}
        <div className="flex-1 flex flex-col justify-start pt-12 md:pt-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              asChild
              className="group relative bg-lsr-orange text-white hover:bg-lsr-orange/90 font-bold uppercase tracking-widest px-10 py-8 rounded-none transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Link href="#join-the-grid">
                Join the Grid
                <span className="absolute bottom-0 left-0 w-full h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"/>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white/20 hover:border-white text-white font-bold uppercase tracking-widest px-10 py-8 rounded-none bg-transparent hover:bg-white hover:text-lsr-charcoal transition-all duration-300"
            >
              <Link href="/sponsors">Sponsor LSR</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* scrolling stat ticker banner */}
      <div
        className="group absolute bottom-0 inset-x-0 overflow-hidden border-t border-white/10 bg-black/20 backdrop-blur-sm z-20">
        {/* edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-lsr-charcoal to-transparent z-20"/>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-lsr-charcoal to-transparent z-20"/>

        {/* track (two copies for seamless loop) */}
        <div
          className="flex w-[200%] will-change-transform animate-[lsr-ticker_28s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* ... ticker content copies ... */}
          <ul className="flex shrink-0 items-center gap-10 whitespace-nowrap px-8 py-3">
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">100+ Discord Members</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Weekly Events</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">iRacing</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Assetto Corsa</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Driver Development</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Watch Parties</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">F1 Fan Community</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Open Practices</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">In-House League</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Collegiate Racing</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Competitive Events</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Racing Rivalries</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Telemetry Analysis</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Automotive Engineering</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">IRL Motorsports</li>
            <li className="text-white/60">•</li>
          </ul>
          <ul className="flex shrink-0 items-center gap-10 whitespace-nowrap px-8 py-3">
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">100+ Discord Members</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Weekly Events</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">iRacing</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Assetto Corsa</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Driver Development</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Watch Parties</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">F1 Fan Community</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Open Practices</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">In-House League</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Collegiate Racing</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Competitive Events</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Racing Rivalries</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Telemetry Analysis</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">Automotive Engineering</li>
            <li className="text-white/60">•</li>
            <li className="font-display uppercase tracking-wide text-lsr-orange drop-shadow-[0_4px_16px_rgba(191,87,0,0.45)]">IRL Motorsports</li>
            <li className="text-white/60">•</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
