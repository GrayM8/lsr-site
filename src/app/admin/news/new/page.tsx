import { PostForm } from "../_components/post-form"

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <PostForm />
    </div>
  )
}
