"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Attendee = {
  displayName: string;
  avatarUrl: string | null;
  profileLink: string;
};

type RegistrationSnapshot = {
  eventId: string;
  registrationEnabled: boolean;
  windowStatus: "OPEN" | "CLOSED" | "NOT_OPEN";
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  capacity: number | null;
  registeredCount: number;
  waitlistEnabled: boolean;
  waitlistCount: number;
  myStatus: "REGISTERED" | "WAITLISTED" | "NOT_ATTENDING" | "NONE";
  attendees: Attendee[];
};

export function EventRegistrationPanel({ eventSlug, userLoggedIn }: { eventSlug: string; userLoggedIn: boolean }) {
  const [snapshot, setSnapshot] = useState<RegistrationSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/registration`);
      if (res.ok) {
        const data = await res.json();
        setSnapshot(data);
      }
    } catch (err) {
      console.error("Failed to fetch registration status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, [eventSlug]);

  const handleAction = async (intent: "YES" | "NO") => {
    if (!userLoggedIn) {
      // Trigger auth dialog ideally, but for now redirect or just show message
      // Assuming parent handles 'Log in to register' CTA if not logged in
      return;
    }
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/events/${eventSlug}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      
      if (res.ok) {
        const updatedSnapshot = await res.json();
        setSnapshot(updatedSnapshot);
        router.refresh(); // Refresh server components if needed
      } else {
        const err = await res.json();
        alert(err.message || "Registration failed");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  if (!userLoggedIn) {
    return (
      <div className="pt-6 border-t border-white/10 text-center space-y-4">
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
            Registration and attendee lists are restricted to members only.
        </p>
        <Button 
          className="w-full rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-black uppercase tracking-[0.2em] text-[10px] h-12 transition-all"
          onClick={() => {
             document.dispatchEvent(new CustomEvent("open-auth-dialog")); 
          }}
        >
          Log in to Register & View Attendees
        </Button>
      </div>
    );
  }

  if (loading && !snapshot) {
    return <div className="pt-6 border-t border-white/10 text-center text-white/40 text-xs animate-pulse">Loading registration...</div>;
  }

  if (!snapshot) return null;

  const isFull = snapshot.capacity !== null && snapshot.registeredCount >= snapshot.capacity;
  const canRegister = snapshot.windowStatus === "OPEN" && (!isFull || snapshot.waitlistEnabled);
  const myStatus = snapshot.myStatus;

  return (
    <div className="space-y-6">
      {/* STATUS & CONTROLS */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        {/* Status Display */}
        <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase tracking-widest text-white/60 text-[10px]">Your Status</span>
            <Badge 
                variant={myStatus === "REGISTERED" ? "default" : myStatus === "WAITLISTED" ? "secondary" : "outline"}
                className={cn(
                    "rounded-none font-bold uppercase tracking-wider text-[10px]",
                    myStatus === "REGISTERED" && "bg-green-600 hover:bg-green-600 text-white border-none",
                    myStatus === "WAITLISTED" && "bg-yellow-600 hover:bg-yellow-600 text-white border-none",
                    (myStatus === "NONE" || myStatus === "NOT_ATTENDING") && "text-white/40 border-white/20"
                )}
            >
                {myStatus === "NONE" ? "Not Registered" : myStatus.replace("_", " ")}
            </Badge>
        </div>

        {/* Counts */}
        <div className="flex justify-between items-center text-xs text-white/40">
            <span className="uppercase tracking-widest text-[9px]">Capacity</span>
            <span className="font-mono">
                {snapshot.registeredCount} / {snapshot.capacity === null ? "∞" : snapshot.capacity}
                {snapshot.waitlistEnabled && snapshot.waitlistCount > 0 && (
                    <span className="ml-2 text-yellow-500">({snapshot.waitlistCount} Waitlisted)</span>
                )}
            </span>
        </div>

        {/* Action Buttons */}
        {snapshot.windowStatus === "OPEN" ? (
            <div className="grid grid-cols-2 gap-3">
                <Button 
                    onClick={() => handleAction("YES")}
                    disabled={actionLoading || myStatus === "REGISTERED" || (myStatus === "WAITLISTED") || (!canRegister && myStatus === "NONE")}
                    className={cn(
                        "rounded-none font-black uppercase tracking-[0.1em] text-[10px] h-10 transition-all",
                        myStatus === "REGISTERED" || myStatus === "WAITLISTED" 
                            ? "bg-white/10 text-white/40 cursor-default border border-transparent" 
                            : "bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal"
                    )}
                >
                    {myStatus === "REGISTERED" ? "Registered" : 
                     myStatus === "WAITLISTED" ? "On Waitlist" : 
                     (isFull && snapshot.waitlistEnabled) ? "Join Waitlist" :
                     "Attending"
                    }
                </Button>
                <Button 
                    onClick={() => handleAction("NO")}
                    disabled={actionLoading || myStatus === "NOT_ATTENDING" || myStatus === "NONE"}
                    className="rounded-none border border-white/20 bg-transparent text-white hover:bg-red-900/50 hover:border-red-500/50 hover:text-red-200 font-black uppercase tracking-[0.1em] text-[10px] h-10 transition-all"
                >
                    Not Attending
                </Button>
            </div>
        ) : (
            <div className="text-center py-3 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest border border-white/5">
                {snapshot.windowStatus === "NOT_OPEN" 
                    ? `Opens ${snapshot.registrationOpensAt ? new Date(snapshot.registrationOpensAt).toLocaleString() : "Soon"}`
                    : "Registration Closed"
                }
            </div>
        )}
      </div>

      {/* ATTENDEE LIST */}
      {snapshot.attendees.length > 0 && (
        <div className="pt-6 border-t border-white/10">
            <h3 className="font-sans font-black text-xs uppercase tracking-[0.2em] text-white/30 mb-4">
                Drivers List ({snapshot.attendees.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {snapshot.attendees.map((attendee, idx) => (
                    <Link 
                        key={idx} 
                        href={attendee.profileLink}
                        className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                    >
                        <Avatar className="h-6 w-6 border border-white/10 group-hover:border-lsr-orange/50 transition-colors rounded-none">
                            <AvatarImage src={attendee.avatarUrl || undefined} className="rounded-none" />
                            <AvatarFallback className="text-[9px] bg-white/10 text-white rounded-none">
                                {attendee.displayName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors truncate">
                            {attendee.displayName}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
