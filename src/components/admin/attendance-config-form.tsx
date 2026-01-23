"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateEventAttendanceConfig } from "@/app/admin/events/actions";
import { Event } from "@prisma/client";
import { dateToZonedValue, DEFAULT_TIMEZONE } from "@/lib/dates";
import { AlertCircle } from "lucide-react";

export function AttendanceConfigForm({ event, checkInCount = 0 }: { event: Event; checkInCount?: number }) {
  const timezone = event.timezone || DEFAULT_TIMEZONE;
  
  const [enabled, setEnabled] = useState(event.attendanceEnabled);
  const [opensAt, setOpensAt] = useState(dateToZonedValue(event.attendanceOpensAt, timezone));
  const [closesAt, setClosesAt] = useState(dateToZonedValue(event.attendanceClosesAt, timezone));

  const handleToggle = (checked: boolean) => {
      setEnabled(checked);
      if (checked) {
          if (!opensAt) setOpensAt(dateToZonedValue(event.startsAtUtc, timezone));
          if (!closesAt) setClosesAt(dateToZonedValue(event.endsAtUtc, timezone));
      }
  };

  return (
    <form action={updateEventAttendanceConfig.bind(null, event.id)} className="space-y-6 border p-4 rounded-md">
      <h2 className="text-xl font-bold">Attendance Settings</h2>
      
      <div className="flex items-center space-x-2">
        <Switch 
            id="attendanceEnabled" 
            name="attendanceEnabled" 
            checked={enabled} 
            onCheckedChange={handleToggle}
        />
        <Label htmlFor="attendanceEnabled">Enable Attendance Tracking</Label>
      </div>

      {!enabled && event.attendanceEnabled && checkInCount > 0 && (
          <div className="flex items-start p-3 bg-red-500/10 border border-red-500/20 rounded text-red-200 text-sm gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                  Warning: Disabling attendance will hide the {checkInCount} existing check-ins from reports (reverting to "Assume Registered").
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="attendanceOpensAt">Check-in Opens ({timezone})</Label>
          <Input 
            id="attendanceOpensAt" 
            name="attendanceOpensAt" 
            type="datetime-local" 
            value={opensAt}
            onChange={(e) => setOpensAt(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="attendanceClosesAt">Check-in Closes ({timezone})</Label>
          <Input 
            id="attendanceClosesAt" 
            name="attendanceClosesAt" 
            type="datetime-local" 
            value={closesAt}
            onChange={(e) => setClosesAt(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" variant="secondary">Update Configuration</Button>
    </form>
  );
}
