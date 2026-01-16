import { prisma } from "@/server/db";
import { DriversClient } from "./client";

export default async function DriversPage() {
  const drivers = await prisma.driverIdentity.findMany({
    orderBy: { lastSeenName: "asc" },
    include: { user: true },
  });

  return (
    <div className="container py-10 mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Driver Mappings</h1>
      </div>
      <DriversClient initialDrivers={drivers} />
    </div>
  );
}
