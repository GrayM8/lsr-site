"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { clearStoredCartId } from "@/lib/shopify/cartStorage";
import { useCart } from "@/lib/shopify/CartContext";

export function ThankYouContent() {
  const { refreshCart } = useCart();

  // Clear cart on mount
  useEffect(() => {
    clearStoredCartId();
    refreshCart();
  }, [refreshCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />

        <h1 className="font-display font-black italic text-5xl md:text-6xl uppercase tracking-normal mb-6 leading-none">
          Thank <span className="text-lsr-orange">You!</span>
        </h1>

        <p className="text-white/60 text-lg mb-4 font-sans">
          Your order has been placed successfully.
        </p>

        <p className="text-white/40 text-sm mb-10 font-sans">
          Check your email for order confirmation and tracking details. We'll get your gear to you as soon as possible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white text-lsr-charcoal font-black uppercase tracking-[0.15em] px-8 py-4 hover:bg-lsr-orange hover:text-white transition-all"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.15em] px-8 py-4 hover:border-lsr-orange hover:text-lsr-orange transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
