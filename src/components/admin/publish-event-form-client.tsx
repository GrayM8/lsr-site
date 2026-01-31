"use client"

import { Button } from "@/components/ui/button";
import { updateEventStatus } from "@/app/admin/events/actions";
import { Event, EventStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PublishEventFormClient({ event }: { event: Event }) {
  const [publishDate, setPublishDate] = useState<string>("");

  const handlePublish = async () => {
    await updateEventStatus(event.id, EventStatus.PUBLISHED, new Date());
  };

  const handleSchedule = async () => {
    if (publishDate) {
      await updateEventStatus(event.id, EventStatus.SCHEDULED, new Date(publishDate));
    }
  };

  const handleCancel = async () => {
    if (confirm("Are you sure you want to CANCEL this event? This is public.")) {
      await updateEventStatus(event.id, EventStatus.CANCELLED);
    }
  };

  const handlePostpone = async () => {
    await updateEventStatus(event.id, EventStatus.POSTPONED);
  };

  const handleRevertToDraft = async () => {
    await updateEventStatus(event.id, EventStatus.DRAFT);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 border border-white/10 bg-white/5 rounded">
        <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-1">Current status</p>
        <p className="text-2xl font-black text-lsr-orange uppercase italic tracking-tight">{event.status}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/80 border-b border-white/10 pb-2">Publishing</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            <strong>Publish Now</strong> makes the event visible immediately. <br/>
            <strong>Schedule</strong> sets a future date/time for the event to automatically become public.
          </p>
          <Button onClick={handlePublish} className="w-full bg-lsr-orange hover:bg-lsr-orange/90 text-white font-bold uppercase tracking-widest py-6">Publish Now</Button>
          
          <div className="pt-4 space-y-3">
            <Label htmlFor="publishDate" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Schedule for later</Label>
            <div className="flex items-center gap-2">
              <Input
                id="publishDate"
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="bg-black/50 border-white/10 focus:border-lsr-orange"
              />
              <Button onClick={handleSchedule} disabled={!publishDate} variant="outline" className="border-lsr-orange/30 text-lsr-orange hover:bg-lsr-orange/10 font-bold uppercase tracking-widest text-xs h-10">
                Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-widest text-white/80 border-b border-white/10 pb-2">Overrides</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Use these states to override the automatic time-based status. Canceled and Postponed events remain public but show their respective badges.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handlePostpone} variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 font-bold uppercase tracking-widest text-[10px] h-12">
              Postpone
            </Button>
            <Button onClick={handleCancel} variant="outline" className="border-red-400/30 text-red-400 hover:bg-red-400/10 font-bold uppercase tracking-widest text-[10px] h-12">
              Cancel Event
            </Button>
          </div>
          
          <div className="pt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Administrative</h3>
            <Button onClick={handleRevertToDraft} variant="ghost" className="w-full text-white/40 hover:text-white hover:bg-white/5 border border-white/5 font-bold uppercase tracking-widest text-[10px]">
              Revert to Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
