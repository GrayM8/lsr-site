"use client";

import { useState, useMemo } from "react";
import { EventSeries } from "@prisma/client";
import { Search, Plus, ArrowUpDown, MoreVertical, Edit, Trash2, Library } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteSeries } from "@/app/admin/series/actions";
import { cn } from "@/lib/utils";

type SeriesWithCounts = EventSeries & {
  _count: {
    seasons: number;
    events: number;
  };
};

type SeriesConsoleProps = {
  initialSeries: SeriesWithCounts[];
};

type SortField = "title" | "slug";
type SortDirection = "asc" | "desc";

export function SeriesConsole({ initialSeries }: SeriesConsoleProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
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

  const filteredAndSortedSeries = useMemo(() => {
    let result = [...initialSeries];

    // Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
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
  }, [initialSeries, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const visibilityColors: Record<string, string> = {
    public: "text-green-400 border-green-400/20 bg-green-400/10",
    members: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    officers: "text-lsr-orange border-lsr-orange/20 bg-lsr-orange/10",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-white/10 bg-black/40 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/10 cursor-help">
                <Library size={14} className="text-lsr-orange" />
                <span className="font-bold text-white/80 tracking-wider uppercase">Event Series</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Series Console</p>
              <p className="text-xs text-white/80">
                Manage overarching event series (e.g. &quot;Lone Star Cup&quot;, &quot;Endurance Series&quot;) that group seasons and events.
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
            placeholder="Search series..."
            className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-lsr-orange transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
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
                onClick={() => toggleSort("slug")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "slug" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Slug <SortIndicator field="slug" />
            </Button>
        </div>

        <div className="flex-1" />

        <Button asChild size="sm" className="bg-lsr-orange hover:bg-lsr-orange/90 text-white border-0 font-bold uppercase tracking-wider text-xs h-8">
          <Link href="/admin/series/new">
            <Plus size={14} className="mr-2" /> New Series
          </Link>
        </Button>
      </div>

      {/* Header Labels */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        <div className="flex-1 min-w-[200px]">Title</div>
        <div className="w-24 shrink-0 text-center">Visibility</div>
        <div className="w-32 shrink-0 text-center">Stats</div>
        <div className="w-40 shrink-0">Slug</div>
        <div className="w-32 shrink-0 text-right">Actions</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredAndSortedSeries.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40">
                No series found matching your search.
            </div>
        ) : (
            filteredAndSortedSeries.map((series) => {
                return (
                <div
                    key={series.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all group"
                >
                    {/* Title */}
                    <div className="flex-1 min-w-[200px]">
                        <span className="font-bold text-white text-sm truncate tracking-tight block">{series.title}</span>
                    </div>
                    
                    {/* Visibility */}
                    <div className="w-24 shrink-0 flex justify-center">
                         <Badge variant="outline" className={cn("rounded-sm px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold", visibilityColors[series.visibility.toLowerCase()] || visibilityColors.public)}>
                             {series.visibility}
                         </Badge>
                    </div>
                    
                    {/* Stats */}
                    <div className="w-32 shrink-0 flex flex-col items-center justify-center text-[10px] text-white/40 font-mono gap-0.5">
                        <span title="Seasons">{series._count.seasons} Seasons</span>
                        <span title="Events">{series._count.events} Events</span>
                    </div>

                    {/* Slug */}
                    <div className="w-40 shrink-0">
                         <span className="text-[10px] text-white/20 font-mono truncate block">/{series.slug}</span>
                    </div>

                    {/* Actions */}
                    <div className="w-32 shrink-0 flex items-center justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white/20 group-hover:text-white/70 hover:!text-lsr-orange hover:bg-white/10 transition-colors">
                            <Link href={`/admin/series/${series.id}/edit`} title="Edit Details">
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
                                <form action={deleteSeries.bind(null, series.id)}>
                                    <DropdownMenuItem asChild className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer rounded-none text-[10px] uppercase font-bold tracking-widest">
                                        <button type="submit" className="w-full flex items-center p-2">
                                            <Trash2 size={12} className="mr-2" /> Delete Series
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