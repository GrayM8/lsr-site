"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle, Clock, CalendarCheck } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CheckInState = 
    | { status: "IDLE" }
    | { status: "LOADING" }
    | { status: "SUCCESS"; timestamp: string }
    | { status: "ERROR"; message: string };

type CheckInStatus = "OPEN" | "NOT_ENABLED" | "NOT_OPEN_YET" | "CLOSED" | "ALREADY_CHECKED_IN";

type CheckInViewProps = {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
    status: CheckInStatus;
    opensAt?: string;
    checkedInAt?: string;
    currentUser: {
        displayName: string;
        handle: string;
        avatarUrl: string | null;
    };
};

export function CheckInView({ eventId, eventSlug, eventTitle, status, opensAt, checkedInAt, currentUser }: CheckInViewProps) {
    const [viewState, setViewState] = useState<CheckInState>(() => {
        if (status === "ALREADY_CHECKED_IN" && checkedInAt) {
            return { status: "SUCCESS", timestamp: new Date(checkedInAt).toLocaleTimeString() };
        }
        return { status: "IDLE" };
    });

    async function handleCheckIn() {
        setViewState({ status: "LOADING" });
        try {
            const res = await fetch(`/api/check-in/${eventId}`, { method: "POST" });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to check in");
            }
            
            setViewState({ status: "SUCCESS", timestamp: new Date().toLocaleTimeString() });
        } catch (err: any) {
            setViewState({ status: "ERROR", message: err.message });
        }
    }

    if (viewState.status === "SUCCESS") {
        return (
            <div className="w-full max-w-md mx-auto border border-white/10 bg-white/[0.02] p-8 md:p-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-lsr-orange/10 -rotate-45 translate-x-12 -translate-y-12" />
                
                <div className="rounded-none bg-green-500/10 p-6 border border-green-500/20">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-display font-black italic text-white uppercase tracking-normal leading-[0.9]">Checked In!</h2>
                    <p className="text-white/60 font-sans font-bold uppercase tracking-widest text-[10px]">{eventTitle}</p>
                    <div className="inline-block border border-white/10 bg-black/40 px-4 py-2">
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            Recorded at {viewState.timestamp}
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-lsr-orange hover:border-lsr-orange/50 uppercase tracking-widest text-xs font-bold rounded-none transition-all" asChild>
                    <Link href={`/events/${eventSlug}`}>Return to Event</Link>
                </Button>
            </div>
        );
    }

    // Handle "Not Enabled" - Neutral Info
    if (status === "NOT_ENABLED") {
        return (
            <Card className="w-full max-w-md mx-auto border-white/10 bg-white/[0.02] rounded-none shadow-2xl">
                <CardHeader className="text-center pb-2 pt-8">
                    <div className="mx-auto bg-white/5 w-16 h-16 flex items-center justify-center mb-6 border border-white/10">
                        <CalendarCheck className="w-8 h-8 text-white/40" />
                    </div>
                    <CardTitle className="text-2xl font-display font-black italic uppercase text-white tracking-tight">Check-in Not Required</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-8 text-center p-8">
                    <div className="space-y-4">
                        <p className="text-white/60 text-sm leading-relaxed font-sans">
                            Attendance check-in is not required for <br/>
                            <span className="text-white font-bold uppercase tracking-wide">{eventTitle}</span>. 
                        </p>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Your registration is sufficient.</p>
                    </div>
                    <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs font-bold rounded-none" asChild>
                        <Link href={`/events/${eventSlug}`}>Return to Event</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Handle "Not Open Yet" - Specific Time
    if (status === "NOT_OPEN_YET") {
        const openDate = opensAt ? new Date(opensAt) : null;
        return (
            <Card className="w-full max-w-md mx-auto border-white/10 bg-white/[0.02] rounded-none shadow-2xl">
                <CardHeader className="text-center pb-2 pt-8">
                    <div className="mx-auto bg-lsr-orange/10 w-16 h-16 flex items-center justify-center mb-6 border border-lsr-orange/20">
                        <Clock className="w-8 h-8 text-lsr-orange" />
                    </div>
                    <CardTitle className="text-2xl font-display font-black italic uppercase text-white tracking-tight">Check-in Not Open</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-8 text-center p-8">
                    <div className="space-y-4 w-full">
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Check-in opens at</p>
                        {openDate && (
                            <div className="bg-black/40 border border-white/10 p-4 w-full">
                                <div className="text-3xl font-display font-black italic text-white">
                                    {openDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </div>
                                <div className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest mt-1">
                                    {openDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        )}
                    </div>
                    <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs font-bold rounded-none" asChild>
                        <Link href={`/events/${eventSlug}`}>Return to Event</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Handle "Closed"
    if (status === "CLOSED") {
        return (
            <Card className="w-full max-w-md mx-auto border-white/10 bg-white/[0.02] rounded-none shadow-2xl">
                <CardHeader className="text-center pb-2 pt-8">
                    <div className="mx-auto bg-red-500/10 w-16 h-16 flex items-center justify-center mb-6 border border-red-500/20">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-display font-black italic uppercase text-white tracking-tight">Check-in Closed</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-8 text-center p-8">
                    <p className="text-white/60 text-sm leading-relaxed font-sans">
                        Check-in for <span className="text-white font-bold">{eventTitle}</span> has ended. <br/>
                        <span className="text-white/40 text-xs uppercase tracking-widest mt-2 block">Please see an officer for assistance.</span>
                    </p>
                    <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 hover:text-white uppercase tracking-widest text-xs font-bold rounded-none" asChild>
                        <Link href={`/events/${eventSlug}`}>Return to Event</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Default: OPEN
    return (
        <Card className="w-full max-w-md mx-auto border-white/10 bg-white/[0.02] rounded-none shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-lsr-orange" />
            <CardHeader className="text-center pt-8 pb-2">
                <CardTitle className="text-3xl font-display font-black italic uppercase text-white tracking-tight leading-[0.9] mb-2">{eventTitle}</CardTitle>
                <CardDescription className="uppercase tracking-[0.2em] text-[10px] font-bold text-lsr-orange mb-4">Event Check-In</CardDescription>
                
                <Link href={`/drivers/${currentUser.handle}`} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 hover:bg-white/10 hover:border-white/10 transition-all group mx-auto w-fit">
                    <Avatar className="h-10 w-10 border border-white/10 group-hover:border-lsr-orange transition-colors rounded-none">
                        <AvatarImage src={currentUser.avatarUrl || undefined} />
                        <AvatarFallback className="bg-lsr-charcoal text-white/40 text-xs rounded-none">{currentUser.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <div className="font-sans font-bold text-sm text-white group-hover:text-lsr-orange transition-colors leading-none mb-1">{currentUser.displayName}</div>
                        <div className="text-[9px] text-white/40 uppercase tracking-widest leading-none">@{currentUser.handle}</div>
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8 p-8">
                <div className="text-center text-white/60 text-sm font-sans px-4 leading-relaxed">
                    Confirm your attendance by tapping the button below.
                </div>
                
                {viewState.status === "ERROR" && (
                    <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-bold uppercase tracking-wide text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {viewState.message}
                    </div>
                )}

                <Button 
                    size="lg" 
                    className="w-full h-16 bg-lsr-orange hover:bg-lsr-orange/90 text-white uppercase tracking-widest font-bold text-sm rounded-none shadow-[0_0_20px_rgba(255,88,0,0.3)] transition-all hover:scale-[1.02]"
                    onClick={handleCheckIn}
                    disabled={viewState.status === "LOADING"}
                >
                    {viewState.status === "LOADING" ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Checking In...
                        </>
                    ) : (
                        "Check In Now"
                    )}
                </Button>
                
                <Button variant="ghost" className="text-white/30 hover:text-white uppercase tracking-widest text-[10px] font-bold" asChild>
                    <Link href={`/events/${eventSlug}`}>Cancel</Link>
                </Button>
            </CardContent>
        </Card>
    );
}