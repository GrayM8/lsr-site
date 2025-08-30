import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"


const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
    title: "Longhorn Sim Racing",
    description: "UT Austin Longhorn Sim Racing Club",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider>
            <SiteHeader />
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}