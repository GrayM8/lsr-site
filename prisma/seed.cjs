/* eslint-disable @typescript-eslint/no-require-imports */

// Use direct connection for seed to avoid PgBouncer prepared-statement issues
if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // ---- Roles ----
  await prisma.role.upsert({
    where: { key: "member" },
    update: {},
    create: { key: "member", description: "General member" },
  });
  await prisma.role.upsert({
    where: { key: "officer" },
    update: { description: "Officer" },
    create: { key: "officer", description: "Officer" },
  });
  await prisma.role.upsert({
    where: { key: "admin" },
    update: { description: "Site Admin" },
    create: { key: "admin", description: "Site Admin" },
  });

  // ---- Membership tiers ----
  await prisma.membershipTier.upsert({
    where: { key: "GENERAL" },
    update: {},
    create: { key: "GENERAL", label: "General (no dues paid)" },
  });
  await prisma.membershipTier.upsert({
    where: { key: "LSR_MEMBER" },
    update: {},
    create: { key: "LSR_MEMBER", label: "LSR Member (annual dues paid)" },
  });

  // ---- League: Lone Star Cup ----
  const loneStarCup = await prisma.league.upsert({
    where: { slug: "lone-star-cup" },
    update: {},
    create: {
      name: "Lone Star Cup",
      slug: "lone-star-cup",
      descriptionMd: "Flagship in-house league for LSR.",
      visibility: "public", // Prisma enum as string
    },
  });

  // ---- Products ----
  // Annual dues ($20): can't use upsert on (type, leagueId) with leagueId = null.
  const existingAnnual = await prisma.product.findFirst({
    where: { type: "ANNUAL_DUES", leagueId: null },
    select: { id: true },
  });
  if (existingAnnual) {
    await prisma.product.update({
      where: { id: existingAnnual.id },
      data: { name: "Annual LSR Dues", amountCents: 2000, currency: "USD", active: true },
    });
  } else {
    await prisma.product.create({
      data: {
        type: "ANNUAL_DUES",
        name: "Annual LSR Dues",
        amountCents: 2000,
        currency: "USD",
        active: true,
        leagueId: null,
      },
    });
  }

  // League fee ($20): safe to upsert because leagueId is non-null
  await prisma.product.upsert({
    where: { type_leagueId: { type: "LEAGUE_FEE", leagueId: loneStarCup.id } },
    update: { name: "Lone Star Cup Entry Fee", amountCents: 2000, currency: "USD", active: true },
    create: {
      type: "LEAGUE_FEE",
      name: "Lone Star Cup Entry Fee",
      amountCents: 2000,
      currency: "USD",
      active: true,
      league: { connect: { id: loneStarCup.id } },
    },
  });

  // ---- Optional initial Season ----
  await prisma.season.upsert({
    where: { slug: "lone-star-cup-2025" },
    update: {},
    create: {
      leagueId: loneStarCup.id,
      name: "Lone Star Cup 2025",
      slug: "lone-star-cup-2025",
      year: 2025,
      pointsRule: {
        places: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
        dnf: 0,
        dsq: 0,
      },
      visibility: "public",
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
