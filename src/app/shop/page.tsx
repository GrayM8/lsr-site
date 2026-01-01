import { getCollections } from "@/lib/shopify/catalog";
import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "@/components/shop/ProductGrid";
import SectionReveal from "@/components/home/SectionReveal";
import { Metadata } from "next";

const SHOP_ENABLED = process.env.NEXT_PUBLIC_SHOP_ENABLED === "true";

export const metadata: Metadata = {
  title: "Shop",
  description: "Official Longhorn Sim Racing Merchandise and Team Kit.",
  openGraph: {
    title: "Shop - Longhorn Sim Racing",
    description: "Official Longhorn Sim Racing Merchandise and Team Kit.",
    type: "website",
  },
};

export default async function ShopPage() {
  if (!SHOP_ENABLED) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-10 md:-mt-14">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gal_12.jpg"
            alt="LSR Racing Background"
            fill
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-lsr-charcoal/50 via-lsr-charcoal to-lsr-charcoal" />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-display font-black italic text-6xl md:text-9xl uppercase tracking-tighter mb-6 leading-none">
            Merch Drop <br className="md:hidden" /><span className="text-lsr-orange">Closed</span>
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto uppercase tracking-[0.2em] font-bold">
            The LSR shop is currently closed. <br />Stay tuned for our next seasonal drop.
          </p>
          <div className="inline-block border-2 border-white/10 bg-white/5 backdrop-blur-md px-10 py-5 uppercase tracking-[0.4em] font-black text-xs md:text-sm text-white/40">
            Next Drop: <span className="text-white">TBA</span>
          </div>
        </div>
      </div>
    );
  }

  const collections = await getCollections();

  // If no collections, show empty state
  if (!collections.length) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
         <h1 className="font-display font-black italic text-4xl uppercase tracking-tighter mb-4">
          Coming Soon
        </h1>
        <p className="text-white/60">No collections found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-14 px-6 md:px-8 pb-10 md:pb-14 pt-10">
        {/* Hero-ish header */}
        <div className="max-w-6xl mx-auto mb-16 text-center">
             <h1 className="font-display font-black italic text-5xl md:text-7xl uppercase tracking-tighter mb-6">
              LSR <span className="text-lsr-orange">Shop</span>
            </h1>
            <p className="font-sans text-xl text-white/60 max-w-2xl mx-auto">
                Official team kit and streetwear.
            </p>
        </div>

      {collections.map((collection, index) => (
         <SectionReveal key={collection.id} index={index} className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
                <div>
                    <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tighter">
                        {collection.title}
                    </h2>
                     {collection.description && (
                        <p className="text-white/40 text-sm mt-2 max-w-xl">{collection.description}</p>
                    )}
                </div>
                <Link 
                    href={`/shop/collections/${collection.handle}`}
                    className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-lsr-orange transition-colors"
                >
                    View Collection
                </Link>
            </div>
            
             {/* 
                The basic getCollections call does not return products by default in our current query implementation 
                (usually collections query is just metadata). 
                However, for the landing page, it's nice to show a preview. 
                
                Actually, checking `src/lib/shopify/queries.ts`, COLLECTIONS_QUERY only fetches handle/title/image/description.
                So `collection.products` will be empty here based on current `getCollections` impl.
                
                To fix this, we should link to the collection page, or fetch products for each collection.
                Fetching products for ALL collections might be heavy.
                Let's stick to displaying the collection as a card OR link to it. 
                
                The requirements said: "featured collections grid".
             */}
            
            {/* Since we don't have products, let's render a Collection Card or just a banner if image exists, 
                otherwise we just showed the title/link above.
                Let's try to improve the display.
            */}
            
            {collection.image && (
                 <Link href={`/shop/collections/${collection.handle}`} className="block relative aspect-[21/9] w-full overflow-hidden mb-6 border border-white/10 group">
                    <Image 
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="border border-white/20 bg-black/50 backdrop-blur-sm px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white group-hover:bg-lsr-orange group-hover:border-lsr-orange transition-colors">
                            Shop {collection.title}
                         </span>
                    </div>
                </Link>
            )}
            
            {!collection.image && (
                 <div className="py-12 text-center border border-white/5 bg-white/[0.03] mb-6">
                    <Link 
                        href={`/shop/collections/${collection.handle}`}
                        className="inline-block border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-lsr-orange hover:border-lsr-orange hover:text-white transition-colors"
                    >
                        Shop {collection.title}
                    </Link>
                 </div>
            )}

         </SectionReveal>
      ))}
    </div>
  );
}
