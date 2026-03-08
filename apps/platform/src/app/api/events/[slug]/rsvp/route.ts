import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Obsolete. Use registration endpoint." }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ message: "Obsolete. Use registration endpoint." }, { status: 410 });
}