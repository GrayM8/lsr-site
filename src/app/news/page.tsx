import Link from "next/link"
import { getAllPosts } from "@/lib/news"

export const revalidate = 60 // revalidate list once per min

export default function NewsIndexPage() {
  const posts = getAllPosts()
  return (
    <main className="mx-auto max-w-6xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">News</h1>

      {posts.length === 0 && (
        <p className="text-muted-foreground">No posts yet.</p>
      )}

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-xl border p-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold">
                <Link href={`/news/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              <time className="text-sm text-muted-foreground">
                {new Date(p.date).toLocaleDateString()}
              </time>
            </div>
            {p.excerpt && <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>}
            <div className="text-xs text-muted-foreground mt-2">
              {p.author ? `By ${p.author}` : null}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
