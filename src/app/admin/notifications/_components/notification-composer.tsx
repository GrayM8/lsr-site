"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, User, Users, Search, Loader2 } from "lucide-react";
import { sendCustomNotification, searchUsers } from "../actions";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

type UserResult = {
  id: string;
  displayName: string;
  email: string;
  handle: string;
};

export function NotificationComposer() {
  const [isPending, startTransition] = useTransition();
  const [recipientType, setRecipientType] = useState<"single" | "all">("single");
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const [sendInApp, setSendInApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  // Search users when query changes
  useState(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      searchUsers(debouncedQuery)
        .then(setSearchResults)
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
    }
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set("recipientType", recipientType);
    if (selectedUser) {
      formData.set("userId", selectedUser.id);
    }

    startTransition(async () => {
      try {
        await sendCustomNotification(formData);
        toast.success("Notification sent successfully");
        // Reset form
        setSelectedUser(null);
        setSearchQuery("");
      } catch (error) {
        toast.error("Failed to send notification");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="border border-white/10 bg-white/[0.02] p-6 space-y-6">
        {/* Recipient Selection */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Recipients
          </Label>

          <Select
            value={recipientType}
            onValueChange={(v) => setRecipientType(v as "single" | "all")}
          >
            <SelectTrigger className="rounded-none bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-lsr-charcoal border-white/10">
              <SelectItem value="single" className="rounded-none">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Single User
                </div>
              </SelectItem>
              <SelectItem value="all" className="rounded-none">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All Active Members
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* User Search */}
          {recipientType === "single" && (
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or handle..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="rounded-none bg-white/5 border-white/10 text-white pl-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 animate-spin" />
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && !selectedUser && (
                <div className="absolute z-10 w-full mt-1 bg-lsr-charcoal border border-white/10 max-h-48 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/5 flex flex-col"
                    >
                      <span className="text-sm text-white">{user.displayName}</span>
                      <span className="text-xs text-white/40">
                        {user.email} &bull; @{user.handle}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="mt-2 p-3 bg-lsr-orange/10 border border-lsr-orange/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{selectedUser.displayName}</p>
                    <p className="text-xs text-white/60">{selectedUser.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    className="rounded-none hover:bg-white/10"
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
          )}

          {recipientType === "all" && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-500">
                This will send a notification to all active members.
              </p>
            </div>
          )}
        </div>

        {/* Channels */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Channels
          </Label>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sendInApp"
                name="sendInApp"
                checked={sendInApp}
                onCheckedChange={(c) => setSendInApp(c === true)}
                className="rounded-none border-white/30 data-[state=checked]:bg-lsr-orange data-[state=checked]:border-lsr-orange"
              />
              <Label htmlFor="sendInApp" className="text-sm text-white cursor-pointer">
                In-App
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sendEmail"
                name="sendEmail"
                checked={sendEmail}
                onCheckedChange={(c) => setSendEmail(c === true)}
                className="rounded-none border-white/30 data-[state=checked]:bg-lsr-orange data-[state=checked]:border-lsr-orange"
              />
              <Label htmlFor="sendEmail" className="text-sm text-white cursor-pointer">
                Email
              </Label>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          >
            Title
          </Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Notification title..."
            className="rounded-none bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Body */}
        <div className="space-y-2">
          <Label
            htmlFor="body"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          >
            Body
          </Label>
          <textarea
            id="body"
            name="body"
            required
            rows={4}
            placeholder="Notification body..."
            className="w-full rounded-none bg-white/5 border border-white/10 text-white p-3 focus:outline-none focus:border-lsr-orange"
          />
        </div>

        {/* Action URL */}
        <div className="space-y-2">
          <Label
            htmlFor="actionUrl"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          >
            Action URL (Optional)
          </Label>
          <Input
            id="actionUrl"
            name="actionUrl"
            type="url"
            placeholder="/events/my-event"
            className="rounded-none bg-white/5 border-white/10 text-white"
          />
          <p className="text-xs text-white/40">
            Link to navigate when the notification is clicked
          </p>
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <Label
            htmlFor="scheduledFor"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60"
          >
            Schedule For (Optional)
          </Label>
          <Input
            id="scheduledFor"
            name="scheduledFor"
            type="datetime-local"
            className="rounded-none bg-white/5 border-white/10 text-white"
          />
          <p className="text-xs text-white/40">
            Leave empty to send immediately
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={
          isPending ||
          (!sendInApp && !sendEmail) ||
          (recipientType === "single" && !selectedUser)
        }
        className="rounded-none bg-lsr-orange text-white hover:bg-white hover:text-lsr-charcoal font-bold uppercase tracking-widest text-[10px] h-12 px-8"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Send Notification
      </Button>
    </form>
  );
}
