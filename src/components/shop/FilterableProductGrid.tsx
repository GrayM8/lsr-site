"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import { ProductFilters } from "./ProductFilters";
import { ProductCard } from "./ProductCard";
import { motion, Variants, AnimatePresence } from "framer-motion";

export function FilterableProductGrid({ products }: { products: Product[] }) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div>
      <ProductFilters products={products} onFilter={setFilteredProducts} />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 font-sans text-lg">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                layout
                exit="exit"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
