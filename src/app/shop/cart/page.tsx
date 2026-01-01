import { CartView } from "@/components/shop/CartView";
import SectionReveal from "@/components/home/SectionReveal";

export default function CartPage() {
  return (
    <div className="px-6 md:px-8 pb-10 md:pb-14 pt-10 min-h-[60vh]">
        <SectionReveal index={0} className="max-w-6xl mx-auto">
            <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tighter mb-8">
                Your <span className="text-lsr-orange">Cart</span>
            </h1>
            <CartView />
        </SectionReveal>
    </div>
  );
}
