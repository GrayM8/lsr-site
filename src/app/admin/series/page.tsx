import { getAllSeries } from "@/server/queries/series";
import { SeriesConsole } from "@/components/admin/series-console";

export default async function SeriesAdminPage() {
  const series = await getAllSeries();

  return (
    <div className="h-full">
      <SeriesConsole initialSeries={series} />
    </div>
  );
}