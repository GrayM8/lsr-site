"use client";

import Link from "next/link";
import { type RaceResult, type RaceSession, type Event, type RaceParticipant, type CarMapping } from "@prisma/client";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type HistoryRow = RaceResult & {
    session: RaceSession & {
        event: Event | null;
    };
    participant: RaceParticipant & {
        carMapping: CarMapping | null;
    };
};

type SortConfig = {
    key: string;
    direction: "asc" | "desc";
};

export function DriverHistoryTable({ history }: { history: HistoryRow[] }) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "date", direction: "desc" });

    const formatTime = (ms: number | null) => {
        if (!ms) return "-";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    };

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const getValue = (row: HistoryRow, key: string) => {
        switch (key) {
            case "date":
                return new Date(row.session.event?.startsAtUtc ?? row.session.startedAt).getTime();
            case "event":
                return row.session.event?.title ?? row.session.trackName;
            case "position":
                return row.position;
            case "car":
                return row.participant.carMapping?.displayName || row.participant.carName;
            case "laps":
                return row.lapsCompleted;
            case "totalTime":
                return row.totalTime ?? 0;
            case "gap":
                return row.gap ?? "";
            case "bestLap":
                return row.bestLapTime ?? 0;
            case "cuts":
                return row.totalCuts ?? 0;
            case "collisions":
                return row.collisionCount ?? 0;
            case "points":
                return row.points ?? 0;
            default:
                return 0;
        }
    };

    const sortedHistory = [...history].sort((a, b) => {
        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
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
        <div className="border border-white/10 bg-black/40 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-white/5 border-b border-white/10 font-sans font-black text-[10px] uppercase tracking-widest text-white/50">
                    <tr>
                        <SortHeader label="Date" sortKey="date" />
                        <SortHeader label="Event" sortKey="event" />
                        <SortHeader label="Pos" sortKey="position" align="center" className="w-12" />
                        <SortHeader label="Car" sortKey="car" align="center" />
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
                    {sortedHistory.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                            <td className="p-4 font-mono text-xs text-white/60">
                                {new Date(row.session.event?.startsAtUtc ?? row.session.startedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                                {row.session.event ? (
                                    <Link href={`/events/${row.session.event.slug}`} className="font-bold text-white hover:text-lsr-orange transition-colors uppercase tracking-tight">
                                        {row.session.event.title}
                                    </Link>
                                ) : (
                                    <span className="text-white/40">{row.session.trackName}</span>
                                )}
                            </td>
                            <td className="p-4 font-bold text-center text-white">{row.position}</td>
                            <td className="p-4 text-xs text-white/50 uppercase text-center">
                                {row.participant.carMapping?.displayName || row.participant.carName}
                            </td>
                            <td className="p-4 text-center font-mono text-xs text-white/60">{row.lapsCompleted}</td>
                            <td className="p-4 text-right font-mono text-xs text-white/80">{formatTime(row.totalTime)}</td>
                            <td className="p-4 text-right font-mono text-xs text-white/40">{row.gap || "-"}</td>
                            <td className="p-4 text-right font-mono text-xs text-lsr-orange">{formatTime(row.bestLapTime)}</td>
                            <td className={`p-4 text-center font-mono text-xs ${row.totalCuts && row.totalCuts > 0 ? 'text-red-400' : 'text-white/60'}`}>
                                {row.totalCuts ?? 0}
                            </td>
                            <td className={`p-4 text-center font-mono text-xs ${row.collisionCount && row.collisionCount > 0 ? 'text-red-400 font-bold' : 'text-white/60'}`}>
                                {row.collisionCount ?? 0}
                            </td>
                            <td className="p-4 text-center font-sans font-black text-sm text-lsr-orange">
                                {row.points !== null && row.points > 0 ? row.points : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
