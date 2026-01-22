import { getProductByHandle } from "@/lib/shopify/catalog";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { VariantSelector } from "@/components/shop/VariantSelector";
import { Price } from "@/components/shop/Price";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const { title, description, images } = product;
  const image = images[0];

  return {
    title: `${title} - Shop`,
    description: description.substring(0, 160),
    alternates: {
      canonical: `/shop/products/${handle}`,
    },
    openGraph: {
      images: [
        {
          url: image?.url || "",
          width: image?.width || 800,
          height: image?.height || 600,
          alt: image?.altText || title,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Derive options from variants to pass to selector
  // Shopify products have `options` field usually, but our type definition in `types.ts` didn't include it explicitly on Product.
  // However, variants have `selectedOptions`. We can infer options or update `types.ts` and `mappers.ts` to include `options`.
  // For now, let's extract unique options from variants.
  
  const optionsMap = new Map<string, Set<string>>();
  product.variants.forEach(variant => {
      variant.selectedOptions.forEach(opt => {
          if (!optionsMap.has(opt.name)) {
              optionsMap.set(opt.name, new Set());
          }
          optionsMap.get(opt.name)?.add(opt.value);
      });
  });

  const options = Array.from(optionsMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values)
  }));

  // Determine selected variant based on searchParams, or default to first
  const selectedVariant = product.variants.find(variant => 
    variant.selectedOptions.every(opt => {
        const paramValue = resolvedSearchParams[opt.name.toLowerCase()];
        return paramValue === opt.value;
    })
  ) || product.variants[0];

  return (
    <div className="px-6 md:px-8 pb-10 md:pb-14 pt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div>
                <ProductGallery images={product.images} />
            </div>

            {/* Details */}
            <div className="flex flex-col">
                 <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-normal mb-4 leading-none">
                    {product.title}
                </h1>
                
                <div className="mb-8 flex items-baseline gap-4">
                     <Price 
                        price={selectedVariant?.price || product.priceRange.minVariantPrice} 
                        className="text-2xl md:text-3xl font-sans font-bold text-lsr-orange"
                        currencyCodeClassName="text-sm text-white/40 ml-1"
                    />
                </div>

                <div className="space-y-8 flex-1">
                    <VariantSelector variants={product.variants} options={options} />
                    
                    <div className="pt-4 border-t border-white/10">
                         <AddToCartButton 
                            variant={selectedVariant}
                            availableForSale={selectedVariant?.availableForSale && product.availableForSale} 
                         />
                    </div>

                    <div className="prose prose-invert prose-sm text-white/60 font-sans leading-relaxed">
                        {product.descriptionHtml ? (
                             <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                        ) : (
                            <p>{product.description}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
