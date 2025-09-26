import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { getEvent } from "@/app/admin/events/actions";
import { getAllEventSeries } from "@/server/queries/events";
import { getAllVenues } from "@/server/queries/venue";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [event, series, venues] = await Promise.all([
    getEvent(id),
    getAllEventSeries(),
    getAllVenues(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <EventForm event={event} series={series} venues={venues} />
    </main>
  );
}
