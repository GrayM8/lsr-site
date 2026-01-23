import { getAllPostsForAdmin } from "@/server/queries/news";
import { NewsConsole } from "@/components/admin/news-console";

export default async function AdminNewsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="h-full">
      <NewsConsole initialPosts={posts} />
    </div>
  );
}