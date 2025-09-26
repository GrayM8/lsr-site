import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllEventsForAdmin } from "@/server/queries/events";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { deleteEvent } from "@/app/admin/events/actions";

export default async function EventsAdminPage() {
  const events = await getAllEventsForAdmin();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">New Event</Link>
        </Button>
      </div>
      <div className="border rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Title</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.startsAtUtc.toLocaleString()}</td>
                <td className="p-4">{event.status}</td>
                <td className="p-4 space-x-2">
                  {event.status === "draft" ? (
                    <>
                      <Button size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/publish`}>Publish</Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" asChild>
                      <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
                    </Button>
                  )}
                  <form action={deleteEvent.bind(null, event.id)} className="inline-block">
                    <ConfirmSubmitButton
                      size="sm"
                      variant="destructive"
                      message="Are you sure you want to delete this event?"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
