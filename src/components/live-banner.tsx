import { getLiveEvents } from "@/server/queries/events";
import Link from "next/link";
import { Event } from "@prisma/client";

export async function LiveBanner() {
  const liveEvents = await getLiveEvents();

  if (liveEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white text-center p-2">
      {liveEvents.map((event: Event) => (
        <Link key={event.id} href={`/events/${event.slug}`} className="hover:underline">
          <span className="font-bold">LIVE:</span> {event.title} is happening now!
        </Link>
      ))}
    </div>
  );
}
