"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalTime } from "@/components/ui/local-time";

// Define a type that matches what getUpcomingRegistrations returns
// This avoids importing Prisma types directly in client components if possible, 
// but using them for prop definition is fine.
type UpcomingRegistration = {
  id: string;
  status: string; // "REGISTERED" | "WAITLISTED" | "NOT_ATTENDING"
  createdAt: Date;
  waitlistOrder: number | null;
  event: {
    id: string;
    title: string;
    slug: string;
    startsAtUtc: Date;
    venue: { name: string } | null;
    series: { title: string } | null;
  };
};

export function MyUpcomingEvents({ registrations }: { registrations: any[] }) {
  if (registrations.length === 0) {
    return (
        <div className="border border-white/10 bg-white/[0.02] p-8 text-center space-y-4">
            <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-xs">No upcoming races on your schedule</p>
            <Link 
                href="/events" 
                className="inline-block bg-white/5 hover:bg-lsr-orange hover:text-white text-white/60 font-black uppercase tracking-[0.1em] text-[10px] px-6 py-3 transition-all border border-white/10 hover:border-lsr-orange"
            >
                Browse Events
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((reg) => (
        <Link 
            key={reg.id} 
            href={`/events/${reg.event.slug}`}
            className="block border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors group p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
                {reg.event.series && (
                    <span className="text-[9px] font-black text-lsr-orange uppercase tracking-widest border border-lsr-orange/30 px-1.5 py-0.5 mb-2 inline-block">
                        {reg.event.series.title}
                    </span>
                )}
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-tight group-hover:text-lsr-orange transition-colors">
                    {reg.event.title}
                </h4>
            </div>
            
            <Badge 
                variant="outline" 
                className={cn(
                    "rounded-none text-[9px] font-bold uppercase tracking-widest border",
                    reg.status === "REGISTERED" && "border-green-500/50 text-green-400 bg-green-500/10",
                    reg.status === "WAITLISTED" && "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
                    reg.status === "NOT_ATTENDING" && "border-white/20 text-white/40"
                )}
            >
                {reg.status === "WAITLISTED" && reg.waitlistOrder 
                    ? `Waitlist #${reg.waitlistOrder}`
                    : reg.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-[10px] text-white/60 font-medium uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-white/40" />
                    <span><LocalTime date={reg.event.startsAtUtc} format="short-date" /></span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-white/40" />
                    <span><LocalTime date={reg.event.startsAtUtc} format="time" /></span>
                </div>
                {reg.event.venue && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-white/40" />
                        <span>{reg.event.venue.name}</span>
                    </div>
                )}
            </div>
            
            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-lsr-orange transition-colors">
                Details →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
