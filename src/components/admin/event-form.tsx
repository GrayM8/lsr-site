"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/app/admin/events/actions";
import { useFormState } from "react-dom";

export function EventForm() {
  return (
    <form action={createEvent}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <Input id="slug" name="slug" required />
        </div>
        <div>
          <label htmlFor="startsAtUtc">Starts At (UTC)</label>
          <Input id="startsAtUtc" name="startsAtUtc" type="datetime-local" required />
        </div>
        <div>
          <label htmlFor="endsAtUtc">Ends At (UTC)</label>
          <Input id="endsAtUtc" name="endsAtUtc" type="datetime-local" required />
        </div>
        <div>
          <label htmlFor="timezone">Timezone</label>
          <Input id="timezone" name="timezone" required />
        </div>
        <div>
          <label htmlFor="summary">Summary</label>
          <Input id="summary" name="summary" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Input id="description" name="description" />
        </div>
        <div>
          <label htmlFor="heroImageUrl">Hero Image URL</label>
          <Input id="heroImageUrl" name="heroImageUrl" />
        </div>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
}
