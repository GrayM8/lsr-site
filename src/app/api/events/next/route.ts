// app/api/events/next/route.ts
import { NextResponse } from 'next/server';
import { listUpcomingEvents } from '@/server/repos/event.repo';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const events = await listUpcomingEvents(10);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
