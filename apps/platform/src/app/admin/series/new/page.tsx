import { SeriesForm } from "@/components/admin/series-form";

export default function NewSeriesPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">New Event Series</h1>
      <SeriesForm />
    </main>
  );
}
