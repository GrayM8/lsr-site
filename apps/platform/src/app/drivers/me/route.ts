// src/app/drivers/me/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  // Redirect to a mock driver page.
  return NextResponse.redirect(`${origin}/drivers/mockuser`);
}