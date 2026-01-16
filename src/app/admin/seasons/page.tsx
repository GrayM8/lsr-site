import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllSeasons } from "@/server/queries/seasons";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { deleteSeason } from "./actions";

export default async function SeasonsAdminPage() {
  const seasons = await getAllSeasons();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Seasons</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin">Back to Admin Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/seasons/new">New Season</Link>
          </Button>
        </div>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Series</th>
              <th className="p-4">Year</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4">{s.series?.title || "-"}</td>
                <td className="p-4">{s.year}</td>
                <td className="p-4 text-sm text-muted-foreground">
                    {s.startAt ? new Date(s.startAt).toLocaleDateString() : "?"} - {s.endAt ? new Date(s.endAt).toLocaleDateString() : "?"}
                </td>
                <td className="p-4 space-x-2">
                  <Button size="sm" asChild>
                    <Link href={`/admin/seasons/${s.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deleteSeason.bind(null, s.id)} className="inline-block">
                    <ConfirmSubmitButton
                      size="sm"
                      variant="destructive"
                      message="Are you sure you want to delete this season?"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
            {seasons.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No seasons found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
