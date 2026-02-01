import { Metadata } from "next";
import { WishlistView } from "@/components/shop/WishlistView";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items from Longhorn Sim Racing shop.",
};

export default function WishlistPage() {
  return (
    <div className="px-6 md:px-8 pb-10 md:pb-14 pt-10 min-h-[60vh]">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Wishlist" }
          ]} 
        />
        <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-normal mb-8">
          Your <span className="text-lsr-orange">Wishlist</span>
        </h1>
        <WishlistView />
      </div>
    </div>
  );
}
