"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl: string | null;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  // Fetch on mount and poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "REGISTRATION_CONFIRMED":
        return "bg-green-500";
      case "WAITLIST_PROMOTED":
        return "bg-lsr-orange";
      case "EVENT_REMINDER_24H":
        return "bg-blue-500";
      default:
        return "bg-white/20";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/5 rounded-none text-white/70 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-lsr-orange text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in-50 duration-200">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-lsr-charcoal border-white/10 rounded-none p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-white/60">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-lsr-orange hover:text-white transition-colors"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="h-8 w-8 mx-auto mb-3 text-white/20" />
              <p className="text-sm text-white/40">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                asChild
                className="focus:bg-white/5 rounded-none cursor-pointer p-0"
              >
                {notification.actionUrl ? (
                  <Link
                    href={notification.actionUrl}
                    onClick={() => handleNotificationClick(notification)}
                    className="block w-full"
                  >
                    <NotificationItem
                      notification={notification}
                      iconColor={getNotificationIcon(notification.type)}
                    />
                  </Link>
                ) : (
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="block w-full"
                  >
                    <NotificationItem
                      notification={notification}
                      iconColor={getNotificationIcon(notification.type)}
                    />
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-white/10 m-0" />
            <Link
              href="/account/notifications"
              className="flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-lsr-orange hover:bg-white/5 transition-colors"
            >
              View all notifications
              <ExternalLink className="h-3 w-3" />
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({
  notification,
  iconColor,
}: {
  notification: Notification;
  iconColor: string;
}) {
  const isUnread = !notification.readAt;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      className={`px-4 py-3 border-b border-white/5 ${isUnread ? "bg-white/[0.02]" : ""}`}
    >
      <div className="flex gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${isUnread ? "text-white" : "text-white/70"}`}
          >
            {notification.title}
          </p>
          <p className="text-xs text-white/50 line-clamp-2 mt-0.5">
            {notification.body}
          </p>
          <p className="text-[10px] text-white/30 mt-1">{timeAgo}</p>
        </div>
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-lsr-orange flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}
