"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createVenue, updateVenue } from "@/app/admin/venues/actions";
import { Venue } from "@prisma/client";

export function VenueForm({ venue }: { venue?: Venue }) {
  return (
    <div className="overflow-x-auto">
      <form action={venue ? updateVenue.bind(null, venue.id) : createVenue} className="min-w-[600px]">
        <div className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" name="name" defaultValue={venue?.name} required />
          </div>
          <div>
            <label htmlFor="addressLine1">Address Line 1</label>
            <Input id="addressLine1" name="addressLine1" defaultValue={venue?.addressLine1 ?? ""} />
          </div>
          <div>
            <label htmlFor="addressLine2">Address Line 2</label>
            <Input id="addressLine2" name="addressLine2" defaultValue={venue?.addressLine2 ?? ""} />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <Input id="city" name="city" defaultValue={venue?.city ?? ""} />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <Input id="state" name="state" defaultValue={venue?.state ?? ""} />
          </div>
          <div>
            <label htmlFor="postalCode">Postal Code</label>
            <Input id="postalCode" name="postalCode" defaultValue={venue?.postalCode ?? ""} />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <Input id="country" name="country" defaultValue={venue?.country ?? ""} />
          </div>
          <div>
            <label htmlFor="room">Room</label>
            <Input id="room" name="room" defaultValue={venue?.room ?? ""} />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="googleMapsUrl">Google Maps Link</label>
              <Input id="googleMapsUrl" name="googleMapsUrl" defaultValue={venue?.googleMapsUrl ?? ""} placeholder="https://maps.google.com/..." />
            </div>
            <div className="w-1/2">
              <label htmlFor="appleMapsUrl">Apple Maps Link</label>
              <Input id="appleMapsUrl" name="appleMapsUrl" defaultValue={venue?.appleMapsUrl ?? ""} placeholder="https://maps.apple.com/..." />
            </div>
          </div>
          <Button type="submit">{venue ? "Update Venue" : "Create Venue"}</Button>
        </div>
      </form>
    </div>
  );
}
