"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { Price } from "./Price";
import { useCart } from "@/lib/shopify/CartContext";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const { handle, title, priceRange, images, variants, availableForSale } = product;
  const image = images[0];
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isSingleVariant = variants.length === 1;
  const defaultVariant = variants[0];
  const canQuickAdd =
    isSingleVariant && defaultVariant.availableForSale && availableForSale;

  const isShopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED === "true";

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canQuickAdd || isAdding) return;

    setIsAdding(true);
    await addToCart(defaultVariant.id, 1, title);
    setIsAdding(false);
  };

  return (
    <Link
      href={`/shop/products/${handle}`}
      className="block group border border-white/10 bg-white/[0.02] hover:border-lsr-orange/50 transition-colors"
    >
      <div className="relative aspect-square bg-black overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            style={{ objectFit: "cover" }}
            className="opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <span className="text-[10px] uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        {/* Hover overlay with action button */}
        {isShopEnabled && (
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {canQuickAdd ? (
              <button
                onClick={handleQuickAdd}
                disabled={isAdding}
                className="w-full bg-lsr-orange text-white py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-lsr-charcoal transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Quick Add"
                )}
              </button>
            ) : !availableForSale ? (
              <div className="w-full bg-white/10 text-white/40 py-2.5 text-[10px] font-black uppercase tracking-widest text-center">
                Sold Out
              </div>
            ) : (
              <div className="w-full bg-white/90 text-lsr-charcoal py-2.5 text-[10px] font-black uppercase tracking-widest text-center">
                Select Options
              </div>
            )}
          </div>
        )}

        {/* View badge - only show when shop is disabled */}
        {!isShopEnabled && (
          <div className="absolute top-0 right-0 bg-lsr-orange text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton
            item={{
              handle,
              title,
              imageUrl: image?.url || "",
              imageAlt: image?.altText || title,
              price: priceRange.minVariantPrice,
            }}
            size="sm"
            className="bg-black/50 hover:bg-black/70"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-black italic text-xl text-white uppercase tracking-normal truncate mb-1">
          {title}
        </h3>
        <Price
          price={priceRange.minVariantPrice}
          className="font-mono text-sm text-lsr-orange"
          currencyCodeClassName="hidden"
        />
      </div>
    </Link>
  );
}
