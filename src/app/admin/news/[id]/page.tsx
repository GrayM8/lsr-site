import { notFound } from "next/navigation"
import { prisma } from "@/server/db"
import { PostForm } from "../_components/post-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  // Transform to schema shape
  const postData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    bodyMd: post.bodyMd,
    published: post.publishedAt !== null,
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm post={postData} />
    </div>
  )
}
