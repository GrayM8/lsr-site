"use client";

import { useState, useMemo } from "react";
import { Event } from "@prisma/client";
import { Search, Plus, Calendar, MapPin, ArrowUpDown, MoreVertical, Edit, Settings, Trash2, Eye, Terminal, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { deleteEvent } from "@/app/admin/events/actions";
import { cn } from "@/lib/utils";

type EventsConsoleProps = {
  initialEvents: Event[];
};

type SortField = "startsAtUtc" | "title" | "status";
type SortDirection = "asc" | "desc";

export function EventsConsole({ initialEvents }: EventsConsoleProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("startsAtUtc");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="ml-1.5 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp size={10} className="ml-1.5 text-lsr-orange" /> : <ChevronDown size={10} className="ml-1.5 text-lsr-orange" />;
  };

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...initialEvents];

    // Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          e.status.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (fieldA === fieldB) return 0;
      
      const comparison = fieldA > fieldB ? 1 : -1;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return result;
  }, [initialEvents, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
      if (field === "startsAtUtc") setSortDir("desc");
    }
  };

  const statusColors: Record<string, string> = {
    draft: "text-white/40 border-white/20 bg-white/5",
    scheduled: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    in_progress: "text-lsr-orange border-lsr-orange/20 bg-lsr-orange/10 animate-pulse",
    completed: "text-green-400 border-green-400/20 bg-green-400/10",
    canceled: "text-red-400 border-red-400/20 bg-red-400/10",
    postponed: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-white/10 bg-black/40 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/10 cursor-help">
                <Calendar size={14} className="text-lsr-orange" />
                <span className="font-bold text-white/80 tracking-wider uppercase">Events</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Events Console</p>
              <p className="text-xs text-white/80">
                Manage all club events including races, meetings, and social gatherings.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-2 relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-lsr-orange transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("startsAtUtc")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "startsAtUtc" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Date <SortIndicator field="startsAtUtc" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("title")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "title" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Title <SortIndicator field="title" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("status")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "status" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Status <SortIndicator field="status" />
            </Button>
        </div>

        <div className="flex-1" />

        <Button asChild size="sm" className="bg-lsr-orange hover:bg-lsr-orange/90 text-white border-0 font-bold uppercase tracking-wider text-xs h-8">
          <Link href="/admin/events/new">
            <Plus size={14} className="mr-2" /> New Event
          </Link>
        </Button>
      </div>

            {/* Header Labels */}
            <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              <div className="w-24 shrink-0 text-left">Date</div>
              <div className="w-32 shrink-0 text-left">Time</div>
              <div className="w-40 shrink-0">Slug</div>
              <div className="flex-1">Title</div>
              <div className="w-24 shrink-0 text-center flex items-center justify-center gap-1">
                  Status
                  <TooltipProvider>
                      <Tooltip>
                          <TooltipTrigger className="cursor-help text-lsr-orange font-bold text-xs">*</TooltipTrigger>
                          <TooltipContent className="bg-black border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold p-3 max-w-xs">
                              The status system may not be reliable at the moment.
                          </TooltipContent>
                      </Tooltip>
                  </TooltipProvider>
              </div>
              <div className="w-32 shrink-0 text-right">Actions</div>
            </div>
      
            {/* List */}
            <div className="flex-1 overflow-auto p-2 space-y-1">
              {filteredAndSortedEvents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-white/40">
                      No events found matching your search.
                  </div>
              ) : (
                  filteredAndSortedEvents.map((event) => {
                      const start = new Date(event.startsAtUtc);
                      const end = new Date(event.endsAtUtc);
                      const isSameDay = start.toDateString() === end.toDateString();
                      const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      
                      return (
                      <div
                          key={event.id}
                          className="flex items-center gap-4 p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all group"
                      >
                          {/* Date Column */}
                          <div className="w-24 shrink-0 text-xs text-white/60 font-mono">
                              {start.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                          </div>
      
                          {/* Time Column */}
                          <div className="w-32 shrink-0 text-[10px] text-white/40 font-mono flex items-center gap-1">
                              <span>{formatTime(start)} - {formatTime(end)}</span>
                              {!isSameDay && (
                                  <TooltipProvider>
                                      <Tooltip>
                                          <TooltipTrigger className="cursor-help text-lsr-orange font-bold">*</TooltipTrigger>
                                          <TooltipContent className="bg-black border border-white/10 text-white text-xs">
                                              Ends on {end.toLocaleDateString()}
                                          </TooltipContent>
                                      </Tooltip>
                                  </TooltipProvider>
                              )}
                          </div>
      
                          {/* Slug Column */}
                          <div className="w-40 shrink-0">
                              <span className="text-[10px] text-white/20 font-mono truncate block">/{event.slug}</span>
                          </div>
      
                          {/* Title */}
                          <div className="flex-1 min-w-0">
                              <span className="font-bold text-white text-sm truncate tracking-tight">{event.title}</span>
                          </div>
      
                          {/* Status Column */}
                          <div className="w-24 shrink-0">
                              <Badge variant="outline" className={cn("rounded-sm px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold w-full justify-center", statusColors[event.status] || statusColors.draft)}>
                                  {event.status.replace("_", " ")}
                              </Badge>
                          </div>
      
                                                                                      {/* Actions */}
      
                                                                                      <div className="w-32 shrink-0 flex items-center justify-end gap-1">
      
                                                                                          <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-lsr-orange hover:bg-white/10 transition-colors">
      
                                                                                              <Link href={`/events/${event.slug}`} target="_blank" title="View Public Page">
      
                                                                                                  <Eye size={14} />
      
                                                                                              </Link>
      
                                                                                          </Button>
      
                                                                                          <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-lsr-orange hover:bg-white/10 transition-colors">
      
                                                                                              <Link href={`/admin/events/${event.id}/manage`} title="Manage Check-in & Registration">
      
                                                                                                  <Settings size={14} />
      
                                                                                              </Link>
      
                                                                                          </Button>
      
                                                                                          <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-blue-400 hover:bg-white/10 transition-colors">
      
                                                                                              <Link href={`/admin/events/${event.id}/edit`} title="Edit Details">
      
                                                                                                  <Edit size={14} />
      
                                                                                              </Link>
      
                                                                                          </Button>
      
                                                                                          
      
                                                                                          <DropdownMenu>
      
                                                                                              <DropdownMenuTrigger asChild>
      
                                                                                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:bg-white/10 transition-colors">
      
                                                                                                      <MoreVertical size={14} />
      
                                                                                                  </Button>
      
                                                                                              </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black border-white/10 text-white rounded-none p-1">
                            <form action={deleteEvent.bind(null, event.id)}>
                                <DropdownMenuItem asChild className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer rounded-none text-[10px] uppercase font-bold tracking-widest">
                                    <button type="submit" className="w-full flex items-center p-2">
                                        <Trash2 size={12} className="mr-2" /> Delete Event
                                    </button>
                                </DropdownMenuItem>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            );
            })
        )}
      </div>
    </div>
  );
}