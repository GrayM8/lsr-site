import { prisma } from "@/lib/prisma"

const ROLES = [
  { code: "member",      name: "Member" },
  { code: "competition", name: "Competition Team" },
  { code: "officer",     name: "Officer" },
  { code: "president",   name: "President" },
  { code: "alumni",      name: "Alumni" },
  { code: "admin",       name: "Admin" },
] as const

async function main() {
  for (const r of ROLES) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: r,
    })
  }
  console.log("Seeded roles.")
}

main().finally(async () => prisma.$disconnect())
