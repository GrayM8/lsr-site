import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Official Longhorn Sim Racing Merchandise",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-lsr-charcoal min-h-screen text-white">
      {children}
    </div>
  );
}
