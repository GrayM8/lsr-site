"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Copy, Check, Rss } from "lucide-react"

export default function SubscribePage() {
  // Build absolute feed URL on the client, fallback to relative if SSR only
  const feedUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/news/rss.xml`
    }
    return "/news/rss.xml"
  }, [])

  const encoded = encodeURIComponent(feedUrl)
  const feedly = `https://feedly.com/i/subscription/feed/${encoded}`
  const inoreader = `https://www.inoreader.com/?add_feed=${encoded}`
  const newsblur = `https://www.newsblur.com/?url=${encoded}`

  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback: create a temp input if clipboard API is blocked
      const el = document.createElement("input")
      el.value = feedUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 md:px-8 py-14">
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] md:text-xs uppercase tracking-wider text-white/70 mb-4">
          <Rss className="h-3.5 w-3.5 text-lsr-orange" />
          Subscribe
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide leading-tight">
          Follow Longhorn Sim Racing
        </h1>
        <p className="mt-3 text-white/80">
          Add our RSS feed to your reader to get news and updates instantly.
        </p>
      </header>

      {/* Copy box */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 flex items-center gap-3">
        <code className="text-sm md:text-base text-white/90 select-all overflow-x-auto">
          {feedUrl}
        </code>
        <div className="ml-auto">
          <Button
            size="sm"
            className="bg-lsr-orange hover:bg-lsr-orange/90 text-white"
            onClick={copy}
            aria-label="Copy RSS feed URL"
            title="Copy RSS feed URL"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Reader quick-links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <a
          href={feedly}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
        >
          Open in Feedly
        </a>
        <a
          href={inoreader}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
        >
          Open in Inoreader
        </a>
        <a
          href={newsblur}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
        >
          Open in NewsBlur
        </a>
      </div>

      {/* Raw feed fallback */}
      <p className="mt-6 text-sm text-white/70">
        Prefer the raw XML?{" "}
        <Link href="/news/rss.xml" className="underline hover:no-underline">
          Open the RSS feed
        </Link>
        .
      </p>
    </main>
  )
}
