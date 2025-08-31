import type { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly" },
    { url: `${base}/drivers`, changeFrequency: "daily" },
    { url: `${base}/sponsors`, changeFrequency: "weekly" },
    { url: `${base}/events`, changeFrequency: "weekly" },
  ]
}
