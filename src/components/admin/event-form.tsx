"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "@/app/admin/events/actions";


import { Event } from "@prisma/client";

export function EventForm({ event }: { event?: Event }) {
  return (
    <form action={event ? updateEvent.bind(null, event.id) : createEvent}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <Input id="slug" name="slug" defaultValue={event?.slug} required />
        </div>
        <div>
          <label htmlFor="startsAtUtc">Starts At (UTC)</label>
          <Input id="startsAtUtc" name="startsAtUtc" type="datetime-local" defaultValue={event?.startsAtUtc.toISOString().slice(0, 16)} required />
        </div>
        <div>
          <label htmlFor="endsAtUtc">Ends At (UTC)</label>
          <Input id="endsAtUtc" name="endsAtUtc" type="datetime-local" defaultValue={event?.endsAtUtc.toISOString().slice(0, 16)} required />
        </div>
        <div>
          <label htmlFor="timezone">Timezone</label>
          <Input id="timezone" name="timezone" defaultValue={event?.timezone} required />
        </div>
        <div>
          <label htmlFor="summary">Summary</label>
          <Input id="summary" name="summary" defaultValue={event?.summary ?? ""} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Input id="description" name="description" defaultValue={event?.description ?? ""} />
        </div>
        <div>
          <label htmlFor="heroImageUrl">Hero Image URL</label>
          <Input id="heroImageUrl" name="heroImageUrl" defaultValue={event?.heroImageUrl ?? ""} />
        </div>
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
      </div>
    </form>
  );
}
