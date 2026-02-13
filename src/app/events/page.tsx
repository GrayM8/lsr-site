import { Separator } from "@/components/ui/separator"
import { EventsSearch } from "@/components/events-search"
import { EventsFilters } from "@/components/events-filters"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Send } from "lucide-react"
import { LocalTime, LocalTimeRange } from "@/components/ui/local-time"
import { getAllEvents } from "@/server/queries/events";
import { Event, Venue, EventSeries } from "@prisma/client"
import { isEventLive } from "@/lib/events";
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { DatabaseUnavailable } from "@/components/database-unavailable"

export const metadata: Metadata = {
  title: "Events Schedule",
  description: "View the official Longhorn Sim Racing event calendar, upcoming races, and past results.",
  alternates: {
    canonical: "/events",
  },
};

function FeaturedEventCard({ event }: { event: Event & { series: EventSeries | null, venue: Venue | null } }) {
  const startsAt = new Date(event.startsAtUtc)
  const endsAt = new Date(event.endsAtUtc)
  const live = isEventLive(event);

  const venue = event.venue
  const directionsUrl = venue?.googleMapsUrl || null

  return (
    <div className="border-l-4 border-lsr-orange bg-white/[0.03] flex flex-col md:flex-row overflow-hidden group">
      {event.heroImageUrl && (
        <div className="md:w-3/5 relative overflow-hidden aspect-video">
          <Image 
            src={event.heroImageUrl} 
            alt={event.title} 
            width={800} 
            height={450} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent md:bg-gradient-to-l md:from-black/80 md:to-transparent" />
        </div>
      )}
      <div className="p-8 md:p-10 flex-grow md:w-2/5 flex flex-col justify-center">
        <div className="flex items-stretch gap-3 mb-6 h-6">
          {live && (
            <div className="flex items-center gap-1.5 border border-red-600/30 bg-red-600/10 px-2 rounded-none">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="font-display font-black text-red-500 uppercase tracking-widest text-[10px] italic pt-0.5">Live Now</span>
            </div>
          )}
          {event.series && (
            <div className="flex items-center border border-lsr-orange text-lsr-orange px-2 rounded-none">
                <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">{event.series.title}</span>
            </div>
          )}
        </div>
        <h3 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase tracking-normal leading-none mb-4">
          <Link href={`/events/${event.slug}`} className="hover:text-lsr-orange transition-colors">{event.title}</Link>
        </h3>
        <p className="font-sans text-sm text-white/60 leading-relaxed mb-8 line-clamp-3">{event.summary || event.description}</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-lsr-orange" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-white/90">
              <LocalTime date={startsAt} format="weekday-date" />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-lsr-orange" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-white/90">
              <LocalTimeRange start={startsAt} end={endsAt} />
            </span>
          </div>
          {venue && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-lsr-orange" />
              <div>
                {directionsUrl ? (
                  <Link href={directionsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-lsr-orange transition-colors flex items-center gap-1 font-sans font-bold text-xs uppercase tracking-widest text-white/90">
                    <span>{venue.name}</span>
                    <Send className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="font-sans font-bold text-xs uppercase tracking-widest text-white/90">{venue.name}</span>
                )}
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  {[venue.city, venue.state].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 text-lsr-orange hover:text-white transition-colors font-sans font-black text-[10px] uppercase tracking-[0.2em]">
          Event Details <span className="text-lg leading-none">→</span>
        </Link>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: Event & { series: EventSeries | null, venue: Venue | null } }) {
  const startsAt = new Date(event.startsAtUtc)
  const live = isEventLive(event);

  return (
    <div className="group border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col overflow-hidden">
      {event.heroImageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={event.heroImageUrl} 
            alt={event.title} 
            width={400} 
            height={200} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {live && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2 py-1 shadow-lg">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                </span>
                <span className="font-display font-black text-red-500 uppercase tracking-widest text-[8px] italic">Live</span>
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          {event.series && (
            <span className="text-[8px] font-black uppercase tracking-widest text-lsr-orange mb-2 block">
              {event.series.title}
            </span>
          )}
          <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight leading-tight mb-2 group-hover:text-lsr-orange transition-colors">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
          <p className="font-sans text-xs text-white/50 line-clamp-2">{event.summary}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-white/40" />
            <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/60">
              <LocalTime date={startsAt} format="short-date" />
            </span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-white/40" />
              <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/60 truncate">
                {event.venue.name}
              </span>
            </div>
          )}
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

  let allEvents;
  try {
    allEvents = await getAllEvents();
  } catch (error) {
    console.error('[Events] Failed to load events:', error);
    return (
      <main className="bg-lsr-charcoal text-white min-h-screen">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
          <div className="mb-10">
            <h1 className="font-display font-black italic text-5xl md:text-6xl text-white uppercase tracking-normal">
              The <span className="text-lsr-orange">Schedule</span>
            </h1>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Official Event Calendar</p>
          </div>
          <DatabaseUnavailable title="Schedule Unavailable" />
        </div>
      </main>
    );
  }
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
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display font-black italic text-5xl md:text-6xl text-white uppercase tracking-normal">
              The <span className="text-lsr-orange">Schedule</span>
            </h1>
            <p className="font-sans font-bold text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Official Event Calendar</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <EventsSearch q={q} />
            <EventsFilters allTypes={allSeries} selectedTypes={selectedTypes} />
          </div>
        </div>

        {featuredEvent && (
          <>
            <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="font-display font-black italic text-2xl md:text-3xl text-white uppercase tracking-normal">Next <span className="text-lsr-orange">Event</span></h2>
            </div>
            <FeaturedEventCard event={featuredEvent} />
            <div className="h-12" />
          </>
        )}

        {otherUpcomingEvents.length > 0 && (
          <>
            <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="font-display font-black italic text-2xl md:text-3xl text-white uppercase tracking-normal">Upcoming <span className="text-lsr-orange">Sessions</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherUpcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            <div className="h-12" />
          </>
        )}

        {pastEvents.length > 0 && (
          <>
            <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="font-display font-black italic text-2xl md:text-3xl text-white/40 uppercase tracking-normal">Past <span className="text-lsr-orange/40">Results</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {pastEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}

        {filteredEvents.length === 0 && (
          <div className="border border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-sm">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}
