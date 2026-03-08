import { EventForm } from "@/components/admin/event-form";
import { getAllEventSeries } from "@/server/queries/events";
import { getAllVenues } from "@/server/queries/venue";

export default async function NewEventPage() {
  const [series, venues] = await Promise.all([
    getAllEventSeries(),
    getAllVenues(),
  ]);

  return (
    <main className="mx-auto max-w-4xl p-8 pb-32">
      <h1 className="text-3xl font-bold mb-6">New Event</h1>
      <div className="overflow-x-auto">
        <EventForm series={series} venues={venues} />
      </div>
    </main>
  );
}
