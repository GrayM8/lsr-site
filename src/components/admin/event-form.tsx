"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "@/app/admin/events/actions";


import { ImageUploader } from "@/components/image-uploader";
import { Event, EventSeries, Venue } from "@prisma/client";

export function EventForm({ event, series, venues }: { event?: Event, series: EventSeries[], venues: Venue[] }) {
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
          <label htmlFor="seriesId">Series</label>
          <select
            id="seriesId"
            name="seriesId"
            defaultValue={event?.seriesId ?? ""}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          >
            <option value="">None</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="venueId">Venue</label>
          <select
            id="venueId"
            name="venueId"
            defaultValue={event?.venueId ?? ""}
            className="w-full p-2 border rounded-md bg-gray-800 text-white"
          >
            <option value="">None</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startsAtUtc">Starts At (UTC)</label>
          <Input id="startsAtUtc" name="startsAtUtc" type="datetime-local" defaultValue={event?.startsAtUtc ? event.startsAtUtc.toISOString().slice(0, 16) : ""} required />
        </div>
        <div>
          <label htmlFor="endsAtUtc">Ends At (UTC)</label>
          <Input id="endsAtUtc" name="endsAtUtc" type="datetime-local" defaultValue={event?.endsAtUtc ? event.endsAtUtc.toISOString().slice(0, 16) : ""} required />
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
          <label htmlFor="description">Description <i className="text-sm text-gray-400">(for internal use)</i></label>
          <Input id="description" name="description" defaultValue={event?.description ?? ""} />
        </div>
        <div>
          <label>Hero Image</label>
          <ImageUploader name="heroImageUrl" defaultValue={event?.heroImageUrl} />
        </div>
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
      </div>
    </form>
  );
}
