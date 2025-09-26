import { VenueForm } from "@/components/admin/venue-form";

export default function NewVenuePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">New Venue</h1>
      <VenueForm />
    </main>
  );
}
