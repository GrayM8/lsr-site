import { Separator } from "@/components/ui/separator"
import { EventsSearch } from "@/components/events-search"
import { EventsFilters } from "@/components/events-filters"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Send } from "lucide-react"
import { getAllEvents } from "@/server/queries/events";
import { Event, Venue, EventSeries } from "@prisma/client"
import { GeoPoint } from "@/types";
import Image from "next/image"
import Link from "next/link"

const isLive = (event: Event) => {
  const now = new Date();
  const start = new Date(event.startsAtUtc);
  const end = new Date(event.endsAtUtc);
  return start <= now && now <= end;
};

function FeaturedEventCard({ event }: { event: Event & { series: EventSeries | null, venue: Venue | null } }) {
  const startsAt = new Date(event.startsAtUtc)
  const endsAt = new Date(event.endsAtUtc)
  const live = isLive(event);

  const venue = event.venue
  const geo = venue?.geo as GeoPoint | null
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 flex flex-col md:flex-row overflow-hidden">
      {event.heroImageUrl && (
        <div className="md:w-1/2">
          <Image src={event.heroImageUrl} alt={event.title} width={800} height={600} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 md:p-8 flex-grow md:w-1/2">
        <div className="flex items-center gap-2 mb-2">
          {live && <Badge className="bg-red-600 text-white">Live</Badge>}
          <Badge variant="outline" className="border-lsr-orange text-lsr-orange">{event.series?.title}</Badge>
        </div>
        <h3 className="font-semibold text-2xl md:text-3xl">
          <Link href={`/events/${event.slug}`} className="hover:underline">{event.title}</Link>
        </h3>
        <p className="text-base text-white/70 mt-2 flex-grow">{event.summary || event.description}</p>
        <div className="text-sm text-white/60 mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{startsAt.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {startsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} - {endsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
          {venue && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                {directionsUrl ? (
                  <Link href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <span>{venue.name}</span>
                    <Send className="h-3 w-3" />
                  </Link>
                ) : (
                  <span>{venue.name}</span>
                )}
                <div className="text-xs text-white/50">
                  {[venue.addressLine1, venue.addressLine2, venue.city, venue.state, venue.postalCode].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link href={`/events/${event.slug}`} className="text-lsr-orange hover:underline text-sm">
            See Details
          </Link>
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: Event & { series: EventSeries | null, venue: Venue | null } }) {
  const startsAt = new Date(event.startsAtUtc)
  const endsAt = new Date(event.endsAtUtc)
  const live = isLive(event);

  const venue = event.venue
  const geo = venue?.geo as GeoPoint | null
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 flex flex-col overflow-hidden`}>
      {event.heroImageUrl && (
        <Image src={event.heroImageUrl} alt={event.title} width={400} height={200} className="w-full h-40 object-cover" />
      )}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {live && <Badge className="bg-red-600 text-white">Live</Badge>}
            <Badge variant="outline" className="border-lsr-orange text-lsr-orange">{event.series?.title}</Badge>
          </div>
          <h3 className={`font-semibold text-xl`}>
            <Link href={`/events/${event.slug}`} className="hover:underline">{event.title}</Link>
          </h3>
          <p className={`text-sm text-white/70 mt-2 flex-grow`}>{event.summary || event.description}</p>
        </div>
        <div className="text-sm text-white/60 mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{startsAt.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {startsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} - {endsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
          {venue && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                {directionsUrl ? (
                  <Link href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                    <span>{venue.name}</span>
                    <Send className="h-3 w-3" />
                  </Link>
                ) : (
                  <span>{venue.name}</span>
                )}
                <div className="text-xs text-white/50">
                  {[venue.addressLine1, venue.addressLine2, venue.city, venue.state, venue.postalCode].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link href={`/events/${event.slug}`} className="text-lsr-orange hover:underline text-sm">
            See Details
          </Link>
        </div>
      </div>
    </div>
  )
}


export default async function EventsIndexPage({
                                                searchParams,
                                              }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q.trim() : ""
  const typeParam = sp.type
  const selectedTypes = (Array.isArray(typeParam) ? typeParam : typeParam ? [typeParam] : [])
    .map((t) => t.toString().toLowerCase())

  const allEvents = await getAllEvents()
  const allSeries = [...new Set(allEvents.map(e => e.series?.title).filter((s): s is string => !!s))].sort();

  const filteredEvents = allEvents.filter((e) => {
    const searchMatch = !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      (e.summary && e.summary.toLowerCase().includes(q.toLowerCase())) ||
      (e.description && e.description.toLowerCase().includes(q.toLowerCase())) ||
      (e.venue && e.venue.name.toLowerCase().includes(q.toLowerCase()))

    const typeMatch = selectedTypes.length === 0 ||
      (e.series && selectedTypes.includes(e.series.title.toLowerCase()))

    return searchMatch && typeMatch
  })

  const now = new Date();
  const upcomingEvents = filteredEvents.filter(e => new Date(e.endsAtUtc) >= now);
  const pastEvents = filteredEvents.filter(e => new Date(e.endsAtUtc) < now).sort((a, b) => new Date(b.startsAtUtc).getTime() - new Date(a.startsAtUtc).getTime());
  
  const featuredEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const otherUpcomingEvents = upcomingEvents.slice(1);

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Events</h1>
          <div className="ms-auto flex items-center gap-2">
            <EventsSearch q={q} />
            <EventsFilters allTypes={allSeries} selectedTypes={selectedTypes} />
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        {featuredEvent && (
          <>
            <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide mb-4">Next Event</h2>
            <FeaturedEventCard event={featuredEvent} />
            <Separator className="my-8 bg-white/10" />
          </>
        )}

        {otherUpcomingEvents.length > 0 && (
          <>
            <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherUpcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            <Separator className="my-8 bg-white/10" />
          </>
        )}

        {pastEvents.length > 0 && (
          <>
            <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide mb-4">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

        {filteredEvents.length === 0 && (
          <p className="text-muted-foreground">No events found.</p>
        )}
      </div>
    </main>
  )
}
