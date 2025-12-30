import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter, Bebas_Neue } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { Analytics } from "@vercel/analytics/react"
import React from "react";
import { SiteFooter } from "@/components/site-footer"
import { LiveBanner } from "@/components/live-banner";
import ReimaginedGlobalBanner from "@/components/reimagined-global-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // for body text
  display: "swap",
})

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display", // for headings
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Longhorn Sim Racing", template: "%s · LSR" },
  description: "UT Austin Longhorn Sim Racing Club",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  colorScheme: "dark",
  themeColor: "#262626", // lsr-charcoal
  openGraph: {
    type: "website",
    siteName: "Longhorn Sim Racing",
    images: [
      {
        url: "/brand/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Longhorn Sim Racing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/brand/og.jpeg",
        width: 1200,
        height: 630,
        alt: "Longhorn Sim Racing",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/news/rss.xml",
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebas.variable} h-full dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
    <body className="min-h-dvh flex flex-col font-sans">
    <ThemeProvider>
      <ReimaginedGlobalBanner />
      <LiveBanner />
      <SiteHeader />
        <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeProvider>
    <Analytics />
    </body>
    </html>
  )
}
