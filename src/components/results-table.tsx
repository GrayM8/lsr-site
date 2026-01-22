"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type RaceResult, type RaceParticipant, type User, type CarMapping } from "@prisma/client";
import { UserIcon, ArrowUpDown, ArrowUp, ArrowDown, Maximize2, Minimize2, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ResultWithParticipant = RaceResult & {
  participant: RaceParticipant & {
    user: User | null;
    carMapping: CarMapping | null;
  };
};

type SortConfig = {
    key: string;
    direction: "asc" | "desc";
};

export function ResultsTable({ results, title }: { results: ResultWithParticipant[], title?: string }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "position", direction: "asc" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formatTime = (ms: number | null) => {
    if (!ms) return "-";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const winnerTime = results.find(r => r.position === 1)?.totalTime ?? 0;
  const winnerLaps = results.find(r => r.position === 1)?.lapsCompleted ?? 0;

  const formatGap = (totalTime: number | null, lapsCompleted: number) => {
      if (!totalTime) return "-";
      if (lapsCompleted < winnerLaps) {
          return `+${winnerLaps - lapsCompleted} Laps`;
      }
      const gap = totalTime - winnerTime;
      return gap === 0 ? "Winner" : `+${(gap / 1000).toFixed(3)}s`;
  }

  const handleSort = (key: string) => {
      setSortConfig((current) => ({
          key,
          direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
      }));
  };

  const getValue = (row: ResultWithParticipant, key: string) => {
      switch (key) {
          case "position": return row.position;
          case "driver": return row.participant.user?.displayName || row.participant.displayName;
          case "car": return row.participant.carMapping?.displayName || row.participant.carName;
          case "laps": return row.lapsCompleted;
          case "totalTime": return row.totalTime ?? Infinity;
          case "gap": return row.gap ?? ""; // simple string sort for gap usually sufficient or parse
          case "bestLap": return row.bestLapTime ?? Infinity;
          case "cuts": return row.totalCuts ?? 0;
          case "collisions": return row.collisionCount ?? 0;
          case "points": return row.points ?? 0;
          default: return 0;
      }
  };

  const sortedResults = [...results].sort((a, b) => {
      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
  });

  const filteredResults = sortedResults.filter(row => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const driverName = (row.participant.user?.displayName || row.participant.displayName).toLowerCase();
      const carName = (row.participant.carMapping?.displayName || row.participant.carName).toLowerCase();
      return driverName.includes(term) || carName.includes(term);
  });

  const SortHeader = ({ label, sortKey, align = "left", className }: { label: string; sortKey: string; align?: "left" | "center" | "right"; className?: string }) => (
      <th className={cn("p-4 cursor-pointer select-none group hover:text-white", className)} onClick={() => handleSort(sortKey)}>
          <div className={cn("flex items-center gap-1", align === "center" && "justify-center", align === "right" && "justify-end")}>
              {label}
              <span className="text-white/30 group-hover:text-white/60 transition-colors">
                  {sortConfig.key === sortKey ? (
                      sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  )}
              </span>
          </div>
      </th>
  );

    return (
        <div className={cn(
            "relative flex flex-col transition-all duration-300 bg-black/40",
            isFullscreen ? "fixed inset-0 z-[60] bg-lsr-charcoal" : "border border-white/10"
        )}>
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10 shrink-0">
                {title && (
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-lsr-orange" />
                    <h4 className="font-sans font-bold text-xs text-white/60 uppercase tracking-[0.2em]">{title}</h4>
                  </div>
                )}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
                        <input 
                            type="text" 
                            placeholder="Search Results..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-white/10 rounded-none pl-8 pr-2 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-lsr-orange w-32 md:w-48 transition-all"
                        />
                    </div>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 border border-white/10 rounded-none">
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>
            </div>

      <div className={cn(
          "overflow-x-auto flex-grow custom-scrollbar",
          !isFullscreen && "max-h-[500px] overflow-y-auto" // Slightly taller default for race results
      )}>
        <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-white/5 border-b border-white/10 font-sans font-black text-[10px] uppercase tracking-widest text-white/50 sticky top-0 z-10 backdrop-blur-md">
            <tr>
                <SortHeader label="Pos" sortKey="position" align="center" className="w-12" />
                <SortHeader label="Driver" sortKey="driver" />
                <SortHeader label="Car" sortKey="car" align="center" className="hidden md:table-cell" />
                <SortHeader label="Laps" sortKey="laps" align="center" />
                <SortHeader label="Total Time" sortKey="totalTime" align="right" />
                <SortHeader label="Gap" sortKey="gap" align="right" />
                <SortHeader label="Best Lap" sortKey="bestLap" align="right" />
                <SortHeader label="Cuts" sortKey="cuts" align="center" />
                <SortHeader label="Collisions" sortKey="collisions" align="center" />
                <SortHeader label="Pts" sortKey="points" align="center" />
            </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans text-white/80">
            {filteredResults.map((result) => {
                const user = result.participant.user;
                const mapping = result.participant.carMapping;
                
                return (
                <tr key={result.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center font-sans font-bold text-white/80">{result.position}</td>
                    <td className="p-4">
                    <div className="flex items-center gap-3">
                        {user ? (
                        <>
                            <Link href={`/drivers/${user.handle}`} className="group flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10 rounded-none">
                                <AvatarImage src={user.avatarUrl || ""} alt={user.displayName} className="object-cover" />
                                <AvatarFallback className="bg-lsr-charcoal text-white/50 text-[10px] font-bold rounded-none">
                                {user.displayName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-sans font-bold text-white group-hover:text-lsr-orange transition-colors">
                                {user.displayName}
                            </span>
                            </Link>
                        </>
                        ) : (
                        <>
                            <div className="h-8 w-8 bg-white/5 border border-white/10 flex items-center justify-center rounded-none text-white/20 font-bold text-[10px]">
                            ?
                            </div>
                            <span className="font-sans font-bold text-white/40">
                            {result.participant.displayName}
                            </span>
                        </>
                        )}
                    </div>
                    </td>
                    <td className="p-4 hidden md:table-cell font-sans text-xs text-center">
                        {mapping ? (
                            <div className="flex flex-col items-center">
                                <span className="text-white/80 font-bold">{mapping.displayName}</span>
                                {mapping.secondaryDisplayName && (
                                    <span className="text-white/40 text-[10px] italic">{mapping.secondaryDisplayName}</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-white/60">{result.participant.carName}</span>
                        )}
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-white/60">{result.lapsCompleted}</td>
                    <td className="p-4 text-right font-mono text-xs text-white/80">{formatTime(result.totalTime)}</td>
                    <td className="p-4 text-right font-mono text-xs text-white/40 italic">
                        {formatGap(result.totalTime, result.lapsCompleted)}
                    </td>
                    <td className="p-4 text-right font-mono text-xs text-lsr-orange">{formatTime(result.bestLapTime)}</td>
                    <td className={`p-4 text-center font-mono text-xs ${result.totalCuts && result.totalCuts > 0 ? 'text-red-400' : 'text-white/40'}`}>
                        {result.totalCuts ?? 0}
                    </td>
                    <td className={`p-4 text-center font-mono text-xs ${result.collisionCount && result.collisionCount > 0 ? 'text-red-400 font-bold' : 'text-white/40'}`}>
                        {result.collisionCount ?? 0}
                    </td>
                    <td className="p-4 text-center font-sans font-black text-sm text-lsr-orange">
                        {result.points !== null && result.points > 0 ? result.points : "-"}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
      </div>
    </div>
  );
}
