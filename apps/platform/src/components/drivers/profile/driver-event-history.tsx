
type DriverEventHistoryProps = {
  eventHistory: any[];
};

export function DriverEventHistory({ eventHistory }: DriverEventHistoryProps) {
  return (
    <div className="mb-12">
        <h3 className="font-display font-black italic text-2xl text-white uppercase tracking-normal mb-6 border-b border-white/10 pb-4">
            Event <span className="text-lsr-orange">Participation</span>
        </h3>
        {eventHistory.length > 0 ? (
            <div className="border border-white/10 bg-white/[0.02]">
                {eventHistory.map((attendance) => (
                    <div key={attendance.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <div>
                            <div className="font-sans font-bold text-sm text-white uppercase tracking-tight">{attendance.event.title}</div>
                            <div className="font-mono text-[10px] text-white/40">{new Date(attendance.event.startsAtUtc).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                            <span className="inline-block border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white/60">
                                Attended
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="font-sans font-bold text-white/40 uppercase tracking-widest text-xs">No event attendance recorded</p>
            </div>
        )}
    </div>
  );
}
