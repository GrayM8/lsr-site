"use client";

import { Money } from "@/lib/shopify/types";
import { AnimatePresence, motion } from "framer-motion";

export function Price({
  price,
  className = "",
  currencyCodeClassName = "",
}: {
  price: Money;
  className?: string;
  currencyCodeClassName?: string;
}) {
  const amount = parseFloat(price.amount);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(amount);

  return (
    <p suppressHydrationWarning className={className}>
      {formatted} <span className={currencyCodeClassName}>{price.currencyCode}</span>
    </p>
  );
}

export function AnimatedPrice({
  price,
  className = "",
  currencyCodeClassName = "",
}: {
  price: Money;
  className?: string;
  currencyCodeClassName?: string;
}) {
  const amount = parseFloat(price.amount);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(amount);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={price.amount + price.currencyCode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={className}
        suppressHydrationWarning
      >
        {formatted}{" "}
        <span className={currencyCodeClassName}>{price.currencyCode}</span>
      </motion.p>
    </AnimatePresence>
  );
}
