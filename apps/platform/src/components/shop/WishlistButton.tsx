"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  isInWishlist,
  toggleWishlist,
  WishlistItem,
} from "@/lib/shopify/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: Omit<WishlistItem, "addedAt">;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WishlistButton({
  item,
  className,
  size = "md",
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check initial state and listen for updates
  useEffect(() => {
    setIsWishlisted(isInWishlist(item.handle));

    const handleUpdate = () => {
      setIsWishlisted(isInWishlist(item.handle));
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, [item.handle]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nowWishlisted = toggleWishlist(item);
    setIsWishlisted(nowWishlisted);

    if (nowWishlisted) {
      toast.success("Added to wishlist", {
        description: item.title,
        action: {
          label: "View Wishlist",
          onClick: () => {
            window.location.href = "/shop/wishlist";
          },
        },
      });
    } else {
      toast.success("Removed from wishlist");
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 transition-all",
        isWishlisted
          ? "text-red-500 hover:text-red-400"
          : "text-white/40 hover:text-white",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(sizeClasses[size], isWishlisted && "fill-current")}
      />
    </button>
  );
}
