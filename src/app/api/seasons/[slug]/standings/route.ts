// app/api/seasons/[slug]/standings/route.ts
import { NextResponse } from 'next/server';
import { getSeasonBySlug } from '@/server/repos/league.repo';
import { getStandingsForSeason } from '@/server/repos/standings.repo';
import type { NodeHandler } from '@/server/next-types';

export const runtime = 'nodejs';

export const GET: NodeHandler<{ slug: string }> = async (request, { params }) => {
  const { slug } = await params;
  try {
    const season = await getSeasonBySlug(slug);
    if (!season) {
      return NextResponse.json({ message: 'Season not found' }, { status: 404 });
    }

    const standings = await getStandingsForSeason(season.id);

    // Group standings by class
    const standingsByClass = standings.reduce(
      (acc, standing) => {
        if (!acc[standing.className]) {
          acc[standing.className] = [];
        }
        acc[standing.className].push(standing);
        return acc;
      },
      {} as Record<string, typeof standings>,
    );

    return NextResponse.json(standingsByClass);
  } catch (error) {
    console.error(`Error fetching standings for season ${slug}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

