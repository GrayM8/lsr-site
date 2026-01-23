"use client";

import { useState, useMemo } from "react";
import { Venue } from "@prisma/client";
import { Search, Plus, ArrowUpDown, MoreVertical, Edit, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteVenue } from "@/app/admin/venues/actions";
import { cn } from "@/lib/utils";

type VenueWithCounts = Venue & {
  _count: {
    events: number;
  };
};

type VenuesConsoleProps = {
  initialVenues: VenueWithCounts[];
};

type SortField = "name" | "city" | "country";
type SortDirection = "asc" | "desc";

export function VenuesConsole({ initialVenues }: VenuesConsoleProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={10} className="ml-1.5 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp size={10} className="ml-1.5 text-lsr-orange" /> : <ChevronDown size={10} className="ml-1.5 text-lsr-orange" />;
  };

  const ChevronUp = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>
  );
  const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
  );


  const filteredAndSortedVenues = useMemo(() => {
    let result = [...initialVenues];

    // Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.city || "").toLowerCase().includes(q) ||
          (v.state || "").toLowerCase().includes(q) ||
          (v.country || "").toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let fieldA: string = a[sortField] || "";
      let fieldB: string = b[sortField] || "";
      
      // Case insensitive sort
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();

      if (fieldA === fieldB) return 0;
      
      const comparison = fieldA > fieldB ? 1 : -1;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return result;
  }, [initialVenues, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const formatLocation = (v: Venue) => {
      const parts = [v.city, v.state, v.country].filter(Boolean);
      return parts.join(", ");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-white/10 bg-black/40 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/10 cursor-help">
                <MapPin size={14} className="text-lsr-orange" />
                <span className="font-bold text-white/80 tracking-wider uppercase">Venues</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Venues Console</p>
              <p className="text-xs text-white/80">
                Manage physical or virtual locations for events. Track addresses and geographic coordinates.
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
            placeholder="Search venues..."
            className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-lsr-orange transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("name")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "name" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Name <SortIndicator field="name" />
            </Button>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("city")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "city" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                City <SortIndicator field="city" />
            </Button>
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("country")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "country" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Country <SortIndicator field="country" />
            </Button>
        </div>

        <div className="flex-1" />

        <Button asChild size="sm" className="bg-lsr-orange hover:bg-lsr-orange/90 text-white border-0 font-bold uppercase tracking-wider text-xs h-8">
          <Link href="/admin/venues/new">
            <Plus size={14} className="mr-2" /> New Venue
          </Link>
        </Button>
      </div>

      {/* Header Labels */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        <div className="flex-1 min-w-[200px]">Name</div>
        <div className="w-64 shrink-0">Location</div>
        <div className="w-24 shrink-0 text-center">Stats</div>
        <div className="w-32 shrink-0 text-right">Actions</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredAndSortedVenues.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40">
                No venues found matching your search.
            </div>
        ) : (
            filteredAndSortedVenues.map((venue) => {
                return (
                <div
                    key={venue.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all group"
                >
                    {/* Name */}
                    <div className="flex-1 min-w-[200px]">
                        <span className="font-bold text-white text-sm truncate tracking-tight block">{venue.name}</span>
                    </div>
                    
                    {/* Location */}
                    <div className="w-64 shrink-0 text-xs text-white/60 truncate">
                        {formatLocation(venue) || "-"}
                    </div>

                    {/* Stats */}
                    <div className="w-24 shrink-0 text-center text-[10px] text-white/40 font-mono">
                        {venue._count.events} Events
                    </div>

                    {/* Actions */}
                    <div className="w-32 shrink-0 flex items-center justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-lsr-orange hover:bg-white/10 transition-colors">
                            <Link href={`/admin/venues/${venue.id}/edit`} title="Edit Details">
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
                                <form action={deleteVenue.bind(null, venue.id)}>
                                    <DropdownMenuItem asChild className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer rounded-none text-[10px] uppercase font-bold tracking-widest">
                                        <button type="submit" className="w-full flex items-center p-2">
                                            <Trash2 size={12} className="mr-2" /> Delete Venue
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
