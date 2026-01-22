"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateEventRegistrationConfig } from "@/app/admin/events/actions";
import { Event } from "@prisma/client";
import { dateToZonedValue, DEFAULT_TIMEZONE } from "@/lib/dates";

export function RegistrationConfigForm({ event }: { event: Event }) {
  const timezone = event.timezone || DEFAULT_TIMEZONE;

  return (
    <form action={updateEventRegistrationConfig.bind(null, event.id)} className="space-y-6 border p-4 rounded-md mt-8">
      <h2 className="text-xl font-bold">Registration Settings</h2>
      
      <div className="flex items-center space-x-2">
        <Switch id="registrationEnabled" name="registrationEnabled" defaultChecked={event.registrationEnabled} />
        <Label htmlFor="registrationEnabled">Enable Registration</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="registrationOpensAt">Opens At ({timezone})</Label>
          <Input 
            id="registrationOpensAt" 
            name="registrationOpensAt" 
            type="datetime-local" 
            defaultValue={dateToZonedValue(event.registrationOpensAt, timezone)} 
          />
        </div>
        <div>
          <Label htmlFor="registrationClosesAt">Closes At ({timezone})</Label>
          <Input 
            id="registrationClosesAt" 
            name="registrationClosesAt" 
            type="datetime-local" 
            defaultValue={dateToZonedValue(event.registrationClosesAt, timezone)} 
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
            defaultValue={event.registrationMax ?? ""} 
            placeholder="Unlimited"
          />
        </div>
        <div className="flex items-center space-x-2 h-full pt-6">
          <Switch id="registrationWaitlistEnabled" name="registrationWaitlistEnabled" defaultChecked={event.registrationWaitlistEnabled} />
          <Label htmlFor="registrationWaitlistEnabled">Enable Waitlist</Label>
        </div>
      </div>

      <Button type="submit" variant="secondary">Update Configuration</Button>
    </form>
  );
}