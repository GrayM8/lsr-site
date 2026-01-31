import { EventStatus } from "@prisma/client";

export function getEffectiveEventStatus(event: {
  status: EventStatus;
  startsAtUtc: Date;
  endsAtUtc: Date;
}): EventStatus {
  const { status, startsAtUtc, endsAtUtc } = event;
  const now = new Date();

  // DRAFT, PUBLISHED, CANCELLED, and POSTPONED are explicit states that ignore time.
  if (
    status === EventStatus.DRAFT ||
    status === EventStatus.PUBLISHED ||
    status === EventStatus.CANCELLED ||
    status === EventStatus.POSTPONED
  ) {
    return status;
  }

  // SCHEDULED, IN_PROGRESS, and COMPLETED are derived from time if not overridden.
  if (now < startsAtUtc) {
    return EventStatus.SCHEDULED;
  }
  if (now >= startsAtUtc && now <= endsAtUtc) {
    return EventStatus.IN_PROGRESS;
  }
  return EventStatus.COMPLETED;
}

export function isEventPublic(status: EventStatus): boolean {
  return status !== EventStatus.DRAFT;
}

export function isEventLive(event: {
  status: EventStatus;
  startsAtUtc: Date;
  endsAtUtc: Date;
}): boolean {
  const effectiveStatus = getEffectiveEventStatus(event);
  return effectiveStatus === EventStatus.IN_PROGRESS;
}
