import Link from "next/link";

export function DatabaseUnavailable({
  title = "Content Unavailable",
  message = "We're experiencing database issues. Please try again shortly.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-12 text-center space-y-4">
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
        </span>
        <span className="font-display font-black text-amber-500 uppercase tracking-widest text-[10px] italic">
          Service Disruption
        </span>
      </div>
      <h2 className="font-display font-black italic text-2xl md:text-3xl text-white uppercase tracking-normal">
        {title}
      </h2>
      <p className="font-sans text-sm text-white/50 max-w-md mx-auto">{message}</p>
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lsr-orange hover:text-white transition-colors font-sans font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Return Home <span className="text-lg leading-none">→</span>
        </Link>
      </div>
    </div>
  );
}
