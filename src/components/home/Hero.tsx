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
    <section ref={heroRef} className="relative min-h-dvh bg-lsr-charcoal text-white grid place-items-center overflow-hidden mb-10 md:mb-14">
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
        className="relative z-10 max-w-6xl w-full px-6 md:px-8 text-center py-16 md:py-24"
      >
        {/* Badge */}
        <div className="mb-8">
          <div
            className="mx-auto w-fit inline-flex items-center gap-2 rounded-full border border-lsr-orange/30 bg-lsr-orange/10 px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-[0.2em] text-lsr-orange font-bold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lsr-orange animate-pulse"/>
            ESTABLISHED 2025 · UT AUSTIN
          </div>
        </div>

        {/* Headline / Logo */}
        <div className="relative block mx-auto isolate overflow-visible">
          <div className="relative z-10 flex justify-center">
            <Image 
              src="/brand/logos/white_logo.webp"
              alt="Longhorn Sim Racing"
              width={600}
              height={600}
              priority
              className="w-full max-w-[180px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            />
          </div>
          
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 -z-10 bg-lsr-orange/20 blur-[120px] opacity-40 pointer-events-none scale-75" />
        </div>

        <p className="mt-8 md:mt-10 text-lg md:text-2xl text-white/90 font-sans font-medium max-w-3xl mx-auto leading-relaxed">
          Bringing motorsports closer to Longhorns and Longhorns closer to the podium.
        </p>

        {/* credibility chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50">
          <span className="flex items-center gap-2 border-r border-white/10 pr-8 last:border-0 last:pr-0">
            iRacing
          </span>
          <span className="flex items-center gap-2 border-r border-white/10 pr-8 last:border-0 last:pr-0">
            Assetto Corsa
          </span>
          <span className="flex items-center gap-2 border-r border-white/10 pr-8 last:border-0 last:pr-0">
            Weekly Events
          </span>
          <span className="flex items-center gap-2">
            Driver Development
          </span>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
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
