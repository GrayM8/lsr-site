import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/session";
import { createEventCheckoutSession } from "@/server/services/payment.service";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const { user } = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = await createEventCheckoutSession(user.id, slug);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 400 }
    );
  }
}
