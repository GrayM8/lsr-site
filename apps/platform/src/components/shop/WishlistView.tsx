"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { WishlistItem, getWishlist, removeFromWishlist } from "@/lib/shopify/wishlist";
import { Price } from "./Price";
import { toast } from "sonner";

export function WishlistView() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setItems(getWishlist());
    setIsLoading(false);

    const handleUpdate = () => {
      setItems(getWishlist());
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  const handleRemove = (handle: string, title: string) => {
    removeFromWishlist(handle);
    toast.success("Removed from wishlist", { description: title });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-white/20 border-t-lsr-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="h-16 w-16 text-white/20 mb-6" />
        <h2 className="font-display font-black italic text-3xl uppercase tracking-normal mb-4">
          Your wishlist is empty
        </h2>
        <p className="text-white/60 mb-8 font-sans">
          Save items you love by clicking the heart icon.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-lsr-charcoal font-black uppercase tracking-[0.2em] px-8 py-4 hover:bg-lsr-orange hover:text-white transition-all"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.handle}
          className="group border border-white/10 bg-white/[0.02] hover:border-lsr-orange/50 transition-colors relative"
        >
          <Link href={`/shop/products/${item.handle}`} className="block">
            <div className="relative aspect-square bg-black overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt || item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display font-black italic text-lg text-white uppercase tracking-normal truncate mb-1">
                {item.title}
              </h3>
              <Price
                price={item.price}
                className="font-mono text-sm text-lsr-orange"
                currencyCodeClassName="hidden"
              />
            </div>
          </Link>

          {/* Remove button */}
          <button
            onClick={() => handleRemove(item.handle, item.title)}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white/60 hover:text-red-500 hover:bg-black/70 transition-colors"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
