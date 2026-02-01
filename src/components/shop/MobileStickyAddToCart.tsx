"use client";

import { useEffect, useState, useRef } from "react";
import { ProductVariant, Money } from "@/lib/shopify/types";
import { useCart } from "@/lib/shopify/CartContext";
import { Price } from "./Price";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileStickyAddToCartProps {
  variant: ProductVariant;
  price: Money;
  availableForSale: boolean;
  productTitle: string;
  targetRef: React.RefObject<HTMLElement | null>;
}

export function MobileStickyAddToCart({
  variant,
  price,
  availableForSale,
  productTitle,
  targetRef,
}: MobileStickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart, isUpdating } = useCart();
  const isEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED === "true";

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when target is NOT in view
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px", // Account for header height
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  const handleAddToCart = async () => {
    const variantTitle = variant.title !== "Default Title" ? variant.title : undefined;
    const title = [productTitle, variantTitle].filter(Boolean).join(" - ");
    await addToCart(variant.id, 1, title || undefined);
  };

  if (!isEnabled) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-lsr-charcoal/95 backdrop-blur-md border-t border-white/10 p-4 md:hidden",
        "transform transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Price
          price={price}
          className="font-sans font-bold text-lg text-lsr-orange"
          currencyCodeClassName="text-sm text-white/40 ml-1"
        />

        <button
          onClick={handleAddToCart}
          disabled={!availableForSale || isUpdating}
          className={cn(
            "flex-1 max-w-xs py-3 font-black uppercase tracking-[0.15em] text-sm transition-all flex items-center justify-center gap-2",
            availableForSale
              ? "bg-white text-lsr-charcoal hover:bg-lsr-orange hover:text-white"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          )}
        >
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
          {!availableForSale ? "Sold Out" : isUpdating ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
