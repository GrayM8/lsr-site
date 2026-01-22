"use client";

import { useEffect, useState } from "react";

interface LocalTimeProps {
  date: Date | string;
  format?: "date" | "time" | "datetime" | "short-date" | "weekday-date";
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function LocalTime({ date, format = "datetime", className, prefix, suffix }: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        setFormatted("Invalid Date");
        return;
    }

    let options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case "date":
        options = { 
          weekday: "long", 
          month: "long", 
          day: "numeric",
          year: "numeric"
        };
        break;
      case "short-date":
        options = { 
          month: "short", 
          day: "numeric" 
        };
        break;
        case "weekday-date":
          options = { 
            weekday: "long",
            month: "long", 
            day: "numeric" 
          };
          break;
      case "time":
        options = { 
          hour: "numeric", 
          minute: "2-digit", 
          timeZoneName: "short" 
        };
        break;
      case "datetime":
      default:
        options = { 
          weekday: "short", 
          month: "short", 
          day: "numeric", 
          hour: "numeric", 
          minute: "2-digit", 
          timeZoneName: "short" 
        };
        break;
    }

    setFormatted(d.toLocaleString(undefined, options));
  }, [date, format, mounted]);

  if (!mounted) {
    // Render a placeholder to maintain layout, or nothing
    return <span className={className} suppressHydrationWarning>&nbsp;</span>;
  }

  return <span className={className}>{prefix}{formatted}{suffix}</span>;
}

export function LocalTimeRange({ start, end, className }: { start: Date | string, end: Date | string, className?: string }) {
  const [formatted, setFormatted] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const s = new Date(start);
    const e = new Date(end);
    
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return;

    const timeOpts: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit"
    };
    
    // Get time string
    const sTime = s.toLocaleTimeString(undefined, timeOpts);
    const eTime = e.toLocaleTimeString(undefined, timeOpts);
    
    // Get TZ string
    const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(e);
    const tzName = parts.find(p => p.type === "timeZoneName")?.value || "";

    setFormatted(`${sTime} - ${eTime} ${tzName}`);

  }, [start, end, mounted]);

  if (!mounted) {
      return <span className={className} suppressHydrationWarning>&nbsp;</span>;
  }
  
  return <span className={className}>{formatted}</span>;
}