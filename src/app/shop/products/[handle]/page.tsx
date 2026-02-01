import { getProductByHandle } from "@/lib/shopify/catalog";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Metadata } from "next";
import { hasOnDemandBoilerplate, ON_DEMAND_TEXT } from "@/lib/product-content";
import { PackageOpen } from "lucide-react";

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
  // We mirror the logic in VariantSelector: if a param is missing, assume the first value (default).
  const effectiveSelections: Record<string, string> = {};
  options.forEach(opt => {
      const key = opt.name.toLowerCase();
      const val = resolvedSearchParams[key];
      const strVal = Array.isArray(val) ? val[0] : val;
      effectiveSelections[opt.name] = strVal || opt.values[0];
  });

  const selectedVariant = product.variants.find(variant => 
    variant.selectedOptions.every(opt => effectiveSelections[opt.name] === opt.value)
  ) || product.variants[0];

  return (
    <div className="px-6 md:px-8 pb-10 md:pb-14 pt-10">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            ...(product.productType
              ? [{ label: product.productType }]
              : []),
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="space-y-6">
                <ProductGallery images={product.images} />
                
                {hasOnDemandBoilerplate(product.descriptionHtml) && (
                    <div className="hidden lg:flex gap-4 p-5 border border-white/10 bg-white/[0.02]">
                        <PackageOpen className="w-5 h-5 text-lsr-orange shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <h4 className="font-display font-black uppercase text-xs tracking-widest text-white/80">Made to Order</h4>
                            <p className="text-[11px] text-white/50 font-sans leading-relaxed">
                                {ON_DEMAND_TEXT}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Details */}
            <ProductDetails
              product={product}
              selectedVariant={selectedVariant}
              options={options}
            />
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed currentHandle={handle} />
      </div>
    </div>
  );
}
