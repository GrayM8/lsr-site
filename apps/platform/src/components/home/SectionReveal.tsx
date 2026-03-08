"use client"

import React, { useEffect, useRef } from "react"
import {
  motion,
  useReducedMotion,
  useInView,
  useAnimation,
  type Transition,
  type Variants,
} from "framer-motion"

export default function SectionReveal({
                                        id,
                                        index,
                                        className = "",
                                        children,
                                        coverClass = "bg-lsr-charcoal",
                                        clipClass = "rounded-none", // ← pass your tile radius here (e.g., "rounded-2xl")
                                      }: {
  id?: string
  index: number
  className?: string
  children: React.ReactNode
  coverClass?: string
  clipClass?: string
}) {
  const prefersReduced = useReducedMotion()
  const DURATION = prefersReduced ? 0 : 1.6

  // direction + geometry
  const dir = index % 2 === 0 ? "ltr" : "rtl"
  const skewDeg = dir === "ltr" ? -12 : 12

  // Oversize + offset so the cover blankets fully (no pre-peek)
  const coverSideClass = dir === "ltr" ? "-left-[30%]" : "-right-[30%]"
  const coverWidthClass = "w-[160%]"
  const coverEndX = dir === "ltr" ? "140%" : "-140%"

  // Light travels fully off-canvas
  const lightStartX = dir === "ltr" ? "-90%" : "90%"
  const lightEndX   = dir === "ltr" ? "150%" : "-150%"

  // Matched timing (linear position; eased opacity)
  const transitionCover: Transition = { duration: DURATION, ease: "linear" }
  const transitionLight: Transition =
    DURATION === 0
      ? { duration: 0 }
      : {
        x: { duration: DURATION, ease: "linear" },
        opacity: { duration: DURATION, ease: [0.4, 0, 0.2, 1] },
      }

  // Sync start
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const controls = useAnimation()
  useEffect(() => { if (inView) controls.start("shown") }, [inView, controls])

  const coverVariants: Variants = { hidden: { x: 0 }, shown: { x: coverEndX, transition: transitionCover } }
  const lightVariants: Variants = {
    hidden: { x: lightStartX, opacity: 0, visibility: "hidden" },
    shown: {
      x: [lightStartX, lightEndX],
      opacity: [0, 0.85, 0],
      visibility: "visible",
      transition: transitionLight,
      transitionEnd: { visibility: "hidden" },
    },
  }

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      {/* CLIP WRAPPER: confines light & cover to the tile shape */}
      <div className={`relative overflow-hidden ${clipClass}`}>
        {/* content */}
        <div className="relative z-0">{children}</div>

        {/* LIGHT ABOVE COVER, clipped to wrapper */}
        <motion.div
          aria-hidden
          variants={lightVariants}
          initial="hidden"
          animate={controls}
          className="pointer-events-none absolute inset-y-0 -left-[30%] z-30 w-[160%] opacity-70 blur-xl mix-blend-screen transform-gpu"
          style={{
            rotate: `${skewDeg}deg`,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,220,180,0.9) 50%, transparent 100%)",
          }}
        />

        {/* COVER BELOW LIGHT (still hides content until it slides off) */}
        <motion.div
          aria-hidden
          variants={coverVariants}
          initial="hidden"
          animate={controls}
          className={`pointer-events-none absolute inset-y-0 ${coverSideClass} ${coverWidthClass} z-20 transform-gpu ${coverClass}`}
          style={{ skewX: `${skewDeg}deg` }}
        />
      </div>
    </section>
  )
}
