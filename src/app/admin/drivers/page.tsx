import { prisma } from "@/server/db";
import { DriversConsole } from "@/components/admin/drivers-console";

export default async function DriversPage() {
  const drivers = await prisma.driverIdentity.findMany({
    orderBy: { lastSeenName: "asc" },
    include: { user: true },
  });

  return (
    <div className="h-full">
      <DriversConsole initialDrivers={drivers} />
    </div>
  );
}