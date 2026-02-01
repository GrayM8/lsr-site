"use server";

import { prisma } from "@/server/db";
import { requireAdmin } from "@/lib/authz";
import { revalidatePath } from "next/cache";
import {
  sendNotification,
  sendBulkNotification,
  cancelNotification,
  retryNotification,
} from "@/server/services/notification.service";
import { setSystemSetting, getSystemSetting, SETTINGS } from "@/lib/email/settings";
import { NotificationChannel } from "@prisma/client";

export async function getNotificationStats() {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  const [total, pending, sent, failed] = await Promise.all([
    prisma.notification.count(),
    prisma.notification.count({ where: { status: "PENDING" } }),
    prisma.notification.count({ where: { status: "SENT" } }),
    prisma.notification.count({ where: { status: "FAILED" } }),
  ]);

  return { total, pending, sent, failed };
}

export async function getRecentNotifications(limit = 50) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  return prisma.notification.findMany({
    include: {
      user: {
        select: { id: true, displayName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getScheduledNotifications() {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  return prisma.notification.findMany({
    where: {
      status: "PENDING",
      scheduledFor: { not: null },
    },
    include: {
      user: {
        select: { id: true, displayName: true, email: true },
      },
    },
    orderBy: { scheduledFor: "asc" },
  });
}

export async function cancelScheduledNotification(notificationId: string) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  await cancelNotification(notificationId);
  revalidatePath("/admin/notifications");
}

export async function retryFailedNotification(notificationId: string) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  await retryNotification(notificationId);
  revalidatePath("/admin/notifications");
}

export async function sendCustomNotification(formData: FormData) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  const recipientType = formData.get("recipientType") as string;
  const userId = formData.get("userId") as string | null;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const actionUrl = (formData.get("actionUrl") as string) || undefined;
  const sendInApp = formData.get("sendInApp") === "on";
  const sendEmail = formData.get("sendEmail") === "on";
  const scheduledFor = formData.get("scheduledFor") as string | null;

  const channels: NotificationChannel[] = [];
  if (sendInApp) channels.push("IN_APP");
  if (sendEmail) channels.push("EMAIL");

  if (channels.length === 0) {
    throw new Error("At least one channel must be selected");
  }

  if (!title || !body) {
    throw new Error("Title and body are required");
  }

  const scheduledDate = scheduledFor ? new Date(scheduledFor) : undefined;

  if (recipientType === "single" && userId) {
    await sendNotification({
      userId,
      type: "CUSTOM",
      title,
      body,
      actionUrl,
      channels,
      scheduledFor: scheduledDate,
    });
  } else if (recipientType === "all") {
    const users = await prisma.user.findMany({
      where: { status: "active" },
      select: { id: true },
    });
    await sendBulkNotification({
      userIds: users.map((u) => u.id),
      type: "CUSTOM",
      title,
      body,
      actionUrl,
      channels,
      scheduledFor: scheduledDate,
    });
  }

  revalidatePath("/admin/notifications");
}

export async function getEmailSettings() {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  const [enabled, fromAddress] = await Promise.all([
    getSystemSetting<boolean>(SETTINGS.EMAIL_ENABLED),
    getSystemSetting<string>(SETTINGS.EMAIL_FROM),
  ]);

  return {
    enabled: enabled ?? true,
    fromAddress:
      fromAddress ?? "Longhorn Sim Racing <noreply@notify.longhornsimracing.org>",
  };
}

export async function updateEmailSettings(formData: FormData) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  const enabled = formData.get("enabled") === "on";
  const fromAddress = formData.get("fromAddress") as string;

  await Promise.all([
    setSystemSetting(SETTINGS.EMAIL_ENABLED, enabled),
    setSystemSetting(SETTINGS.EMAIL_FROM, fromAddress),
  ]);

  revalidatePath("/admin/notifications");
}

export async function searchUsers(query: string) {
  const res = await requireAdmin();
  if (!res.ok) throw new Error("Unauthorized");

  if (!query || query.length < 2) return [];

  return prisma.user.findMany({
    where: {
      OR: [
        { displayName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { handle: { contains: query, mode: "insensitive" } },
      ],
      status: "active",
    },
    select: {
      id: true,
      displayName: true,
      email: true,
      handle: true,
    },
    take: 10,
  });
}
