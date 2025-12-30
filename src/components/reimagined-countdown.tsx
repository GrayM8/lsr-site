"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

/**
 * CONFIGURATION
 * Target: January 10, 2026 @ 15:00 CST (America/Chicago)
 * ISO string with offset: 2026-01-10T15:00:00-06:00
 */
const TARGET_DATE = "2026-01-10T15:00:00-06:00"

/**
 * Helpers for time calculation
 */
function calculateTimeLeft() {
  const difference = +new Date(TARGET_DATE) - +new Date()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    finished: false,
  }
}

interface ReimaginedCountdownProps {
  onClose: () => void
}

export default function ReimaginedCountdown({ onClose }: ReimaginedCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering logic after mount
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format with leading zeros: 0 -> "00"
  const f = (num: number) => num.toString().padStart(2, "0")

  const display = mounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false }

  const CountdownGrid = ({ className, showLabels = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { showLabels?: boolean }) => (
    <div className={`grid grid-cols-7 items-center gap-x-0 md:gap-x-1 leading-none ${className}`} {...props}>
      {/* Row 1: Numbers & Colons */}
      <span className="text-[12vw] md:text-[7vw] font-display font-bold tracking-wide text-center">
        {f(display.days)}
      </span>
      <span className="text-[8vw] md:text-[4.5vw] animate-blink font-display text-center">
        :
      </span>
      <span className="text-[12vw] md:text-[7vw] font-display font-bold tracking-wide text-center">
        {f(display.hours)}
      </span>
      <span className="text-[8vw] md:text-[4.5vw] animate-blink font-display text-center">
        :
      </span>
      <span className="text-[12vw] md:text-[7vw] font-display font-bold tracking-wide text-center">
        {f(display.minutes)}
      </span>
      <span className="text-[8vw] md:text-[4.5vw] animate-blink font-display text-center">
        :
      </span>
      <span className="text-[12vw] md:text-[7vw] font-display font-bold tracking-wide text-center">
        {f(display.seconds)}
      </span>

      {/* Row 2: Labels (only if showLabels is true) */}
      {showLabels && (
        <>
          <span className="mt-[-1.2vw] md:mt-[-0.7vw] text-[2.8vw] md:text-[1.4vw] uppercase tracking-widest font-bold text-white/90 text-center">Days</span>
          <span />
          <span className="mt-[-1.2vw] md:mt-[-0.7vw] text-[2.8vw] md:text-[1.4vw] uppercase tracking-widest font-bold text-white/90 text-center">Hrs</span>
          <span />
          <span className="mt-[-1.2vw] md:mt-[-0.7vw] text-[2.8vw] md:text-[1.4vw] uppercase tracking-widest font-bold text-white/90 text-center">Mins</span>
          <span />
          <span className="mt-[-1.2vw] md:mt-[-0.7vw] text-[2.8vw] md:text-[1.4vw] uppercase tracking-widest font-bold text-white/90 text-center">Secs</span>
        </>
      )}
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative aspect-video w-[90vw] md:w-[50vw] overflow-hidden rounded-xl border border-white/10 bg-neutral-950 shadow-2xl font-mono text-neutral-100 selection:bg-white/20"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/5"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* 
          Background Image and Texture
          Using gal_04.jpeg as the base layer, darkened and desaturated.
        */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.1] opacity-60"
            style={{ backgroundImage: `url("/images/gal_04.jpeg")` }} 
          />
          <div className="absolute inset-0 bg-neutral-950/30" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/80" />

        <div className="relative z-10 flex flex-col h-full">
          {/* ZONE 1: TOP-LEFT CONTEXT */}
          <header className="absolute top-0 left-0 w-full p-4 md:p-10 opacity-70 z-30 pointer-events-none">
            <h1 className="text-[10px] md:text-base font-medium uppercase leading-relaxed tracking-[0.2em]">
              <span className="font-semibold opacity-100">LSR REIMAGINED</span>
              <br />
              <span className="opacity-60 text-[0.9em]">RACE CONTROL // PRE-GRID</span>
            </h1>
          </header>

          {/* ZONE 2: CENTER HERO */}
          <main className="flex h-full w-full flex-col items-center justify-center text-center mt-0">
            {display.finished ? (
              <div className="flex flex-col items-center animate-pulse">
                <span className="mb-4 text-xs md:text-sm uppercase tracking-[0.2em] text-red-500 font-bold">
                  SESSION START
                </span>
                <div className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter text-lsr-orange drop-shadow-[0_6px_24px_rgba(191,87,0,0.45)]">
                  LIGHTS OUT
                </div>
              </div>
            ) : (
              <>
                {/* COUNTDOWN */}
                <div className="relative isolate w-full flex flex-col justify-center items-center py-8 md:py-12">
                  {/* Blur Band with Sharper Falloff */}
                  <div 
                    className="absolute inset-0 -z-10 bg-white/[0.04] backdrop-blur-xl"
                    style={{
                      maskImage: "radial-gradient(ellipse at center, black 40%, transparent 65%)",
                      WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 65%)"
                    }}
                  />

                  <div className="-mb-2 md:mb-4 flex items-center justify-center gap-2 md:gap-4 relative z-10 w-full max-w-4xl mx-auto">
                    <div className="h-[1px] w-[5vw] md:w-[8vw] bg-gradient-to-l from-white/40 to-transparent" />
                    <span className="text-[2vw] md:text-[1.2vw] uppercase tracking-[0.4em] font-bold opacity-90 text-center whitespace-nowrap">
                      LIGHTS OUT IN
                    </span>
                    <div className="h-[1px] w-[5vw] md:w-[8vw] bg-gradient-to-r from-white/40 to-transparent" />
                  </div>

                  <div className="relative z-10 px-6 md:px-10 py-4">
                    <div className="relative">
                      {/* Base Layer (Orange) */}
                      <CountdownGrid showLabels className="text-lsr-orange drop-shadow-[0_6px_24px_rgba(191,87,0,0.45)] relative z-10" />
                      
                      {/* Spotlight Layer (White Overlay) */}
                      <motion.div
                        aria-hidden
                        className="pointer-events-none select-none absolute inset-0 z-20 text-transparent mix-blend-screen"
                        style={{
                            "--gx": 0.25,
                            "--gy": 0.35,
                            backgroundImage: "radial-gradient(400px 300px at calc(var(--gx) * 100%) calc(var(--gy) * 100%), rgba(255,255,255,0.95), rgba(255,255,255,0) 60%)",
                            WebkitTextFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                        } as any}
                        animate={{
                          ["--gx"]: [0, 1, 0], // Sweep full width
                          ["--gy"]: [0.30, 0.65, 0.35],
                        }}
                        transition={{duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror"}}
                      >
                        <CountdownGrid showLabels />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>

          {/* ZONE 3: BOTTOM-RIGHT CONFIRMATION & READY FOR LAUNCH */}
          <footer className="absolute bottom-0 w-full p-4 md:p-10 flex flex-col items-end gap-1 z-30 opacity-30">
            <p className="text-[9px] md:text-xs tracking-[0.2em] uppercase text-right font-bold">
              READY FOR LAUNCH
            </p>
            <p className="text-[10px] md:text-sm tracking-widest uppercase text-right">
              JAN 10 // 15:00 CST
            </p>
          </footer>
        </div>

        <style jsx global>{`
          /* REFINEMENT 1: Custom Blink Animation */
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .animate-blink {
            animation: blink 1s step-end infinite; 
            animation: blink 1s ease-in-out infinite;
          }

          /* REFINEMENT 4: Slow Pulse for Status Dot */
          @keyframes slowPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-slow-pulse {
            animation: slowPulse 6s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-pulse, .animate-scanline, .animate-blink, .animate-slow-pulse {
              animation: none;
              opacity: 1; /* reset opacity for blinkers */
            }
          }
        `}</style>
      </motion.div>
    </motion.div>
  )
}
