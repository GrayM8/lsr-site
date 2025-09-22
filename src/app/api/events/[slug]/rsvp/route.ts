// app/api/events/[slug]/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/server/auth/guards';
import { getEventBySlug, rsvp } from '@/server/repos/event.repo';
import { rsvpRequestSchema } from '@/schemas/event.schema';
import { ZodError } from 'zod';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  const { slug } = context.params;
  try {
    const user = await requireUser();
    const body = await request.json();
    const payload = rsvpRequestSchema.parse(body);

    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const result = await rsvp(event.id, user.id, payload.status);

    if (result.ok) {
      return NextResponse.json(result.rsvp);
    } else {
      const errorResult = result as { ok: false; reason: string };
      return NextResponse.json({ message: `RSVP failed: ${errorResult.reason}` }, { status: 403 });
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'NotAuthenticatedError') {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ message: 'Invalid request body', issues: (error as ZodError).issues }, { status: 400 });
    }
    console.error(`Error RSVPing for event ${slug}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
