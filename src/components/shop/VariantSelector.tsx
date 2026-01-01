"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function VariantSelector({
  variants,
  options,
}: {
  variants: ProductVariant[];
  options: { name: string; values: string[] }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If no options, don't render selector
  if (!options.length || (options.length === 1 && options[0]?.values.length === 1)) {
    return null;
  }

  // Helper to check if a combination exists
  const isAvailableForSale = (optionName: string, value: string) => {
    // This is a simplified check. Ideally we check if the combination of this option + currently selected other options exists.
    // For now, let's just assume we want to render all options and let the user pick.
    // A better implementation checks against `variants`.
    return true; 
  };
  
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name}>
          <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">
            {option.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isActive = searchParams.get(option.name.toLowerCase()) === value;
              const isAvailable = isAvailableForSale(option.name, value);

              // Create new params for this option
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set(option.name.toLowerCase(), value);

              return (
                <button
                  key={value}
                  onClick={() => {
                    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
                  }}
                  className={cn(
                    "px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-all",
                    isActive
                      ? "bg-lsr-orange border-lsr-orange text-white"
                      : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
