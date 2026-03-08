"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Image as ImageType } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export function ProductGallery({ images }: { images: ImageType[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext, isZoomed]);

  if (!images.length) return null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main image with zoom trigger */}
        <button
          onClick={() => setIsZoomed(true)}
          className="relative aspect-square w-full overflow-hidden bg-white/5 border border-white/5 group cursor-zoom-in"
        >
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].altText || "Product image"}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Navigation arrows on main image */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((image, i) => (
              <button
                key={image.url}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden border transition-all",
                  i === selectedIndex
                    ? "border-lsr-orange opacity-100"
                    : "border-transparent opacity-50 hover:opacity-100"
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

        {/* Keyboard hint */}
        {images.length > 1 && (
          <p className="text-[10px] text-white/30 text-center uppercase tracking-wider hidden md:block">
            Use arrow keys to navigate
          </p>
        )}
      </div>

      {/* Zoom modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-white/10 rounded-none overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close zoom"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-10 text-white/60 text-sm font-bold">
                {selectedIndex + 1} / {images.length}
              </div>
            )}

            {/* Main zoomed image */}
            <div className="relative w-full h-full">
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].altText || "Product image"}
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Thumbnail strip at bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 backdrop-blur-sm">
                {images.map((image, i) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedIndex(i)}
                    className={cn(
                      "relative h-12 w-12 flex-shrink-0 overflow-hidden border transition-all",
                      i === selectedIndex
                        ? "border-lsr-orange opacity-100"
                        : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || "Product thumbnail"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
