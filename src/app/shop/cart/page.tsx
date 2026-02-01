import { CartView } from "@/components/shop/CartView";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

export default function CartPage() {
  return (
    <div className="px-6 md:px-8 pb-10 md:pb-14 pt-10 min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
            <Breadcrumbs 
              items={[
                { label: "Shop", href: "/shop" },
                { label: "Your Cart" }
              ]} 
            />
            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-normal mb-8">
                Your <span className="text-lsr-orange">Cart</span>
            </h1>
            <CartView />
        </div>
    </div>
  );
}
