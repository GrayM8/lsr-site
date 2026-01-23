"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type CheckInState = 
    | { status: "IDLE" }
    | { status: "LOADING" }
    | { status: "SUCCESS"; timestamp: string }
    | { status: "ERROR"; message: string };

type CheckInViewProps = {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
    initialStatus: {
        canCheckIn: boolean;
        reason?: string;
        alreadyCheckedIn?: boolean;
        checkedInAt?: Date | null;
    };
};

export function CheckInView({ eventId, eventSlug, eventTitle, initialStatus }: CheckInViewProps) {
    const [state, setState] = useState<CheckInState>(() => {
        if (initialStatus.alreadyCheckedIn && initialStatus.checkedInAt) {
            return { status: "SUCCESS", timestamp: new Date(initialStatus.checkedInAt).toLocaleTimeString() };
        }
        return { status: "IDLE" };
    });

    async function handleCheckIn() {
        setState({ status: "LOADING" });
        try {
            const res = await fetch(`/api/check-in/${eventId}`, { method: "POST" });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Failed to check in");
            }
            
            // If API returns success (even if idempotent alreadyCheckedIn), we show success
            setState({ status: "SUCCESS", timestamp: new Date().toLocaleTimeString() });
        } catch (err: any) {
            setState({ status: "ERROR", message: err.message });
        }
    }

    if (state.status === "SUCCESS") {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="rounded-full bg-green-500/20 p-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Checked In!</h2>
                    <p className="text-white/60">{eventTitle}</p>
                    <p className="text-sm text-white/40 mt-2">Recorded at {state.timestamp}</p>
                </div>
                <Button variant="outline" className="mt-8" asChild>
                    <a href={`/events/${eventSlug}`}>Back to Event</a>
                </Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">{eventTitle}</CardTitle>
                <CardDescription>Event Check-In</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
                {!initialStatus.canCheckIn ? (
                    <div className="text-center space-y-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                        <p className="text-red-200 font-medium">{initialStatus.reason}</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center text-white/60 text-sm">
                            Confirm your attendance by tapping the button below.
                        </div>
                        
                        {state.status === "ERROR" && (
                            <div className="w-full p-3 rounded bg-red-500/20 text-red-200 text-sm text-center">
                                {state.message}
                            </div>
                        )}

                        <Button 
                            size="lg" 
                            className="w-full text-lg h-16 font-bold bg-lsr-orange hover:bg-lsr-orange/90 text-white"
                            onClick={handleCheckIn}
                            disabled={state.status === "LOADING"}
                        >
                            {state.status === "LOADING" ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Checking In...
                                </>
                            ) : (
                                "Check In Now"
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
