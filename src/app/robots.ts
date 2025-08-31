export default function robots() {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${base}/sitemap.xml` }
}
