"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductVariant } from "@/lib/shopify/types";
import { getStoredCartId, setStoredCartId } from "@/lib/shopify/cartStorage";
import { Loader2 } from "lucide-react"; // Assuming lucide-react is available given shadcn/ui usually uses it

import { Button } from "@/components/ui/button";

export function AddToCartButton({
  variant,
  availableForSale,
}: {
  variant: ProductVariant;
  availableForSale: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsPending(true);
    try {
      let cartId = getStoredCartId();
      
      if (!cartId) {
        // Create new cart
        const res = await fetch("/api/shopify/cart/create", { method: "POST" });
        const data = await res.json();
        if (data.ok && data.cart) {
          cartId = data.cart.id;
          setStoredCartId(cartId!);
        } else {
            console.error("Failed to create cart", data.error);
            // Handle error (maybe toast)
            setIsPending(false);
            return;
        }
      }

      // Add line
      const res = await fetch("/api/shopify/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          merchandiseId: variant.id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        router.push("/shop/cart"); // or open drawer
      } else {
         console.error("Failed to add to cart", data.error);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };
  
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
