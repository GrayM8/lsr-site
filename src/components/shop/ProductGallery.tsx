"use client";

import Image from "next/image";
import { useState } from "react";
import { Image as ImageType } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: ImageType[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden bg-white/5 border border-white/5">
        <Image
          src={images[selectedIndex].url}
          alt={images[selectedIndex].altText || "Product image"}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, i) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden border transition-all",
                i === selectedIndex ? "border-lsr-orange opacity-100" : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || "Product thumbnail"}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
