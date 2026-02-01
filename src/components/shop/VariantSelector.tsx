"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Get current selections from URL params (or defaults to first values)
  const getCurrentSelections = (): Record<string, string> => {
    const selections: Record<string, string> = {};
    options.forEach((option) => {
      const paramValue = searchParams.get(option.name.toLowerCase());
      selections[option.name.toLowerCase()] = paramValue || option.values[0];
    });
    return selections;
  };

  // Check if a specific option value is available given current selections of other options
  const isAvailableForSale = (optionName: string, value: string): boolean => {
    const currentSelections = getCurrentSelections();

    // Build the hypothetical selection with this option value
    const hypotheticalSelections = {
      ...currentSelections,
      [optionName.toLowerCase()]: value,
    };

    // Find if any variant matches all these selections AND is available
    return variants.some((variant) => {
      const matchesAllOptions = variant.selectedOptions.every(
        (opt) => hypotheticalSelections[opt.name.toLowerCase()] === opt.value
      );
      return matchesAllOptions && variant.availableForSale;
    });
  };

  // Handle option change
  const handleOptionChange = (optionName: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(optionName.toLowerCase(), value);
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const currentValue =
          searchParams.get(option.name.toLowerCase()) || option.values[0];

        return (
          <div key={option.name}>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">
              {option.name}
            </div>

            {/* Mobile: Dropdown selector */}
            <div className="md:hidden">
              <Select
                value={currentValue}
                onValueChange={(value) => handleOptionChange(option.name, value)}
              >
                <SelectTrigger className="w-full bg-transparent border-white/10 text-white font-bold uppercase tracking-wider rounded-none h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-lsr-charcoal border-white/10 rounded-none">
                  {option.values.map((value) => {
                    const isAvailable = isAvailableForSale(option.name, value);
                    return (
                      <SelectItem
                        key={value}
                        value={value}
                        disabled={!isAvailable}
                        className={cn(
                          "font-bold uppercase tracking-wider rounded-none cursor-pointer",
                          !isAvailable && "text-white/30 line-through"
                        )}
                      >
                        {value}
                        {!isAvailable && " (Sold Out)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop: Button grid */}
            <div className="hidden md:flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isActive = currentValue === value;
                const isAvailable = isAvailableForSale(option.name, value);

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    disabled={!isAvailable}
                    className={cn(
                      "px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-all",
                      isActive
                        ? "bg-lsr-orange border-lsr-orange text-white"
                        : isAvailable
                          ? "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                          : "bg-transparent border-white/5 text-white/20 line-through cursor-not-allowed"
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
