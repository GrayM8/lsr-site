import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { Analytics } from "@vercel/analytics/react"
import React from "react";
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Longhorn Sim Racing", template: "%s · LSR" },
  description: "UT Austin Longhorn Sim Racing Club",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  openGraph: { type: "website", siteName: "Longhorn Sim Racing" },
  twitter: { card: "summary_large_image" },
  alternates: {
    types: {
      "application/rss+xml": "/news/rss.xml",
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
    <body className={`${inter.className} min-h-dvh flex flex-col`}>
    <ThemeProvider>
      <SiteHeader />
      {/* This main grows to fill leftover height so the footer drops to the bottom */}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeProvider>
    </body>
    </html>
  )
}
