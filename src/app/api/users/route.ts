// src/app/api/users/route.ts
import { prisma } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, email, handle, displayName, eid, gradYear, marketingOptIn } = await request.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        handle,
        displayName,
        eid,
        gradYear,
        marketingOptIn,
        status: 'pending_verification', // Initially unverified
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
