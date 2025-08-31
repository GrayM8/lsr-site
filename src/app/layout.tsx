import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { Analytics } from "@vercel/analytics/react"



const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: { default: "Longhorn Sim Racing", template: "%s · LSR" },
  description: "UT Austin Longhorn Sim Racing Club",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  openGraph: { type: "website", siteName: "Longhorn Sim Racing" },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider>
            <SiteHeader />
            {children}
          <Analytics />
        </ThemeProvider>
        </body>
        </html>
    )
}
