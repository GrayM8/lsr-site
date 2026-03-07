"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { RecentProduct, getRecentlyViewed } from "@/lib/shopify/recentlyViewed";
import { Price } from "./Price";

export function EmptyCartState() {
  const [recentItems, setRecentItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const items = getRecentlyViewed();
    setRecentItems(items.slice(0, 4));
  }, []);

  return (
    <div className="py-12">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <ShoppingCart className="h-16 w-16 text-white/20 mb-6" />
        <h2 className="font-display font-black italic text-3xl uppercase tracking-normal mb-4">
          Your cart is empty
        </h2>
        <p className="text-white/60 mb-8 font-sans">
          Looks like you haven't added any gear yet.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-lsr-charcoal font-black uppercase tracking-[0.2em] px-8 py-4 hover:bg-lsr-orange hover:text-white transition-all"
        >
          Start Shopping
        </Link>
      </div>

      {/* Recently Viewed section */}
      {recentItems.length > 0 && (
        <div className="border-t border-white/10 pt-12">
          <h3 className="font-display font-black italic text-xl uppercase tracking-normal mb-8 text-center">
            Recently <span className="text-lsr-orange">Viewed</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentItems.map((item) => (
              <Link
                key={item.handle}
                href={`/shop/products/${item.handle}`}
                className="group block border border-white/10 bg-white/[0.02] hover:border-lsr-orange/50 transition-colors"
              >
                <div className="relative aspect-square bg-black overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-sans font-bold text-sm text-white truncate mb-1">
                    {item.title}
                  </h4>
                  <Price
                    price={item.price}
                    className="font-mono text-xs text-lsr-orange"
                    currencyCodeClassName="hidden"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
