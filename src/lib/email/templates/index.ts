import { baseTemplate } from "./base";
import { format } from "date-fns";

export type NotificationTemplateData = {
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
};

type EventData = {
  title: string;
  startsAt: Date;
  slug: string;
};

type ResultData = {
  eventTitle: string;
  position: number;
  points?: number;
  eventSlug: string;
};

/**
 * Generate email template based on notification type.
 */
export function getEmailTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  switch (notification.type) {
    case "REGISTRATION_CONFIRMED":
      return registrationConfirmedTemplate(notification);

    case "WAITLIST_PROMOTED":
      return waitlistPromotedTemplate(notification);

    case "EVENT_REMINDER_24H":
      return eventReminderTemplate(notification);

    case "EVENT_POSTED":
      return eventPostedTemplate(notification);

    case "RESULTS_POSTED":
      return resultsPostedTemplate(notification);

    case "CUSTOM":
    default:
      return customNotificationTemplate(notification);
  }
}

function registrationConfirmedTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  const event = notification.metadata as EventData | undefined;
  const eventDate = event?.startsAt
    ? format(new Date(event.startsAt), "EEEE, MMMM d 'at' h:mm a")
    : "";

  return baseTemplate({
    previewText: `You're registered for ${event?.title ?? "the event"}!`,
    title: "You're In!",
    body: `
      <p>Your registration has been confirmed!</p>
      ${event ? `<p><strong>${event.title}</strong></p>` : ""}
      ${eventDate ? `<p>${eventDate}</p>` : ""}
      <p>${notification.body}</p>
    `,
    actionUrl: notification.actionUrl,
    actionText: "View Event Details",
    footerText: "You're receiving this because you registered for an LSR event.",
  });
}

function waitlistPromotedTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  const event = notification.metadata as EventData | undefined;

  return baseTemplate({
    previewText: `A spot opened up for ${event?.title ?? "the event"}!`,
    title: "You've Been Promoted!",
    body: `
      <p>Great news! A spot has opened up and you've been moved from the waitlist.</p>
      ${event ? `<p><strong>${event.title}</strong></p>` : ""}
      <p>${notification.body}</p>
      <p style="color: #ff6b00; font-weight: bold;">You are now registered for this event.</p>
    `,
    actionUrl: notification.actionUrl,
    actionText: "View Event Details",
    footerText: "You were on the waitlist for this event and a spot became available.",
  });
}

function eventReminderTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  const event = notification.metadata as EventData | undefined;
  const eventDate = event?.startsAt
    ? format(new Date(event.startsAt), "EEEE, MMMM d 'at' h:mm a")
    : "";

  return baseTemplate({
    previewText: `Reminder: ${event?.title ?? "Event"} starts tomorrow!`,
    title: "Event Tomorrow!",
    body: `
      <p>This is a reminder that you're registered for an event starting in less than 24 hours.</p>
      ${event ? `<p><strong>${event.title}</strong></p>` : ""}
      ${eventDate ? `<p>${eventDate}</p>` : ""}
      <p>${notification.body}</p>
    `,
    actionUrl: notification.actionUrl,
    actionText: "View Event Details",
    footerText: "You opted in to receive event reminders.",
  });
}

function eventPostedTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  const event = notification.metadata as EventData | undefined;
  const eventDate = event?.startsAt
    ? format(new Date(event.startsAt), "EEEE, MMMM d 'at' h:mm a")
    : "";

  return baseTemplate({
    previewText: `New event: ${event?.title ?? "Check it out"}!`,
    title: "New Event Posted!",
    body: `
      <p>A new event has been published that might interest you.</p>
      ${event ? `<p><strong>${event.title}</strong></p>` : ""}
      ${eventDate ? `<p>${eventDate}</p>` : ""}
      <p>${notification.body}</p>
    `,
    actionUrl: notification.actionUrl,
    actionText: "View Event",
    footerText: "You opted in to receive notifications about new events.",
  });
}

function resultsPostedTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  const result = notification.metadata as ResultData | undefined;

  return baseTemplate({
    previewText: `Results are in for ${result?.eventTitle ?? "the race"}!`,
    title: "Results Posted!",
    body: `
      <p>The results for a recent event have been posted.</p>
      ${result?.eventTitle ? `<p><strong>${result.eventTitle}</strong></p>` : ""}
      ${
        result?.position
          ? `<p>Your finish: <strong style="color: #ff6b00;">P${result.position}</strong>${result.points ? ` (${result.points} points)` : ""}</p>`
          : ""
      }
      <p>${notification.body}</p>
    `,
    actionUrl: notification.actionUrl,
    actionText: "View Full Results",
    footerText: "You opted in to receive notifications when results are posted.",
  });
}

function customNotificationTemplate(
  notification: NotificationTemplateData
): { html: string; text: string } {
  return baseTemplate({
    previewText: notification.title,
    title: notification.title,
    body: `<p>${notification.body.replace(/\n/g, "</p><p>")}</p>`,
    actionUrl: notification.actionUrl,
    actionText: notification.actionUrl ? "Learn More" : undefined,
  });
}
