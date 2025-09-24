import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">New Event</h1>
      <EventForm />
    </main>
  );
}
