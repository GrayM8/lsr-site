import { NextRequest, NextResponse } from "next/server";
import { handleStripeWebhook } from "@/server/services/payment.service";

export async function POST(req: NextRequest) {
  const rawBody = Buffer.from(await req.arrayBuffer());
  const signature = req.headers.get("stripe-signature") ?? "";

  try {
    await handleStripeWebhook(rawBody, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Webhook processing error",
      },
      { status: 400 }
    );
  }
}
