"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
              <span className="font-display font-black text-2xl uppercase tracking-widest">Broadcast Ending</span>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex items-center gap-2 text-lsr-orange mb-2">
            <Clock size={20} className="animate-pulse" />
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-white/60">Time Remaining</span>
        </div>
        
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
                <span className="font-display font-black text-5xl md:text-6xl text-white leading-none">
                    {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/30 mt-2">Hours</span>
            </div>
            <span className="font-display font-black text-4xl md:text-5xl text-white/20 leading-none mt-1">:</span>
            <div className="flex flex-col items-center">
                <span className="font-display font-black text-5xl md:text-6xl text-white leading-none">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/30 mt-2">Minutes</span>
            </div>
            <span className="font-display font-black text-4xl md:text-5xl text-white/20 leading-none mt-1">:</span>
            <div className="flex flex-col items-center">
                <span className="font-display font-black text-5xl md:text-6xl text-white leading-none tabular-nums w-[1.5em] text-center">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-white/30 mt-2">Seconds</span>
            </div>
        </div>
    </div>
  );
}
