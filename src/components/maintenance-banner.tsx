"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, AlertTriangle } from "lucide-react"

export function MaintenanceBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsVisible(true)
  }, [pathname])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isMounted || !isVisible) return null

  return (
    <div className="relative bg-lsr-charcoal border-b border-white/5 shadow-lg overflow-hidden group">
      {/* Animated Borders */}
      <div className="absolute top-0 h-[2px] bg-amber-500 z-20 animate-[lsr-border-top_4s_linear_infinite] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[2px] bg-amber-500 z-20 animate-[lsr-border-side_4s_linear_infinite] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[2px] bg-amber-500 z-20 animate-[lsr-border-side_4s_linear_infinite] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[2px] bg-amber-500 z-20 animate-[lsr-border-bottom_4s_linear_infinite] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[2px] bg-amber-500 z-20 animate-[lsr-border-bottom_4s_linear_infinite] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 min-h-[48px] flex items-center">

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
            </span>
            <span className="font-display font-black text-amber-500 uppercase tracking-[0.2em] text-sm sm:text-base italic">
              Maintenance
            </span>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center text-center">
            <AlertTriangle className="h-4 w-4 text-amber-500/60 shrink-0" />
            <span className="font-sans text-white/50 text-xs tracking-wide text-center">
              We&apos;re experiencing database issues &mdash; some content may be unavailable.
              <br />
              Thank you for your patience while we get things back to normal.
            </span>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleDismiss}
              className="text-white/30 hover:text-white transition-colors p-1 relative z-30"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="flex md:hidden flex-col gap-2 w-full py-0.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span className="font-display font-black text-amber-500 uppercase tracking-widest text-[10px] italic">
                Maintenance
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="text-white/30 hover:text-white transition-colors p-1 -mr-1 relative z-30"
              aria-label="Dismiss banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 px-2 text-center">
            <span className="font-sans text-white/50 text-[10px] tracking-wide text-center">
              We&apos;re experiencing database issues &mdash; some content may be unavailable. Thank you for your patience while we get things back to normal.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
