import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllEventsForAdmin } from "@/server/queries/events";
import { EventsConsole } from "@/components/admin/events-console";

export default async function EventsAdminPage() {
  const events = await getAllEventsForAdmin();

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 uppercase tracking-widest text-xs font-bold h-9">
            <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        <EventsConsole initialEvents={events} />
      </div>
    </main>
  );
}