
import { getEventForAdmin, getAllEventSeries } from "@/server/queries/events";
import { EventForm } from "@/components/admin/event-form";
import { getAllVenues } from "@/server/queries/venue";
import { notFound } from "next/navigation";

type EditEventArgs = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: EditEventArgs) {
  const { id } = await params;
  const [event, series, venues] = await Promise.all([
    getEventForAdmin(id),
    getAllEventSeries(),
    getAllVenues(),
  ]);

  if (!event) {
    return notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <EventForm event={event} series={series} venues={venues} />
    </main>
  );
}
