"use client";

import { useState } from "react";
import { Event, EventStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateEventStatus } from "@/app/admin/events/actions";
import { ShieldAlert } from "lucide-react";
import { getEffectiveEventStatus } from "@/lib/events";

export function StatusOverrideDialog({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate effective status to show context
  const effectiveStatus = getEffectiveEventStatus(event);
  const isDerived = event.status !== effectiveStatus;

  const handleSave = async () => {
    setIsSaving(true);
    // Pass current publishedAt if exists, or new Date() if we are switching to PUBLISHED from scratch?
    // Actually, updateEventStatus handles publishedAt logic if passed.
    // Ideally we preserve the existing publishedAt unless the user explicitly wants to change it (which this dialog doesn't do yet).
    // If we switch to SCHEDULED/PUBLISHED we might need it.
    // But for a pure override, we just set the status.
    await updateEventStatus(event.id, status, event.publishedAt || undefined);
    setIsSaving(false);
    setOpen(false);
  };

  const statusOptions = Object.values(EventStatus);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-yellow-400 hover:bg-white/10 transition-colors" title="Override Status">
          <ShieldAlert size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lsr-orange font-mono uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Status Override
          </DialogTitle>
          <DialogDescription className="text-white/60 text-xs">
            Manually force the event status. This overrides automatic time-based logic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-white/5 border border-white/10 p-3 rounded space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/40 uppercase tracking-wider font-bold">Database Status</span>
              <span className="font-mono text-white">{event.status}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40 uppercase tracking-wider font-bold">Effective Status</span>
              <span className="font-mono text-lsr-orange">{effectiveStatus}</span>
            </div>
            {isDerived && (
              <p className="text-[10px] text-white/40 italic pt-2 border-t border-white/5 mt-2">
                * The system is currently deriving the status based on the time window.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-white/60">New Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-lsr-charcoal border-white/10 text-white">
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="font-mono text-xs focus:bg-white/10 focus:text-white">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
            Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-lsr-orange hover:bg-lsr-orange/90 text-white font-bold uppercase tracking-widest"
          >
            {isSaving ? "Saving..." : "Apply Override"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
