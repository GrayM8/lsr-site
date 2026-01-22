import "./globals.css"
import { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Montserrat, Kanit } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { Analytics } from "@vercel/analytics/react"
import React from "react";
import { SiteFooter } from "@/components/site-footer"
import { LiveBanner } from "@/components/live-banner";
import { getCachedSessionUser } from "@/server/auth/cached-session";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans", // for body text
  display: "swap",
})

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display", // for headings
  display: "swap",
})

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#262626",
}

export const metadata: Metadata = {
  title: { default: "Longhorn Sim Racing | UT Austin", template: "%s | LSR" },
  description: "UT Austin Longhorn Sim Racing Club",
  metadataBase: new URL("https://www.longhornsimracing.org"),
  openGraph: {
    type: "website",
    siteName: "Longhorn Sim Racing",
    images: [
      {
        url: "/brand/og.png",
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
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "Longhorn Sim Racing",
      },
    ],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/news/rss.xml",
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, roles } = await getCachedSessionUser();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${kanit.variable} h-full dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
    <body className="min-h-dvh flex flex-col font-sans">
    <ThemeProvider>
      <LiveBanner />
      <SiteHeader user={user} roles={roles} />
        <main className="flex-1">{children}</main>
      <SiteFooter />
    </ThemeProvider>
    <Analytics />
    </body>
    </html>
  )
}
