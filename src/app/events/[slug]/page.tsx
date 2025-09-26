import { getEventBySlug } from "@/server/queries/events";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.title,
    description: event.summary,
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const startsAt = new Date(event.startsAtUtc);
  const endsAt = new Date(event.endsAtUtc);

  const venue = event.venue;
  const geo = venue?.geo as any;
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2;
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null;

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      {event.heroImageUrl && (
        <div className="relative h-64 md:h-96">
          <Image
            src={event.heroImageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            {event.series && (
              <Badge variant="outline" className="border-lsr-orange text-lsr-orange mb-2">
                {event.series.title}
              </Badge>
            )}
            <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide mt-2">
              {event.title}
            </h1>
          </div>
          <Button asChild className="bg-lsr-orange hover:bg-lsr-orange/90 text-lsr-charcoal-darker mt-2 md:mt-0">
            <Link href="/events">See All Events</Link>
          </Button>
        </div>

        {event.summary && (
          <p className="text-lg text-white/80 mt-4">{event.summary}</p>
        )}

        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-lsr-orange tracking-wide">Details</h2>
            <div className="text-sm text-white/80 space-y-3">
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
                        <span className="font-semibold">{venue.name}</span>
                        <Send className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="font-semibold">{venue.name}</span>
                    )}
                    <div className="text-xs text-white/60">
                      {[venue.addressLine1, venue.addressLine2, venue.city, venue.state, venue.postalCode].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {event.description && (
            <div>
              <h2 className="font-display text-2xl text-lsr-orange tracking-wide">About</h2>
              <p className="text-white/80 mt-2 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
