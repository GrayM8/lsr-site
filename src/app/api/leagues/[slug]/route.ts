// app/api/leagues/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLeagueBySlug, listSeasonsForLeague, listRoundsWithEvents } from '@/server/repos/league.repo';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } },
) {
  const { slug } = context.params;
  try {
    const league = await getLeagueBySlug(slug);
    if (!league) {
      return NextResponse.json({ message: 'League not found' }, { status: 404 });
    }

    const seasons = await listSeasonsForLeague(league.id);
    const currentSeason = seasons[0]; // Assume latest is current
    
    let rounds: Awaited<ReturnType<typeof listRoundsWithEvents>> = [];
    if (currentSeason) {
      rounds = await listRoundsWithEvents(currentSeason.id);
    }

    return NextResponse.json({
      league,
      seasons,
      currentSeason,
      upcomingRounds: rounds.filter(r => r.event && r.event.startsAtUtc > new Date()),
    });
  } catch (error) {
    console.error(`Error fetching league ${slug}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
