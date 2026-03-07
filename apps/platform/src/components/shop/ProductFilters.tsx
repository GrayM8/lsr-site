"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/shopify/types";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

export function ProductFilters({ products, onFilter }: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);

  // Extract unique product types
  const productTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((p) => {
      if (p.productType) {
        types.add(p.productType);
      }
    });
    return Array.from(types).sort();
  }, [products]);

  // Filter logic
  const applyFilters = useDebouncedCallback(
    (search: string, type: string | null) => {
      let filtered = products;

      // Filter by search term
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.productType.toLowerCase().includes(term)
        );
      }

      // Filter by product type
      if (type) {
        filtered = filtered.filter((p) => p.productType === type);
      }

      onFilter(filtered);
    },
    150
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, activeType);
  };

  const handleTypeChange = (type: string | null) => {
    setActiveType(type);
    applyFilters(searchTerm, type);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveType(null);
    onFilter(products);
  };

  const hasActiveFilters = searchTerm || activeType;

  return (
    <div className="space-y-6 mb-10">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 pl-12 pr-12 py-3 font-sans text-sm focus:outline-none focus:border-lsr-orange/50 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Category filters */}
      {productTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeChange(null)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all",
              !activeType
                ? "bg-lsr-orange border-lsr-orange text-white"
                : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
            )}
          >
            All
          </button>
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all",
                activeType === type
                  ? "bg-lsr-orange border-lsr-orange text-white"
                  : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>Filtering results</span>
          <button
            onClick={clearFilters}
            className="text-lsr-orange hover:text-white transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
