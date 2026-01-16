import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Standing = {
    driver: {
        id: string;
        name: string;
        handle: string;
        avatarUrl?: string | null;
    };
    points: number;
    wins: number;
    podiums: number;
    starts: number;
    car?: string | null;
    incidents: number;
    bestFinish: number | null;
    rank: number | null;
};

export function StandingsTable({ standings }: { standings: Standing[] }) {
    return (
        <div className="border border-white/10 bg-black/40 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-white/5 border-b border-white/10 font-sans font-black text-[10px] uppercase tracking-widest text-white/50">
                    <tr>
                        <th className="p-4 w-12 text-center">Rank</th>
                        <th className="p-4">Driver</th>
                        <th className="p-4 text-right">Points</th>
                        <th className="p-4 text-center">Wins</th>
                        <th className="p-4 text-center">Podiums</th>
                        <th className="p-4 text-center">Best Finish</th>
                        <th className="p-4 text-center">Starts</th>
                        <th className="p-4 text-center">Incidents</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans text-white/80">
                    {standings.map((standing) => (
                        <tr key={standing.driver.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                            <td className="p-4 font-bold text-center text-white/80">{standing.rank}</td>
                            <td className="p-4">
                                <Link href={`/drivers/${standing.driver.handle}`} className="flex items-center gap-3 group">
                                    <Avatar className="h-8 w-8 border border-white/10 rounded-none">
                                        <AvatarImage src={standing.driver.avatarUrl || ""} alt={standing.driver.name} className="object-cover" />
                                        <AvatarFallback className="bg-lsr-charcoal text-white/50 text-[10px] font-bold rounded-none">
                                            {standing.driver.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white group-hover:text-lsr-orange transition-colors uppercase tracking-tight">
                                            {standing.driver.name}
                                        </span>
                                        {standing.car && standing.car !== "Unknown" && (
                                            <span className="text-[10px] text-white/40 uppercase font-normal">{standing.car}</span>
                                        )}
                                    </div>
                                </Link>
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-lsr-orange text-lg">
                                {standing.points}
                            </td>
                            <td className="p-4 text-center font-mono text-xs text-white/60">
                                {standing.wins}
                            </td>
                            <td className="p-4 text-center font-mono text-xs text-white/60">
                                {standing.podiums}
                            </td>
                            <td className="p-4 text-center font-mono text-xs text-white/60">
                                {standing.bestFinish ? `P${standing.bestFinish}` : "-"}
                            </td>
                            <td className="p-4 text-center font-mono text-xs text-white/60">
                                {standing.starts}
                            </td>
                            <td className={`p-4 text-center font-mono text-xs ${standing.incidents > 0 ? 'text-red-400' : 'text-white/60'}`}>
                                {standing.incidents}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}