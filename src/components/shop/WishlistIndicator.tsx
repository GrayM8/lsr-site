"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getWishlist } from "@/lib/shopify/wishlist";
import { usePathname } from "next/navigation";

export function WishlistIndicator() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();
  const isShopPage = pathname.startsWith("/shop");

  useEffect(() => {
    // Initial count
    setWishlistCount(getWishlist().length);

    const handleUpdate = () => {
      setWishlistCount(getWishlist().length);
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  // Show indicator if on shop pages OR if there are items in the wishlist
  if (!isShopPage && wishlistCount === 0) return null;

  return (
    <Link
      href="/shop/wishlist"
      className="relative text-white/70 hover:text-lsr-orange transition-colors p-2"
      aria-label={`Wishlist with ${wishlistCount} items`}
    >
      <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-white/10" : ""}`} />
      {wishlistCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-lsr-orange/80 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in-50 duration-200">
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      )}
    </Link>
  );
}
