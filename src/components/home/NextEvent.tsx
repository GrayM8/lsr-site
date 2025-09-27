import { Calendar, Clock, MapPin, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import SectionReveal from "./SectionReveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Event, Venue, EventSeries } from "@prisma/client"
import { GeoPoint } from "@/types";

type Props = {
  index: number
  featuredEvent?: Event & { venue: Venue | null, series: EventSeries | null }
  upcomingEvents: (Event & { venue: Venue | null, series: EventSeries | null })[]
}

export default function NextEvent({ index, featuredEvent, upcomingEvents }: Props) {
  const nextEventDate = featuredEvent ? new Date(featuredEvent.startsAtUtc) : null
  const nextEventEndDate = featuredEvent ? new Date(featuredEvent.endsAtUtc) : null

  const venue = featuredEvent?.venue
  const geo = venue?.geo as GeoPoint | null
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null

  return (
    <SectionReveal index={index} className="mx-auto max-w-6xl" clipClass="rounded-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-lsr-orange tracking-wide">Next Event & Upcoming</h2>
            {featuredEvent ? (
              <p className="text-white/80 mt-2">
                <Link href={`/events/${featuredEvent.slug}`} className="hover:underline">{featuredEvent.title}</Link>
              </p>
            ) : (
              <p className="text-white/80 mt-2">Check back later — schedule is being finalized.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-lsr-orange hover:bg-lsr-orange/90 text-lsr-charcoal-darker">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>

        {featuredEvent && nextEventDate && nextEventEndDate && (
          <div className="mt-6 pt-6 border-t border-white/10 md:flex gap-6">
            <div className="md:w-1/2">
              <Badge variant="outline" className="border-lsr-orange text-lsr-orange mb-2">{featuredEvent.series?.title}</Badge>
              <p className="text-white/80">{featuredEvent.summary}</p>
              <div className="text-sm text-white/60 mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{nextEventDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {nextEventDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} - {nextEventEndDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
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
                <Link href={`/events/${featuredEvent.slug}`} className="text-lsr-orange hover:underline text-sm">See Details</Link>
              </div>
            </div>
            <div
              className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden md:w-1/2">
              {featuredEvent.heroImageUrl ? (
                <Image
                  src={featuredEvent.heroImageUrl}
                  alt={featuredEvent.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/60">[Map or Track Layout Placeholder]</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="font-display text-2xl text-lsr-orange tracking-wide">Also Coming Up...</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 4).map((event) => {
              const eventDate = new Date(event.startsAtUtc)
              return (
                <div key={event.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    {event.series && (
                      <Badge variant="outline" className="border-lsr-orange text-lsr-orange text-xs">
                        {event.series.title}
                      </Badge>
                    )}
                    <div className="text-xs text-white/60">
                      {eventDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <div className="font-medium flex-grow">
                    <Link href={`/events/${event.slug}`} className="hover:underline">{event.title}</Link>
                  </div>
                  {event.summary && (
                    <p className="text-xs text-white/70 mt-1 flex-grow">{event.summary.substring(0, 60)}...</p>
                  )}
                  <div className="mt-2">
                    <Link href={`/events/${event.slug}`} className="text-lsr-orange hover:underline text-sm">See Details</Link>
                  </div>
                </div>
              )
            }) : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs text-white/60">TBD</div>
                <div className="font-medium">Check back later</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
