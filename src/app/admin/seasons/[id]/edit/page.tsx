import { getAllSeries } from "@/server/queries/series";
import { getSeasonById } from "@/server/queries/seasons";
import { SeasonForm } from "../../form";
import { notFound } from "next/navigation";

export default async function EditSeasonPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;
  const [season, series] = await Promise.all([
    getSeasonById(awaitedParams.id),
    getAllSeries(),
  ]);

  if (!season) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Season</h1>
      <SeasonForm initialData={season} seriesList={series} />
    </main>
  );
}
