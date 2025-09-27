import { getEventBySlug } from "@/server/queries/events";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { GeoPoint } from "@/types";
import { Button } from "@/components/ui/button";

type EventPageArgs = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventPageArgs) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const startsAt = new Date(event.startsAtUtc);
  const endsAt = new Date(event.endsAtUtc);

  const venue = event.venue;
  const geo = venue?.geo as GeoPoint | null;
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2;
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null;

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <div className="mb-4">
          <Button asChild>
            <Link href="/events">Back to All Events</Link>
          </Button>
        </div>
        {event.heroImageUrl && (
          <div className="mb-8">
            <Image src={event.heroImageUrl} alt={event.title} width={1200} height={400} className="w-full h-64 object-cover rounded-2xl" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {event.series && (
              <Badge variant="outline" className="border-lsr-orange text-lsr-orange mb-4">{event.series.title}</Badge>
            )}
            <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide mb-4">{event.title}</h1>
            <p className="text-white/70 mt-2">{event.summary || event.description}</p>
          </div>
          <div className="space-y-4 text-white/80">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="font-semibold text-lg mb-3">Event Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-lsr-orange" />
                  <span>{startsAt.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-lsr-orange" />
                  <span>
                    {startsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} - {endsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
                {venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-lsr-orange mt-0.5" />
                    <div>
                      {directionsUrl ? (
                        <Link href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          <span>{venue.name}</span>
                          <Send className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span>{venue.name}</span>
                      )}
                      <div className="text-sm text-white/50">
                        {[venue.addressLine1, venue.addressLine2, venue.city, venue.state, venue.postalCode].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
