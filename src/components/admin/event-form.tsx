"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent, updateEvent } from "@/app/admin/events/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { ImageUploader } from "@/components/image-uploader";
import { Event, EventSeries, Venue } from "@prisma/client";
import { useState } from "react";
import { DEFAULT_TIMEZONE, TIMEZONES, dateToZonedValue } from "@/lib/dates";

export function EventForm({ event, series, venues }: { event?: Event, series: EventSeries[], venues: Venue[] }) {
  // Initialize timezone state from event or default
  const [timezone, setTimezone] = useState<string>(event?.timezone || DEFAULT_TIMEZONE);

  return (
    <div className="overflow-x-auto">
      <form action={event ? updateEvent.bind(null, event.id) : createEvent} className="min-w-[600px]">
        {/* Hidden input to ensure timezone is submitted even if state controls it */}
        <input type="hidden" name="timezone" value={timezone} />
        
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

          <div className="p-4 border border-white/10 rounded-md bg-white/5 space-y-4">
            <h3 className="text-md font-bold text-white/80 uppercase tracking-widest">Time & Location</h3>
            
            <div>
              <label htmlFor="timezone-select">Event Timezone</label>
              <select
                id="timezone-select"
                // No 'name' attribute here because we use the hidden input for the form submission
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-800 text-white"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startsAtUtc">Starts At ({timezone})</label>
                <Input 
                  id="startsAtUtc" 
                  name="startsAtUtc" 
                  type="datetime-local" 
                  // Key forces re-render when timezone changes to update the displayed local time
                  key={`start-${timezone}`} 
                  defaultValue={dateToZonedValue(event?.startsAtUtc, timezone)} 
                  required 
                />
              </div>
              <div>
                <label htmlFor="endsAtUtc">Ends At ({timezone})</label>
                <Input 
                  id="endsAtUtc" 
                  name="endsAtUtc" 
                  type="datetime-local" 
                  key={`end-${timezone}`}
                  defaultValue={dateToZonedValue(event?.endsAtUtc, timezone)} 
                  required 
                />
              </div>
            </div>
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
                  <Label htmlFor="registrationOpensAt">Opens At ({timezone})</Label>
                  <Input 
                    id="registrationOpensAt" 
                    name="registrationOpensAt" 
                    type="datetime-local" 
                    key={`reg-open-${timezone}`}
                    defaultValue={dateToZonedValue(event?.registrationOpensAt, timezone)} 
                  />
                </div>
                <div>
                  <Label htmlFor="registrationClosesAt">Closes At ({timezone})</Label>
                  <Input 
                    id="registrationClosesAt" 
                    name="registrationClosesAt" 
                    type="datetime-local" 
                    key={`reg-close-${timezone}`}
                    defaultValue={dateToZonedValue(event?.registrationClosesAt, timezone)} 
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

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-bold mb-4">Check-in Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="attendanceEnabled" name="attendanceEnabled" defaultChecked={event?.attendanceEnabled ?? false} />
                <Label htmlFor="attendanceEnabled">Enable Check-in System</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendanceOpensAt">Check-in Opens ({timezone})</Label>
                  <Input 
                    id="attendanceOpensAt" 
                    name="attendanceOpensAt" 
                    type="datetime-local" 
                    key={`att-open-${timezone}`}
                    defaultValue={dateToZonedValue(event?.attendanceOpensAt, timezone)} 
                  />
                </div>
                <div>
                  <Label htmlFor="attendanceClosesAt">Check-in Closes ({timezone})</Label>
                  <Input 
                    id="attendanceClosesAt" 
                    name="attendanceClosesAt" 
                    type="datetime-local" 
                    key={`att-close-${timezone}`}
                    defaultValue={dateToZonedValue(event?.attendanceClosesAt, timezone)} 
                  />
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