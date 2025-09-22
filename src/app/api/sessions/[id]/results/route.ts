// app/api/sessions/[id]/results/route.ts
import { NextResponse } from 'next/server';
import { listResultsForSession } from '@/server/repos/league.repo';
import { requireRole } from '@/server/auth/guards';
import { resultsUpdateRequestSchema } from '@/schemas/result.schema';
import { upsertResult } from '@/server/repos/import.repo';
import { ZodError } from 'zod';
import type { NodeHandler } from '@/server/next-types';

export const runtime = 'nodejs';

export const GET: NodeHandler<{ id: string }> = async (request, { params }) => {
  const { id } = await params;
  try {
    const results = await listResultsForSession(id);
    return NextResponse.json(results);
  } catch (error) {
    console.error(`Error fetching results for session ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const POST: NodeHandler<{ id: string }> = async (request, { params }) => {
  const { id } = await params;
  try {
    const actor = await requireRole(['admin', 'officer']);
    const body = await request.json();
    const resultsData = resultsUpdateRequestSchema.parse(body);

    const upsertPromises = resultsData.map((result) => {
      const { entryId, ...data } = result;
      return upsertResult(id, entryId, data, actor.id);
    });

    const results = await Promise.all(upsertPromises);

    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof Error && (error.name === 'NotAuthenticatedError' || error.name === 'NotAuthorizedError')) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Invalid request body', issues: error.issues }, { status: 400 });
    }
    console.error(`Error upserting results for session ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

