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
      className="block group border border-white/10 bg-white/[0.02] hover:border-lsr-orange/50 transition-colors"
    >
      <div className="relative aspect-square bg-black overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            style={{ objectFit: "cover" }}
            className="opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <span className="text-[10px] uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute top-0 right-0 bg-lsr-orange text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          View
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-black italic text-xl text-white uppercase tracking-tighter truncate mb-1">
          {title}
        </h3>
        <Price 
          price={priceRange.minVariantPrice} 
          className="font-mono text-sm text-lsr-orange"
          currencyCodeClassName="hidden"
        />
      </div>
    </Link>
  );
}
