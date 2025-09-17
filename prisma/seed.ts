import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- Config ------------------------------------------------------------------

// Core roles you want in every environment (idempotent upserts)
const CORE_ROLES = [
  { code: 'member',      name: 'Member' },
  { code: 'competition', name: 'Competition Team' },
  { code: 'officer',     name: 'Officer' },
  { code: 'president',   name: 'President' },
  { code: 'alumni',      name: 'Alumni' },
  { code: 'admin',       name: 'Admin' },
] as const

// Set SEED_DEMO_EVENT=true to create a sample event if possible
const DO_DEMO_EVENT = process.env.SEED_DEMO_EVENT === 'true'

// --- Helpers -----------------------------------------------------------------

async function tableExists(schema: string, table: string) {
  const rows = await prisma.$queryRaw<
    Array<{ exists: boolean }>
  >`SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = ${schema} AND table_name = ${table}
     ) AS "exists"`
  return rows[0]?.exists === true
}

async function upsertCoreRoles() {
  for (const r of CORE_ROLES) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: { code: r.code, name: r.name },
    })
  }
  console.log('✅ Seeded core roles.')
}

async function seedDemoEventIfPossible() {
  if (!DO_DEMO_EVENT) return

  // Need at least one officer to be host/creator
  const officerRole = await prisma.role.findUnique({ where: { code: 'officer' } })
  const competitionRole = await prisma.role.findUnique({ where: { code: 'competition' } })
  if (!officerRole || !competitionRole) {
    console.log('ℹ️  Skipping demo event (roles missing).')
    return
  }

  // Find any profile with officer role
  const officerProfileRole = await prisma.profileRole.findFirst({
    where: { roleId: officerRole.id },
  })

  if (!officerProfileRole) {
    console.log('ℹ️  Skipping demo event (no officer profiles yet).')
    return
  }

  const host = await prisma.profile.findUnique({ where: { id: officerProfileRole.profileId } })
  if (!host) {
    console.log('ℹ️  Skipping demo event (host profile missing).')
    return
  }

  // Create a venue
  const venue = await prisma.venue.create({
    data: {
      name: 'EER Atrium',
      addressLine1: '2501 Speedway',
      city: 'Austin',
      state: 'TX',
      postalCode: '78712',
      country: 'US',
      room: 'Atrium',
    },
  })

  // Create the event (publicly visible, RSVP restricted to competition + dues)
  const starts = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // in 3 days
  const ends = new Date(starts.getTime() + 1000 * 60 * 90)      // 90 minutes later
  const event = await prisma.event.create({
    data: {
      slug: `demo-practice-${Math.random().toString(36).slice(2, 7)}`,
      title: 'Demo: Competition Team Practice',
      summary: 'Hands-on sim session (restricted to competition, dues required).',
      description: 'Bring your gear. We will review vehicle setup and run practice heats.',
      startsAtUtc: starts, // store UTC in app; render using timezone below
      endsAtUtc: ends,
      timezone: 'America/Chicago',
      status: 'scheduled',
      rsvpRequired: true,
      rsvpOpenAt: new Date(Date.now() + 1000 * 60 * 60 * 4), // open in 4h
      rsvpCloseAt: new Date(starts.getTime() - 1000 * 60 * 60), // 1h before
      capacity: 12,
      waitlistEnabled: true,
      venueId: venue.id,
      createdByProfileId: host.id,
      hostProfileId: host.id,
      requiresDuesPaid: true,
      accessRoles: {
        create: [{ roleId: competitionRole.id }],
      },
    },
  })

  // Generate invites: all dues-paid competition members
  const competitionMembers = await prisma.profileRole.findMany({
    where: { roleId: competitionRole.id },
    select: { profileId: true },
  })

  if (competitionMembers.length) {
    const eligibleProfiles = await prisma.profile.findMany({
      where: {
        id: { in: competitionMembers.map((p) => p.profileId) },
        duesPaid: true,
      },
      select: { id: true },
    })

    if (eligibleProfiles.length) {
      await prisma.$transaction(
        eligibleProfiles.map((p) =>
          prisma.eventInvite.upsert({
            where: { eventId_profileId: { eventId: event.id, profileId: p.id } },
            update: {},
            create: { eventId: event.id, profileId: p.id },
          }),
        ),
      )
      console.log(`✅ Created ${eligibleProfiles.length} invites for demo event "${event.title}".`)
    } else {
      console.log('ℹ️  No dues-paid competition members found to invite.')
    }
  } else {
    console.log('ℹ️  No competition members found; no invites created.')
  }

  console.log(`✅ Seeded demo event at venue "${venue.name}".`)
}

// --- Main --------------------------------------------------------------------

async function main() {
  // Preflight: ensure migrations ran (Role table exists)
  const hasRole = await tableExists('public', 'Role')
  if (!hasRole) {
    throw new Error(
      'Table "public.Role" not found. Run your migrations first: `npx prisma migrate dev` (or `deploy`).',
    )
  }

  await upsertCoreRoles()
  await seedDemoEventIfPossible()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
