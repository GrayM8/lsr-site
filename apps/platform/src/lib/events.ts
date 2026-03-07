import { EventStatus } from "@prisma/client";

export function getEffectiveEventStatus(event: {
  status: EventStatus;
  startsAtUtc: Date;
  endsAtUtc: Date;
  publishedAt?: Date | null;
}): EventStatus {
  const { status, startsAtUtc, endsAtUtc, publishedAt } = event;
  const now = new Date();

  // 1. Handle overrides / static states
  if (status === EventStatus.DRAFT) return EventStatus.DRAFT;
  if (status === EventStatus.CANCELLED) return EventStatus.CANCELLED;
  if (status === EventStatus.POSTPONED) return EventStatus.POSTPONED;

  // 2. Handle "Scheduled to Publish"
  // If status is SCHEDULED, it is effectively DRAFT (hidden) unless publishedAt has passed.
  if (status === EventStatus.SCHEDULED) {
    if (publishedAt && now >= publishedAt) {
      // It has auto-published! Fall through to PUBLISHED logic.
    } else {
      return EventStatus.SCHEDULED; // Still hidden/pending
    }
  }

  // 3. Handle PUBLISHED (or auto-published SCHEDULED)
  // This state derives "Live" or "Completed" based on event timing.
  if (status === EventStatus.PUBLISHED || (status === EventStatus.SCHEDULED && publishedAt && now >= publishedAt)) {
    if (now > endsAtUtc) {
      return EventStatus.COMPLETED;
    }
    if (now >= startsAtUtc && now <= endsAtUtc) {
      return EventStatus.IN_PROGRESS;
    }
    return EventStatus.PUBLISHED; // Upcoming
  }

  // Fallback for explicit legacy states if they exist in DB
  return status;
}

export function isEventPublic(event: { status: EventStatus; publishedAt?: Date | null }): boolean {
  if (event.status === EventStatus.DRAFT) return false;
  if (event.status === EventStatus.SCHEDULED) {
    // Only public if the scheduled publish time has passed
    return !!(event.publishedAt && new Date() >= event.publishedAt);
  }
  return true; // PUBLISHED, CANCELLED, POSTPONED (and legacy states) are public
}

export function isEventLive(event: {
  status: EventStatus;
  startsAtUtc: Date;
  endsAtUtc: Date;
  publishedAt?: Date | null;
}): boolean {
  const effectiveStatus = getEffectiveEventStatus(event);
  return effectiveStatus === EventStatus.IN_PROGRESS;
}
