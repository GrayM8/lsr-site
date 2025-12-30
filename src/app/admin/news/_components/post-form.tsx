"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { newsPostSchema, NewsPostSchema } from "@/schemas/news.schema"
import { createPost, updatePost } from "@/server/actions/news"
import { slugify } from "@/lib/slug"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface PostFormProps {
  post?: NewsPostSchema & { id: string }
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewsPostSchema>({
    resolver: zodResolver(newsPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      bodyMd: post?.bodyMd ?? "",
      published: post?.published ?? false,
    },
  })

  function onSubmit(data: NewsPostSchema) {
    startTransition(async () => {
      let result;
      if (post) {
        result = await updatePost(post.id, data);
      } else {
        result = await createPost(data);
      }

      if (result.success) {
        // toast.success("Post saved")
        router.push("/admin/news");
        router.refresh();
      } else {
        // toast.error(result.error)
        alert("Error: " + result.error);
      }
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("title", e.target.value);
    if (!post) { // Only auto-generate slug for new posts
        const slug = slugify(e.target.value);
        form.setValue("slug", slug);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} onChange={(e) => {
                    field.onChange(e);
                    handleTitleChange(e);
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="post-slug" {...field} />
              </FormControl>
              <FormDescription>
                The URL-friendly name of the post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bodyMd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown)</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your markdown here..." className="h-64 font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this post visible to the public.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : (post ? "Update Post" : "Create Post")}
            </Button>
            <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  )
}
