import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllVenues } from "@/server/queries/venue";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { deleteVenue } from "@/app/admin/venues/actions";

export default async function VenuesAdminPage() {
  const venues = await getAllVenues();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Venues</h1>
        <Button asChild>
          <Link href="/admin/venues/new">New Venue</Link>
        </Button>
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id} className="border-b">
                <td className="p-4">{v.name}</td>
                <td className="p-4 space-x-2">
                  <Button size="sm" asChild>
                    <Link href={`/admin/venues/${v.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deleteVenue.bind(null, v.id)} className="inline-block">
                    <ConfirmSubmitButton
                      size="sm"
                      variant="destructive"
                      message="Are you sure you want to delete this venue?"
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
