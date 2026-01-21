"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "@/app/admin/events/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { ImageUploader } from "@/components/image-uploader";
import { Event, EventSeries, Venue } from "@prisma/client";

export function EventForm({ event, series, venues }: { event?: Event, series: EventSeries[], venues: Venue[] }) {
  return (
    <div className="overflow-x-auto">
      <form action={event ? updateEvent.bind(null, event.id) : createEvent} className="min-w-[600px]">
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

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-bold mb-4">Registration Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="registrationEnabled" name="registrationEnabled" defaultChecked={event?.registrationEnabled ?? false} />
                <Label htmlFor="registrationEnabled">Enable Registration</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationOpensAt">Opens At (UTC)</Label>
                  <Input 
                    id="registrationOpensAt" 
                    name="registrationOpensAt" 
                    type="datetime-local" 
                    defaultValue={event?.registrationOpensAt ? new Date(event.registrationOpensAt).toISOString().slice(0, 16) : ""} 
                  />
                </div>
                <div>
                  <Label htmlFor="registrationClosesAt">Closes At (UTC)</Label>
                  <Input 
                    id="registrationClosesAt" 
                    name="registrationClosesAt" 
                    type="datetime-local" 
                    defaultValue={event?.registrationClosesAt ? new Date(event.registrationClosesAt).toISOString().slice(0, 16) : ""} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationMax">Max Capacity (Leave empty for unlimited)</Label>
                  <Input 
                    id="registrationMax" 
                    name="registrationMax" 
                    type="number" 
                    defaultValue={event?.registrationMax ?? ""} 
                    placeholder="Unlimited"
                  />
                </div>
                <div className="flex items-center space-x-2 h-full pt-6">
                  <Switch id="registrationWaitlistEnabled" name="registrationWaitlistEnabled" defaultChecked={event?.registrationWaitlistEnabled ?? false} />
                  <Label htmlFor="registrationWaitlistEnabled">Enable Waitlist</Label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
        </div>
      </form>
    </div>
  );
}
