import { getCollectionByHandle } from "@/lib/shopify/catalog";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import SectionReveal from "@/components/home/SectionReveal";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Collection Not Found",
    };
  }

  const { title, description, image } = collection;

  return {
    title: `${title} - Shop`,
    description: description || `Shop the ${title} collection.`,
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-10 px-6 md:px-8 pb-10 md:pb-14 pt-10">
       <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
                <p className="font-sans font-bold text-lsr-orange uppercase tracking-[0.2em] text-xs mb-4">Collection</p>
                <h1 className="font-display font-black italic text-5xl md:text-6xl uppercase tracking-tighter mb-4">
                    {collection.title}
                </h1>
                {collection.description && (
                    <p className="font-sans text-white/60 max-w-2xl mx-auto leading-relaxed">
                        {collection.description}
                    </p>
                )}
            </div>

            <SectionReveal index={0}>
                <ProductGrid products={collection.products} />
            </SectionReveal>
            
            {collection.products.length === 0 && (
                <div className="text-center py-20 text-white/40 font-sans">
                    No products found in this collection.
                </div>
            )}
       </div>
    </div>
  );
}
