import { prisma } from "../src/server/db";

async function main() {
  const userId = process.argv[2];
  const roleKey = process.argv[3];

  if (!userId || !roleKey) {
    console.error("Usage: tsx scripts/set-role.ts <userId> <roleKey>");
    console.error("Example: tsx scripts/set-role.ts 1234-5678 admin");
    process.exit(1);
  }

  const role = await prisma.role.findUnique({
    where: { key: roleKey },
  });

  if (!role) {
    console.error(`Role with key "${roleKey}" not found. Available roles: admin, officer, member`);
    process.exit(1);
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    console.error(`User with ID "${userId}" not found.`);
    process.exit(1);
  }

  await prisma.userRole.create({
    data: {
      userId,
      roleId: role.id,
    },
  });

  console.log(`✅ Role "${roleKey}" added to user ${user.displayName} (${userId})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });