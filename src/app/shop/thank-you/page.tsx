import { Metadata } from "next";
import { ThankYouContent } from "@/components/shop/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your order from Longhorn Sim Racing.",
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
