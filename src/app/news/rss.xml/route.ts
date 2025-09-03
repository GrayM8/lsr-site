import { getAllPosts } from "@/lib/news"

export const revalidate = 60 // rebuild feed at most once per minute

function baseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export async function GET() {
  const site = baseUrl()
  const posts = getAllPosts()

  const items = posts
    .map(p => {
      const link = `${site}/news/${p.slug}`
      const pub = new Date(p.date).toUTCString()
      const desc = p.excerpt ? `<description><![CDATA[${p.excerpt}]]></description>` : ""
      return `
        <item>
          <title>${esc(p.title)}</title>
          <link>${esc(link)}</link>
          <guid isPermaLink="true">${esc(link)}</guid>
          <pubDate>${pub}</pubDate>
          ${desc}
        </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Longhorn Sim Racing — News</title>
      <link>${site}/news</link>
      <description>Announcements and blog posts from Longhorn Sim Racing.</description>
      <language>en</language>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  })
}
