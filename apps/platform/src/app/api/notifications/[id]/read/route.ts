import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/session";
import { markNotificationAsRead } from "@/server/services/notification.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await markNotificationAsRead(id, user.id);

  return NextResponse.json({ success: true });
}
