import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllSeries } from "@/server/queries/series";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { deleteSeries } from "@/app/admin/series/actions";

export default async function SeriesAdminPage() {
  const series = await getAllSeries();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Event Series</h1>
        <Button asChild>
          <Link href="/admin/series/new">New Series</Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-4">{s.title}</td>
                <td className="p-4">{s.slug}</td>
                <td className="p-4 space-x-2">
                  <Button size="sm" asChild>
                    <Link href={`/admin/series/${s.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deleteSeries.bind(null, s.id)} className="inline-block">
                    <ConfirmSubmitButton
                      size="sm"
                      variant="destructive"
                      message="Are you sure you want to delete this series?"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
