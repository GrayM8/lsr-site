"use client";

import { useCart } from "@/lib/shopify/CartContext";
import { Price } from "./Price";
import Image from "next/image";
import { Loader2, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyCartState } from "./EmptyCartState";

export function CartView() {
  const { cart, isLoading, isUpdating, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-white/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        {cart.lines.map((line) => (
          <div key={line.id} className="flex gap-4 md:gap-6 border border-white/5 bg-white/[0.03] p-4 items-center">
             <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 bg-white/5 border border-white/5">
                {line.merchandise.product.featuredImage && (
                    <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                        fill
                        className="object-cover"
                    />
                )}
             </div>
             
             <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-sans font-bold text-white text-sm md:text-base truncate pr-4">
                        {line.merchandise.product.title}
                    </h3>
                    <Price price={line.cost.totalAmount} className="font-sans font-bold text-white text-sm md:text-base" />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">
                    {line.merchandise.title}
                </p>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-white/10">
                        <button 
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-50"
                            disabled={isUpdating || line.quantity <= 1}
                        >
                            -
                        </button>
                        <span className="px-2 text-sm font-bold w-8 text-center">{line.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="px-3 py-1 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-50"
                            disabled={isUpdating}
                        >
                            +
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => removeItem(line.id)}
                        disabled={isUpdating}
                        className="text-white/40 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
         <div className="border border-white/10 bg-white/[0.03] p-6 sticky top-24">
            <h2 className="font-display font-black italic text-xl uppercase tracking-normal mb-6">Summary</h2>
            
            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <Price price={cart.cost.subtotalAmount} />
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tax (Est.)</span>
                    <Price price={cart.cost.totalTaxAmount} />
                </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8">
                 <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <Price price={cart.cost.totalAmount} />
                </div>
                <p className="text-xs text-white/40 mt-2">Shipping calculated at checkout.</p>
            </div>
            
            <Button 
                asChild
                className="w-full bg-lsr-orange text-white font-black uppercase tracking-[0.2em] h-14 rounded-none hover:bg-white hover:text-lsr-charcoal transition-colors flex items-center justify-center gap-2"
            >
                <a href={cart.checkoutUrl}>
                    Checkout <ArrowRight className="h-4 w-4" />
                </a>
            </Button>
         </div>
      </div>
    </div>
  );
}