"use client"

import React from "react"

export default function FooterFade({
                                     className = "",
                                     /** Use true if you place this INSIDE a padded container you want to cancel (-mx).
                                      *  Use false if you render it OUTSIDE (full-bleed already). */
                                     bleed = false,
                                     /** Tailwind height classes */
                                     height = "h-24 md:h-32",
                                   }: {
  className?: string
  bleed?: boolean
  height?: string
}) {
  const bleedClasses = bleed ? "-mx-6 md:-mx-8" : ""
  return (
    <div aria-hidden className={`relative ${bleedClasses} ${className}`}>
      <div className={`${height} bg-gradient-to-b from-lsr-charcoal to-black`} />
    </div>
  )
}
