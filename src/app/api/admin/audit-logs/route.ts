import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { requireAdmin } from "@/lib/authz";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
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

  if (actionType) where.actionType = actionType;
  if (entityType) where.entityType = entityType;
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
