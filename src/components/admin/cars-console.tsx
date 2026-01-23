"use client";

import { useState, useMemo } from "react";
import { CarMapping } from "@prisma/client";
import { Search, ArrowUpDown, Car, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updateCarMapping, createCarMapping } from "@/app/admin/cars/actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type CarItem = {
    id?: string;
    gameCarName: string;
    displayName: string;
    secondaryDisplayName: string | null;
    isUnmapped: boolean;
}

type CarsConsoleProps = {
    mappedCars: CarMapping[];
    unmappedCarNames: string[];
};

type SortField = "gameName" | "displayName" | "status";
type SortDirection = "asc" | "desc";

export function CarsConsole({ mappedCars, unmappedCarNames }: CarsConsoleProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("status"); // Default to show unmapped first
  const [sortDir, setSortDir] = useState<SortDirection>("asc"); // Unmapped (true) > Mapped (false) if asc? Let's check logic.

  // Merge lists
  const items: CarItem[] = useMemo(() => [
    ...unmappedCarNames.map(name => ({
        gameCarName: name,
        displayName: name,
        secondaryDisplayName: null,
        isUnmapped: true
    })),
    ...mappedCars.map(c => ({
        ...c,
        isUnmapped: false
    }))
  ], [mappedCars, unmappedCarNames]);

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

  const filteredAndSortedCars = useMemo(() => {
    let result = [...items];

    // Filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.gameCarName.toLowerCase().includes(q) ||
          c.displayName.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let fieldA: string | number;
      let fieldB: string | number;

      if (sortField === "gameName") {
          fieldA = a.gameCarName.toLowerCase();
          fieldB = b.gameCarName.toLowerCase();
      } else if (sortField === "displayName") {
          fieldA = a.displayName.toLowerCase();
          fieldB = b.displayName.toLowerCase();
      } else if (sortField === "status") {
          // Unmapped first (isUnmapped=true)
          fieldA = a.isUnmapped ? 0 : 1;
          fieldB = b.isUnmapped ? 0 : 1;
      } else {
          // Default fallbacks
          fieldA = 0;
          fieldB = 0;
      }

      if (fieldA === fieldB) return 0;
      
      const comparison = fieldA > fieldB ? 1 : -1;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return result;
  }, [items, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] border border-white/10 bg-black/40 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded border border-white/10 cursor-help">
                <Car size={14} className="text-lsr-orange" />
                <span className="font-bold text-white/80 tracking-wider uppercase">Car Mappings</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-black/90 border-white/10 text-white p-3">
              <p className="font-bold mb-1 text-lsr-orange">Cars Console</p>
              <p className="text-xs text-white/80">
                Map raw car names from game logs (e.g. &quot;ferrari_296_gt3&quot;) to clean display names.
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
            placeholder="Search cars..."
            className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-lsr-orange transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("status")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "status" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Status <SortIndicator field="status" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("gameName")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "gameName" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Game Name <SortIndicator field="gameName" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleSort("displayName")}
                className={cn("text-xs uppercase tracking-wider h-8", sortField === "displayName" ? "text-lsr-orange bg-lsr-orange/10" : "text-white/60")}
            >
                Display Name <SortIndicator field="displayName" />
            </Button>
        </div>
      </div>

      {/* Header Labels */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
        <div className="w-64 shrink-0">Game Car Name</div>
        <div className="flex-1 min-w-[200px]">Display Name</div>
        <div className="w-48 shrink-0">Secondary Name</div>
        <div className="w-32 shrink-0 text-right">Actions</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {filteredAndSortedCars.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/40">
                No cars found.
            </div>
        ) : (
            filteredAndSortedCars.map((car) => (
                <CarRow key={car.gameCarName} car={car} />
            ))
        )}
      </div>
    </div>
  );
}

function CarRow({ car }: { car: CarItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(car.displayName);
  const [secondaryName, setSecondaryName] = useState(car.secondaryDisplayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
      setIsSaving(true);
      try {
        if (car.isUnmapped) {
            await createCarMapping(car.gameCarName, displayName, secondaryName);
        } else if (car.id) {
            await updateCarMapping(car.id, displayName, secondaryName);
        }
        setIsEditing(false);
        router.refresh(); 
      } catch (error) {
          console.error("Failed to save car mapping", error);
      } finally {
        setIsSaving(false);
      }
  };

  if (isEditing) {
      return (
        <div className="flex items-center gap-4 p-2 bg-white/10 rounded border border-lsr-orange/50 transition-all">
            <div className="w-64 shrink-0 font-mono text-xs text-white/60 truncate">
                {car.gameCarName}
            </div>
            <div className="flex-1 min-w-[200px]">
                <Input 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)} 
                    placeholder="Display Name"
                    className="h-7 text-xs bg-black/50 border-white/20"
                />
            </div>
            <div className="w-48 shrink-0">
                <Input 
                    value={secondaryName} 
                    onChange={e => setSecondaryName(e.target.value)} 
                    placeholder="Mod Name" 
                    className="h-7 text-xs bg-black/50 border-white/20"
                />
            </div>
            <div className="w-32 shrink-0 flex items-center justify-end gap-1">
                <Button size="icon" className="h-7 w-7 bg-lsr-orange hover:bg-lsr-orange/90" onClick={handleSave} disabled={isSaving}>
                    <Check size={14} />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-white/40 hover:text-white" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    <X size={14} />
                </Button>
            </div>
        </div>
      )
  }

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all group">
        {/* Game Name */}
        <div className="w-64 shrink-0 flex items-center gap-2 overflow-hidden">
            <span className="font-mono text-xs text-white/60 truncate" title={car.gameCarName}>{car.gameCarName}</span>
            {car.isUnmapped && (
                <Badge variant="destructive" className="h-4 px-1 text-[9px] uppercase tracking-widest shrink-0">Unmapped</Badge>
            )}
        </div>

        {/* Display Name */}
        <div className="flex-1 min-w-[200px] text-sm font-bold text-white truncate">
            {car.displayName}
        </div>

        {/* Secondary Name */}
        <div className="w-48 shrink-0 text-xs text-white/40 truncate">
            {car.secondaryDisplayName || "-"}
        </div>

        {/* Actions */}
        <div className="w-32 shrink-0 flex items-center justify-end gap-1">
            <Button 
                variant={car.isUnmapped ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className={cn(
                    "h-7 text-xs uppercase tracking-wider font-bold",
                    car.isUnmapped ? "bg-lsr-orange hover:bg-lsr-orange/90 text-white" : "text-white/40 hover:text-white bg-transparent hover:bg-white/10"
                )}
            >
                {car.isUnmapped ? "Map" : "Edit"}
            </Button>
        </div>
    </div>
  );
}
