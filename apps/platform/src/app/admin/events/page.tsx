import { getAllEventsForAdmin } from "@/server/queries/events";
import { EventsConsole } from "@/components/admin/events-console";

export default async function EventsAdminPage() {
  const events = await getAllEventsForAdmin();

  return (
    <div className="h-full">
      <EventsConsole initialEvents={events} />
    </div>
  );
}