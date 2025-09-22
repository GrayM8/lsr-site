// app/api/events/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug } from '@/server/repos/event.repo';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  const { slug } = context.params;
  try {
    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    // TODO: Add eligibility summary for the current user
    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event ${slug}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
