import { Money } from "@/lib/shopify/types";

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
