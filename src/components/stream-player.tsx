"use client";

import { useEffect, useState } from "react";
import { getEmbedUrl } from "@/lib/streams";

export function StreamPlayer({ streamUrl }: { streamUrl: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    // This runs on the client, so getEmbedUrl will have access to window.location.hostname
    setEmbedUrl(getEmbedUrl(streamUrl));
  }, [streamUrl]);

  if (!embedUrl) return null;

  return (
    <div className="aspect-video w-full border border-white/10 bg-black shadow-2xl">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; clipboard-write"
      />
    </div>
  );
}
