"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RecentProduct,
  getRecentlyViewed,
  addRecentlyViewed,
} from "@/lib/shopify/recentlyViewed";
import { Price } from "./Price";
import { Product } from "@/lib/shopify/types";

interface RecentlyViewedProps {
  currentHandle: string;
}

export function RecentlyViewed({ currentHandle }: RecentlyViewedProps) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    // Get recently viewed, excluding current product
    const viewed = getRecentlyViewed().filter(
      (item) => item.handle !== currentHandle
    );
    setItems(viewed);
  }, [currentHandle]);

  if (items.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-white/10">
      <h2 className="font-display font-black italic text-2xl uppercase tracking-normal mb-8">
        Recently <span className="text-lsr-orange">Viewed</span>
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {items.map((item) => (
          <Link
            key={item.handle}
            href={`/shop/products/${item.handle}`}
            className="flex-shrink-0 w-40 group"
          >
            <div className="relative aspect-square bg-white/5 border border-white/10 overflow-hidden mb-3 group-hover:border-lsr-orange/50 transition-colors">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt || item.title}
                fill
                sizes="160px"
                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <h3 className="font-sans font-bold text-sm text-white truncate mb-1">
              {item.title}
            </h3>
            <Price
              price={item.price}
              className="font-mono text-xs text-lsr-orange"
              currencyCodeClassName="hidden"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

// Hook to track product views
export function useTrackProductView(product: Product) {
  useEffect(() => {
    if (!product) return;

    const recentProduct: RecentProduct = {
      handle: product.handle,
      title: product.title,
      imageUrl: product.images[0]?.url || "",
      imageAlt: product.images[0]?.altText || product.title,
      price: product.priceRange.minVariantPrice,
    };

    addRecentlyViewed(recentProduct);
  }, [product]);
}
