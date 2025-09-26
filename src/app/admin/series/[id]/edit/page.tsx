import { notFound } from "next/navigation";
import { SeriesForm } from "@/components/admin/series-form";
import { getSeries } from "@/server/queries/series";

export default async function EditSeriesPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const series = await getSeries(id);

  if (!series) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event Series</h1>
      <SeriesForm series={series} />
    </main>
  );
}
