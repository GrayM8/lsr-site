import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const { handle, title, priceRange, images } = product;
  const image = images[0];

  return (
    <Link
      href={`/shop/products/${handle}`}
      className="group relative flex flex-col border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-lsr-orange transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-10" />

      <div className="relative aspect-square w-full overflow-hidden bg-white/5">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            No Image
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-sans font-bold text-lg text-white group-hover:text-lsr-orange transition-colors leading-snug mb-2">
          {title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
            <Price 
                price={priceRange.minVariantPrice} 
                className="font-display font-medium text-white/80"
                currencyCodeClassName="text-white/40 text-xs ml-1"
            />
        </div>
      </div>
    </Link>
  );
}
