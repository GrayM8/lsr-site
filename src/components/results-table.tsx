import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type RaceResult, type RaceParticipant, type User, type CarMapping } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Link from "next/link";

type ResultWithParticipant = RaceResult & {
  participant: RaceParticipant & {
    user: User | null;
    carMapping: CarMapping | null;
  };
};

export function ResultsTable({ results }: { results: ResultWithParticipant[] }) {
  const formatTime = (ms: number | null) => {
    if (!ms) return "-";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const winnerTime = results[0]?.totalTime ?? 0;

  const formatGap = (totalTime: number | null, lapsCompleted: number, winnerLaps: number) => {
      if (!totalTime) return "-";
      if (lapsCompleted < winnerLaps) {
          return `+${winnerLaps - lapsCompleted} Laps`;
      }
      const gap = totalTime - winnerTime;
      return gap === 0 ? "-" : `+${(gap / 1000).toFixed(3)}s`;
  }

  const winnerLaps = results[0]?.lapsCompleted ?? 0;

  return (
    <div className="border border-white/10 bg-black/40">
      <Table>
        <TableHeader className="bg-white/5 border-b border-white/10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center text-[10px] font-black uppercase tracking-widest text-white/50">Pos</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/50">Driver</TableHead>
            <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-white/50 hidden md:table-cell">Car</TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/50">Best Lap</TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/50">Gap</TableHead>
            <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-white/50">Laps</TableHead>
            <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-white/50">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => {
            const user = result.participant.user;
            const mapping = result.participant.carMapping;
            
            return (
              <TableRow key={result.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="text-center font-sans font-bold text-white/80">{result.position}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="hidden md:table-cell font-sans text-xs">
                    {mapping ? (
                        <div className="flex flex-col items-center text-center">
                            <span className="text-white/80 font-bold">{mapping.displayName}</span>
                            {mapping.secondaryDisplayName && (
                                <span className="text-white/40 text-[10px] italic">{mapping.secondaryDisplayName}</span>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <span className="text-white/60">{result.participant.carName}</span>
                        </div>
                    )}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-lsr-orange">{formatTime(result.bestLapTime)}</TableCell>
                <TableCell className="text-right font-mono text-xs text-white/60">
                    {formatGap(result.totalTime, result.lapsCompleted, winnerLaps)}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-white/60">{result.lapsCompleted}</TableCell>
                <TableCell className="text-center font-sans font-black text-sm text-lsr-orange">
                    {result.points !== null && result.points > 0 ? result.points : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
