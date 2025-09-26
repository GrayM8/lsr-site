// src/server/repos/event.repo.ts
import { prisma } from '@/server/db';
import { getActiveEntitlements } from './membership.repo';
import { getSessionUser } from '@/server/auth/session';
import { EventEligibility, Prisma, RSVPStatus, CheckinMethod, EventType } from '@prisma/client';
import { logAudit } from '@/server/audit/log';

export async function listUpcomingEvents(limit = 10) {
  return prisma.event.findMany({
    where: {
      startsAtUtc: { gte: new Date() },
    },
    orderBy: { startsAtUtc: 'asc' },
    take: limit,
    include: {
      venue: true,
      series: true,
    },
  });
}

export async function listAllEvents() {
  return prisma.event.findMany({
    where: {
      status: { not: "draft" },
    },
    orderBy: { startsAtUtc: 'asc' },
    include: {
      venue: true,
      series: true,
    },
  });
}

export async function listAllEventsForAdmin() {
  return prisma.event.findMany({
    orderBy: { startsAtUtc: 'asc' },
    include: {
      venue: true,
      series: true,
    },
  });
}

export async function getAllEventTypes() {
  return Object.values(EventType);
}

export async function getAllEventSeries() {
  return prisma.eventSeries.findMany({
    orderBy: { title: 'asc' },
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      eligibility: true,
      rsvps: {
        include: {
          user: {
            select: { id: true, displayName: true, avatarUrl: true },
          },
        },
      },
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
  });
}

export async function createEvent(data: Prisma.EventCreateInput, actorId: string) {
  const event = await prisma.event.create({ data });
  await logAudit({
    actorUserId: actorId,
    action: 'create',
    entityType: 'Event',
    entityId: event.id,
    diffJson: JSON.stringify(data),
  });
  return event;
}

export async function updateEvent(id: string, data: Prisma.EventUpdateInput, actorId: string) {
  const event = await prisma.event.update({ where: { id }, data });
  await logAudit({
    actorUserId: actorId,
    action: 'update',
    entityType: 'Event',
    entityId: event.id,
    diffJson: JSON.stringify(data),
  });
  return event;
}

type EligibilityResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'NEEDS_LSR' | 'NEEDS_LEAGUE' | 'ROLE_TOO_LOW' | 'GENERAL_NOT_ALLOWED';
    };

export async function checkEligibility(
  eligibility: EventEligibility,
  userId: string,
): Promise<EligibilityResult> {
  const { user, roles } = await getSessionUser();
  if (!user) {
    return { ok: false, reason: 'GENERAL_NOT_ALLOWED' }; // Should be caught by requireUser earlier
  }

  if (eligibility.minRoleId) {
    const minRole = await prisma.role.findUnique({ where: { id: eligibility.minRoleId } });
    if (minRole && !roles.includes(minRole.key)) {
      return { ok: false, reason: 'ROLE_TOO_LOW' };
    }
  }

  const entitlements = await getActiveEntitlements(userId);
  const hasLsrMembership = entitlements.some((e) => e.kind === 'lsr_member');
  const hasLeagueAccess = (leagueId: string) =>
    entitlements.some((e) => e.kind === 'league_access' && e.leagueId === leagueId);

  let isEligible = false;
  if (eligibility.requiresLsrMember) {
    if (!hasLsrMembership) return { ok: false, reason: 'NEEDS_LSR' };
    isEligible = true;
  }

  if (eligibility.requiresLeagueId) {
    if (!hasLeagueAccess(eligibility.requiresLeagueId)) {
      return { ok: false, reason: 'NEEDS_LEAGUE' };
    }
    isEligible = true;
  }

  if (eligibility.allowsGeneral) {
    isEligible = true;
  }

  if (!isEligible) {
    return { ok: false, reason: 'GENERAL_NOT_ALLOWED' };
  }

  return { ok: true };
}

export async function rsvp(eventId: string, userId: string, status: RSVPStatus) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { eligibility: true },
  });

  if (!event || !event.eligibility) {
    throw new Error('Event not found or eligibility not configured.');
  }

  const eligibilityResult = await checkEligibility(event.eligibility, userId);
  if (!eligibilityResult.ok) {
    return eligibilityResult;
  }

  const rsvp = await prisma.rSVP.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
    update: { status },
    create: {
      eventId,
      userId,
      status,
    },
  });

  await logAudit({
    actorUserId: userId,
    action: 'rsvp',
    entityType: 'RSVP',
    entityId: rsvp.id,
    metaJson: JSON.stringify({ eventId, status }),
  });

  return { ok: true, rsvp };
}

export async function checkIn(eventId: string, userId: string, method: string, actorId: string) {
  const attendance = await prisma.attendance.create({
    data: {
      eventId,
      userId,
      method: method as CheckinMethod,
    },
  });

  await logAudit({
    actorUserId: actorId,
    action: 'checkin',
    entityType: 'Attendance',
    entityId: attendance.id,
    metaJson: JSON.stringify({ eventId, userId, method }),
  });
  return attendance;
}
