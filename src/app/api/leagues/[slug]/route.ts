// app/api/leagues/[slug]/route.ts
import { NextResponse } from 'next/server';
import { getLeagueBySlug, listSeasonsForLeague, listRoundsWithEvents } from '@/server/repos/league.repo';
import type { NodeHandler } from '@/server/next-types';

export const runtime = 'nodejs';

export const GET: NodeHandler<{ slug: string }> = async (request, { params }) => {
  const { slug } = await params;
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
};

