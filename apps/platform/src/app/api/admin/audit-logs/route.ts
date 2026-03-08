import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireOfficer } from "@/server/auth/guards";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireOfficer();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const actionType = searchParams.get("actionType");
  const entityType = searchParams.get("entityType");
  const actorUserId = searchParams.get("actorUserId");
  const search = searchParams.get("search");

  const where: Prisma.AuditLogWhereInput = {};

  if (actionType) {
    where.actionType = { equals: actionType, mode: "insensitive" };
  }
  if (entityType) {
    where.entityType = { equals: entityType, mode: "insensitive" };
  }
  if (actorUserId) where.actorUserId = actorUserId;
  if (search) {
    where.summary = { contains: search, mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        actor: {
          select: {
            id: true,
            displayName: true,
            handle: true,
            avatarUrl: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            displayName: true,
            handle: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
