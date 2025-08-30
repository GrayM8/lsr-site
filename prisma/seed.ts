import { PrismaClient, SponsorTier } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // Drivers
  await prisma.driver.upsert({
    where: { handle: "gray" },
    update: {},
    create: {
      fullName: "Gray Marshall",
      handle: "gray",
      instagram: "https://instagram.com/gray",
      iRating: 2100,
      totalWins: 5,
    },
  })
  await prisma.driver.upsert({
    where: { handle: "alex" },
    update: {},
    create: {
      fullName: "Alex Rivera",
      handle: "alex",
      iRating: 1850,
      totalWins: 2,
    },
  })

  // Sponsors
  await prisma.sponsor.upsert({
    where: { name: "MoTeC" },
    update: {},
    create: { name: "MoTeC", url: "https://www.motec.com/", tier: SponsorTier.gold },
  })
  await prisma.sponsor.upsert({
    where: { name: "SimHub" },
    update: {},
    create: { name: "SimHub", url: "https://www.simhubdash.com/", tier: SponsorTier.silver },
  })

  // Events
  await prisma.event.create({
    data: {
      title: "Fall Kickoff & Hotlap Night",
      startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "GDC Lab, UT Austin",
      description: "Welcome back! Hotlap challenge on Suzuka/GR86.",
      externalUrl: "https://discord.gg/yourInvite",
    },
  })
}

main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
