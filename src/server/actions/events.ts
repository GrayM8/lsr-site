'use server';

import { prisma } from '@/server/db';
import { rsvp } from '@/server/repos/event.repo';
import { requireUser } from '@/server/auth/guards';
import { RSVPStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function actionRsvp(eventId: string, desiredStatus: RSVPStatus) {
  try {
    const user = await requireUser();
    const result = await rsvp(eventId, user.id, desiredStatus);

    if (result.ok) {
      // Revalidate the event page to show the updated RSVP status
      const event = await prisma.event.findUnique({ where: { id: eventId }, select: { slug: true } });
      if (event) {
        revalidatePath(`/events/${event.slug}`);
      }
      return { success: true, data: result.rsvp };
    } else {
      const errorResult = result as { ok: false; reason: string };
      return { success: false, error: errorResult.reason };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
