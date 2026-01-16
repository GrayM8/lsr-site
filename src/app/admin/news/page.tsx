import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/server/auth/guards";

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  async function deletePost(formData: FormData) {
    "use server";
    await requireRole(['admin', 'officer']);
    const id = formData.get("id") as string;
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/news");
    revalidatePath("/news");
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">News Articles</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin">Back to Admin Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/news/new">Create Article</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">No posts found.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{post.title}</td>
                  <td className="p-4 align-middle">{post.slug}</td>
                  <td className="p-4 align-middle">
                    {post.publishedAt ? (
                      <span className="inline-flex items-center rounded-full border border-transparent bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-600 transition-colors hover:bg-green-500/25">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-transparent bg-yellow-500/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-600 transition-colors hover:bg-yellow-500/25">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    {post.publishedAt ? post.publishedAt.toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/news/${post.id}`}>Edit</Link>
                      </Button>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <Button variant="destructive" size="sm" type="submit">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
