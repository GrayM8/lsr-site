import Link from "next/link";
import { type RaceResult, type RaceSession, type Event, type RaceParticipant, type CarMapping } from "@prisma/client";

type HistoryRow = RaceResult & {
    session: RaceSession & {
        event: Event | null;
    };
    participant: RaceParticipant & {
        carMapping: CarMapping | null;
    };
};

export function DriverHistoryTable({ history }: { history: HistoryRow[] }) {
    const formatTime = (ms: number | null) => {
        if (!ms) return "-";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
    };

    return (
        <div className="border border-white/10 bg-black/40 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-white/5 border-b border-white/10 font-sans font-black text-[10px] uppercase tracking-widest text-white/50">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Event</th>
                        <th className="p-4 w-12 text-center">Pos</th>
                        <th className="p-4 text-center">Car</th>
                        <th className="p-4 text-center">Laps</th>
                        <th className="p-4 text-right">Total Time</th>
                        <th className="p-4 text-right">Gap</th>
                        <th className="p-4 text-right">Best Lap</th>
                        <th className="p-4 text-center">Cuts</th>
                        <th className="p-4 text-center">Collisions</th>
                        <th className="p-4 text-center">Pts</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans text-white/80">
                    {history.map((row) => (
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
