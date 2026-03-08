import { getAllSeries } from "@/server/queries/series";
import { SeasonForm } from "../form";

export default async function NewSeasonPage() {
  const series = await getAllSeries();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Season</h1>
      <SeasonForm seriesList={series} />
    </main>
  );
}
