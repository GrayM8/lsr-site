import { prisma } from "@/server/db";
import { CarsClient } from "./client";
import { getUnmappedCarNames } from "./actions";

export default async function CarsPage() {
  const [mappedCars, unmappedCarNames] = await Promise.all([
    prisma.carMapping.findMany({
      orderBy: { gameCarName: "asc" },
    }),
    getUnmappedCarNames(),
  ]);

  return (
    <div className="container py-10 mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Car Mappings</h1>
      </div>
      <CarsClient mappedCars={mappedCars} unmappedCarNames={unmappedCarNames} />
    </div>
  );
}
