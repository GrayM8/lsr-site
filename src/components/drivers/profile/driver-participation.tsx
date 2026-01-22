
"use client";

import { EyeOff } from 'lucide-react';
import { MyUpcomingEvents } from "@/components/my-upcoming-events";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Defining a type that matches what getUpcomingRegistrations returns locally for prop usage
type UpcomingRegistration = any; 

type DriverParticipationProps = {
  isMe: boolean;
  upcomingRegistrations: UpcomingRegistration[];
};

export function DriverParticipation({ isMe, upcomingRegistrations }: DriverParticipationProps) {
  if (isMe) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal">
                My <span className="text-lsr-orange">Registrations</span>
            </h3>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/30 cursor-help transition-colors hover:text-white/60">
                            <EyeOff className="h-3 w-3" />
                            <span>Private</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[280px] bg-lsr-charcoal border-white/10 text-white/80 text-[10px] p-3 rounded-none shadow-2xl">
                        <p className="leading-relaxed">
                            Your event registrations are only visible to you here on your profile. On individual event pages, the entry list is visible only to signed-in members of the community.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <MyUpcomingEvents registrations={upcomingRegistrations} />
      </div>
    );
  }

  // For non-owners, we omit the section as per requirements if no public summary is available.
  return null; 
}
