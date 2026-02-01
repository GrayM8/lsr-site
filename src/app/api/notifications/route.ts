import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/session";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
} from "@/server/services/notification.service";

export async function GET() {
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [notifications, unreadCount] = await Promise.all([
    getRecentNotifications(user.id, 20),
    getUnreadNotificationCount(user.id),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(request: Request) {
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "markAllRead") {
    await markAllNotificationsAsRead(user.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
