import HomePageClient from "@/components/home-page-client"
import { getAllPosts } from "@/lib/news"

export default async function Home() {
  const posts = getAllPosts()
  return <HomePageClient posts={posts} />
}