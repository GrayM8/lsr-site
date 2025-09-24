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
    await updateEventStatus(event.id, EventStatus.scheduled);
  };

  const handleSchedule = async () => {
    if (publishDate) {
      await updateEventStatus(event.id, EventStatus.scheduled, new Date(publishDate));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p>Current status: {event.status}</p>
      </div>
      <Button onClick={handlePublish}>Publish Now</Button>
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <Label htmlFor="publishDate">Schedule for later</Label>
          <Input
            id="publishDate"
            type="datetime-local"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>
        <Button onClick={handleSchedule} disabled={!publishDate}>
          Schedule
        </Button>
      </div>
    </div>
  );
}
