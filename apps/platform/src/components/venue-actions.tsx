"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { type Venue } from "@prisma/client";

function formatAddress(venue: Venue): string {
  return [venue.addressLine1, venue.addressLine2, venue.city, venue.state, venue.postalCode]
    .filter(Boolean)
    .join(", ");
}

export function VenueActions({ venue }: { venue: Venue }) {
  const [copied, setCopied] = useState(false);
  const address = formatAddress(venue);
  const hasAddress = address.length > 0;
  const hasAnyAction = hasAddress || venue.googleMapsUrl || venue.appleMapsUrl;

  if (!hasAnyAction) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {hasAddress && (
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-lsr-orange transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy Address"}
        </button>
      )}
      {venue.googleMapsUrl && (
        <a
          href={venue.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-lsr-orange transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Google Maps
        </a>
      )}
      {venue.appleMapsUrl && (
        <a
          href={venue.appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-lsr-orange transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Apple Maps
        </a>
      )}
    </div>
  );
}
