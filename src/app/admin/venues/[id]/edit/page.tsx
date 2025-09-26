import { notFound } from "next/navigation";
import { VenueForm } from "@/components/admin/venue-form";
import { getVenue } from "@/server/queries/venue";

export default async function EditVenuePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const venue = await getVenue(id);

  if (!venue) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Venue</h1>
      <VenueForm venue={venue} />
    </main>
  );
}
