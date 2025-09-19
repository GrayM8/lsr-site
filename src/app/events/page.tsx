import { Separator } from "@/components/ui/separator"
import { EventsSearch } from "@/components/events-search"
import { EventsFilters } from "@/components/events-filters"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { placeholderEvents, eventTypes } from "@/lib/events"
import Image from "next/image"

function EventCard({ event, isFeatured = false }: { event: (typeof placeholderEvents)[0], isFeatured?: boolean }) {
  const eventDate = new Date(event.date)
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col ${isFeatured ? "md:col-span-2" : ""}`}>
      <div className="flex-grow">
        <Badge variant="outline" className="border-lsr-orange text-lsr-orange mb-2">{event.type}</Badge>
        <h3 className={`font-semibold ${isFeatured ? "text-2xl" : "text-xl"}`}>{event.title}</h3>
        <p className={`text-sm text-white/70 mt-2 flex-grow ${isFeatured ? "text-base" : ""}`}>{event.description}</p>
      </div>
      <div className="text-sm text-white/60 mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{eventDate.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{eventDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
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

  const events = placeholderEvents.filter((e) => {
    const searchMatch = !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.description.toLowerCase().includes(q.toLowerCase()) ||
      e.location.toLowerCase().includes(q.toLowerCase())

    const typeMatch = selectedTypes.length === 0 ||
      selectedTypes.includes(e.type.toLowerCase())

    return searchMatch && typeMatch
  })

  const featuredEvent = events.find(e => e.isFeatured)
  const otherEvents = events.filter(e => !e.isFeatured)

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl md:text-5xl text-lsr-orange tracking-wide">Events</h1>
          <div className="ms-auto flex items-center gap-2">
            <EventsSearch q={q} />
            <EventsFilters allTypes={eventTypes} selectedTypes={selectedTypes} />
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        {featuredEvent && (
          <>
            <h2 className="font-display text-3xl text-lsr-orange tracking-wide mb-4">Next Event</h2>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              {/* Left side: Text */}
              <div className="p-6 flex flex-col">
                <div className="flex-grow">
                  <Badge variant="outline"
                         className="border-lsr-orange text-lsr-orange mb-2">{featuredEvent.type}</Badge>
                  <h3 className="font-semibold text-2xl">{featuredEvent.title}</h3>
                  <p className="text-base text-white/70 mt-2 flex-grow">{featuredEvent.description}</p>
                </div>
                <div className="text-sm text-white/60 mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredEvent.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(featuredEvent.date).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{featuredEvent.location}</span>
                  </div>
                </div>
              </div>
              {/* Right side: Image */}
              <div className="bg-lsr-charcoal-darker min-h-[200px]">
                {featuredEvent.image ? (
                  <Image
                    src={featuredEvent.image}
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
            <Separator className="my-6 bg-white/10" />
          </>
        )}


        {events.length === 0 && (
          <p className="text-muted-foreground">No events found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEvents.map((e) => (
            <EventCard key={e.title} event={e} />
          ))}
        </div>
      </div>
    </main>
  )
}
