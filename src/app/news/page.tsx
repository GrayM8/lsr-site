import Link from "next/link"
import { getAllPosts } from "@/lib/news"
import { Separator } from "@/components/ui/separator"
import { NewsSearch } from "@/components/news-search"
import { NewsFilters } from "@/components/news-filters"

export const revalidate = 60 // revalidate list once per min

export default async function NewsIndexPage({
                                              searchParams,
                                            }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q.trim() : ""
  const tagParam = sp.tag
  const selectedTags = (Array.isArray(tagParam) ? tagParam : tagParam ? [tagParam] : [])
    .map((t) => t.toString().toLowerCase())

  const allPosts = getAllPosts()

  const allTags = [...new Set(allPosts.flatMap((p) => p.tags || []))].sort()

  const posts = allPosts.filter((p) => {
    const searchMatch = !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(q.toLowerCase()) ||
      p.author?.toLowerCase().includes(q.toLowerCase())
    
    const tagMatch = selectedTags.length === 0 || 
      p.tags?.some(t => selectedTags.includes(t.toLowerCase()))

    return searchMatch && tagMatch
  })

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">News</h1>
          <div className="ms-auto flex items-center gap-2">
            <NewsSearch q={q} />
            <NewsFilters allTags={allTags} selectedTags={selectedTags} />
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        {posts.length === 0 && (
          <p className="text-muted-foreground">No posts yet.</p>
        )}

        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col">
              {p.tags && p.tags.length > 0 && (
                <div className="text-xs text-white/60 mb-1">
                  {p.tags.join(", ")}
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  <Link href={`/news/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h2>
                <time className="text-sm text-white/60">
                  {new Date(p.date).toLocaleDateString()}
                </time>
              </div>
              {p.excerpt && <p className="text-sm text-white/70 mt-2 flex-grow">{p.excerpt}</p>}
              <div className="text-xs text-white/60 mt-4">
                {p.author ? `By ${p.author}` : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
