"use client";

import { ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/lib/shopify/CartContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  variant,
  availableForSale,
  productTitle,
}: {
  variant: ProductVariant;
  availableForSale: boolean;
  productTitle?: string;
}) {
  const { addToCart, isUpdating } = useCart();

  const handleAddToCart = async () => {
    const variantTitle = variant.title !== "Default Title" ? variant.title : undefined;
    const title = [productTitle, variantTitle].filter(Boolean).join(" - ");
    await addToCart(variant.id, 1, title || undefined);
  };

  const isPending = isUpdating;
  
  const isEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED === "true";

  if (!isEnabled) {
       return (
        <Button
          disabled
          className="w-full bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-[0.2em] h-14 rounded-none cursor-not-allowed"
        >
          Store Closed
        </Button>
      );
  }

  if (!availableForSale) {
    return (
      <Button
        disabled
        className="w-full bg-white/5 border border-white/10 text-white/40 font-black uppercase tracking-[0.2em] h-14 rounded-none cursor-not-allowed"
      >
        Sold Out
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      className="w-full bg-white text-lsr-charcoal font-black uppercase tracking-[0.2em] h-14 rounded-none hover:bg-lsr-orange hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
