import { getEventBySlug } from "@/server/queries/events";
import { getIngestedResultsByEventId } from "@/server/queries/results";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Send, Trophy } from "lucide-react";
import Link from "next/link";
import { GeoPoint } from "@/types";
import { Button } from "@/components/ui/button";
import { ResultsTable } from "@/components/results-table";
import { EventRegistrationPanel } from "@/components/event-registration-panel";
import { getSessionUser } from "@/server/auth/session";

type EventPageArgs = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventPageArgs) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const { user } = await getSessionUser();

  if (!event) {
    return notFound();
  }

  const raceSessions = await getIngestedResultsByEventId(event.id);
  const startsAt = new Date(event.startsAtUtc);
  const endsAt = new Date(event.endsAtUtc);
  // const isEventPassed = new Date() > endsAt; // Logic handled by registration config/snapshot

  const venue = event.venue;
  const geo = venue?.geo as GeoPoint | null;
  const hasCoords = geo?.type === "Point" && geo?.coordinates?.length === 2;
  const directionsUrl = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${geo.coordinates[1]},${geo.coordinates[0]}` : null;

  return (
    <main className="bg-lsr-charcoal text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-14 md:py-20">
        <div className="mb-8">
          <Link href="/events" className="group inline-flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-lsr-orange hover:text-white transition-colors">
            <div className="h-px w-8 bg-lsr-orange/30 group-hover:bg-white group-hover:w-12 transition-all" />
            Return to Calendar
          </Link>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-12 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lsr-orange/5 -rotate-45 translate-x-16 -translate-y-16" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {event.series && (
                  <span className="bg-lsr-orange text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                    {event.series.title}
                  </span>
                )}
                <span className="border border-white/20 text-white/60 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                  Official Session
                </span>
              </div>
              
              <h1 className="font-display font-black italic text-4xl md:text-6xl text-white uppercase tracking-normal leading-[0.9] mb-6">
                {event.title}
              </h1>
              
              <div className="prose prose-invert prose-p:font-sans prose-p:text-white/70 prose-p:text-sm prose-p:leading-relaxed max-w-none">
                <p>{event.summary || event.description}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-black border border-white/10 p-6 space-y-6">
                <h3 className="font-sans font-black text-xs uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-4">
                  Session Logistics
                </h3>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-lsr-orange mt-0.5 shrink-0" />
                    <div>
                      <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/40 mb-1">Date</div>
                      <div className="font-sans font-bold text-sm text-white">
                        {startsAt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-lsr-orange mt-0.5 shrink-0" />
                    <div>
                      <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/40 mb-1">Time</div>
                      <div className="font-sans font-bold text-sm text-white">
                        {startsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} - {endsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  {venue && (
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-lsr-orange mt-0.5 shrink-0" />
                      <div>
                        <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/40 mb-1">Circuit / Venue</div>
                        {directionsUrl ? (
                          <Link href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans font-bold text-sm text-white hover:text-lsr-orange transition-colors group">
                            <span>{venue.name}</span>
                            <Send className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          <div className="font-sans font-bold text-sm text-white">{venue.name}</div>
                        )}
                        <div className="text-xs text-white/40 mt-1">
                          {[venue.city, venue.state].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <EventRegistrationPanel eventSlug={slug} userLoggedIn={!!user} />
              </div>
            </div>
          </div>

          {raceSessions.length > 0 && (
            <div className="relative z-10 mt-12 pt-12 border-t border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-5 w-5 text-lsr-orange" />
                <h2 className="font-sans font-black text-sm uppercase tracking-widest text-white">Official Results</h2>
              </div>
              
              <div className="space-y-8">
                {raceSessions.map(session => (
                    <div key={session.id}>
                        <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-white/50 mb-4">
                            {session.sessionType} {session.trackName && `- ${session.trackName}`}
                        </h3>
                        <ResultsTable results={session.results} />
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {event.heroImageUrl && (
          <div className="aspect-[21/9] w-full border border-white/10 bg-black relative overflow-hidden group">
            <Image 
              src={event.heroImageUrl} 
              alt={event.title} 
              width={1600} 
              height={800} 
              className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
            />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 border border-white/10">
              <span className="font-sans font-black text-[9px] uppercase tracking-widest text-white/50">Track Preview</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}