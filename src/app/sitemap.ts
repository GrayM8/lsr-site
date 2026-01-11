import type { MetadataRoute } from "next"
import { prisma } from "@/server/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/drivers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/events`, changeFrequency: "weekly", priority: 0.9 },
        {url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.7},
        {url: `${base}/lone-star-cup`, changeFrequency: "weekly", priority: 0.8},
        {url: `${base}/news`, changeFrequency: "daily", priority: 0.9},
    { url: `${base}/shop`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/sponsors`, changeFrequency: "monthly", priority: 0.6 },
  ]

  // 2. Dynamic: Drivers (Users)
  const users = await prisma.user.findMany({
    where: { status: { not: "deleted" } },
    select: { handle: true, updatedAt: true },
  })
  const driverRoutes: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${base}/drivers/${user.handle}`,
    lastModified: user.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // 3. Dynamic: Events
  const events = await prisma.event.findMany({
    where: { visibility: "public" },
    select: { slug: true, updatedAt: true },
  })
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${base}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // 4. Dynamic: News Posts
  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null }, visibility: "public" },
    select: { slug: true, updatedAt: true },
  })
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/news/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "never", // Posts usually don't change after publication
    priority: 0.7,
  }))

  // 5. Dynamic: Event Series
  const series = await prisma.eventSeries.findMany({
    where: { visibility: "public" },
    select: { slug: true, updatedAt: true },
  })
  const seriesRoutes: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${base}/series/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...driverRoutes,
    ...eventRoutes,
    ...postRoutes,
    ...seriesRoutes,
  ]
}