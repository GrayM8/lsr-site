
import { DriverHistoryTable } from "@/components/driver-history-table";

type StatCardProps = { label: string; value: React.ReactNode };

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between h-full group hover:border-lsr-orange/50 transition-colors">
      <div className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">{label}</div>
      <div className="font-display font-black italic text-2xl text-white tracking-tight group-hover:text-lsr-orange transition-colors">{value}</div>
    </div>
  );
}

type DriverPerformanceProps = {
  history: any[]; // Using any for simplicity as strict types require importing from prisma/client broadly
  allTime: {
    starts: number;
    wins: number;
    podiums: number;
    top10: number;
    points: number;
  };
  currentSeason: {
    name: string;
    points: number;
    top10: number;
  } | null;
};

export function DriverPerformance({ history, allTime, currentSeason }: DriverPerformanceProps) {
  return (
    <div className="mb-12">
        <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
            Performance <span className="text-lsr-orange">Core</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Primary Column: Race History */}
            <div className="lg:col-span-3">
                {history.length > 0 ? (
                    <DriverHistoryTable history={history} />
                ) : (
                    <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
                        <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-xs">No race history available</p>
                    </div>
                )}
            </div>

            {/* Secondary Column: Career Stats */}
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h4 className="font-sans font-bold text-xs text-white/60 uppercase tracking-[0.2em] mb-4">Career Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard label="Starts" value={allTime.starts} />
                        <StatCard label="Wins" value={allTime.wins} />
                        <StatCard label="Podiums" value={allTime.podiums} />
                        <StatCard label="Top 10s" value={allTime.top10} />
                        <div className="col-span-2">
                            <StatCard label="Total Points" value={allTime.points} />
                        </div>
                    </div>
                </div>

                {currentSeason && (
                    <div>
                        <h4 className="font-sans font-bold text-xs text-white/60 uppercase tracking-[0.2em] mb-4">{currentSeason.name}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Points" value={currentSeason.points} />
                            <StatCard label="Top 10s" value={currentSeason.top10} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
