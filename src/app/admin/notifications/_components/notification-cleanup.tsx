"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { bulkDeleteNotifications, BulkDeleteFilter } from "../actions";
import { toast } from "sonner";

export function NotificationCleanup() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>("");
  const [olderThanDays, setOlderThanDays] = useState<string>("");
  const [lastResult, setLastResult] = useState<{ deletedCount: number } | null>(
    null
  );

  const handleBulkDelete = () => {
    const filter: BulkDeleteFilter = {};

    if (status && status !== "all") {
      filter.status = status as BulkDeleteFilter["status"];
    }

    if (olderThanDays && parseInt(olderThanDays) > 0) {
      filter.olderThanDays = parseInt(olderThanDays);
    }

    if (!filter.status && !filter.olderThanDays) {
      toast.error("Please select at least one filter criteria");
      return;
    }

    const confirmMessage = [
      "Are you sure you want to delete notifications",
      filter.status ? `with status "${filter.status}"` : null,
      filter.olderThanDays ? `older than ${filter.olderThanDays} days` : null,
      "? This cannot be undone.",
    ]
      .filter(Boolean)
      .join(" ");

    if (!confirm(confirmMessage)) return;

    startTransition(async () => {
      try {
        const result = await bulkDeleteNotifications(filter);
        setLastResult(result);
        toast.success(`Deleted ${result.deletedCount} notifications`);
        setStatus("");
        setOlderThanDays("");
      } catch {
        toast.error("Failed to delete notifications");
      }
    });
  };

  return (
    <div className="border border-red-500/20 bg-red-500/[0.02] p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-bold text-white">Bulk Delete</h3>
        </div>
        <p className="text-sm text-white/50 mt-2 max-w-md">
          Permanently delete notifications matching the selected criteria. This
          action is logged in the audit console.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Status Filter
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-none bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-lsr-charcoal border-white/10">
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Older Than (Days)
          </Label>
          <Input
            type="number"
            min="1"
            value={olderThanDays}
            onChange={(e) => setOlderThanDays(e.target.value)}
            placeholder="e.g. 30"
            className="rounded-none bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleBulkDelete}
          disabled={isPending || (!status && !olderThanDays)}
          variant="destructive"
          className="rounded-none bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete Matching
        </Button>

        {lastResult && (
          <span className="text-sm text-white/50">
            Last operation: {lastResult.deletedCount} notifications deleted
          </span>
        )}
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-500 font-bold">
            This action cannot be undone
          </p>
          <p className="text-xs text-yellow-500/80 mt-1">
            Deleted notifications are permanently removed from the database. Use
            filters carefully and review the criteria before confirming.
          </p>
        </div>
      </div>
    </div>
  );
}
