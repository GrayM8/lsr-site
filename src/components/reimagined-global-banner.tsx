"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import ReimaginedCountdown from "@/components/reimagined-countdown"

export default function ReimaginedGlobalBanner() {
  const [showCountdown, setShowCountdown] = useState(false)
  const pathname = usePathname()

  // Auto-open on Home Page after 3 seconds
  useEffect(() => {
    if (pathname === "/") {
      const timer = setTimeout(() => {
        setShowCountdown(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <>
      <AnimatePresence>
        {!showCountdown && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-50 bg-lsr-orange text-white px-4 py-2.5 flex items-center justify-center gap-3 cursor-pointer hover:bg-lsr-orange/90 transition-colors shadow-lg"
            onClick={() => setShowCountdown(true)}
          >
            <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-center">
              LSR Reimagined Countdown <span className="mx-2 opacity-60">|</span> Big news coming soon...
            </span>
            <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors">
              <span>View</span>
              <ArrowRight size={12} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCountdown && (
          <ReimaginedCountdown onClose={() => setShowCountdown(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
