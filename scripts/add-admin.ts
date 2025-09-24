import { prisma } from "../src/server/db";

async function main() {
  const userId = process.argv[2];

  if (!userId) {
    console.error("Please provide a user ID.");
    process.exit(1);
  }

  const adminRole = await prisma.role.findUnique({
    where: { key: "admin" },
  });

  if (!adminRole) {
    console.error("Admin role not found.");
    process.exit(1);
  }

  await prisma.userRole.create({
    data: {
      userId,
      roleId: adminRole.id,
    },
  });

  console.log(`Admin role added to user ${userId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
