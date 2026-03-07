import { getSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db";
import { redirect } from "next/navigation";
import { CheckInView } from "@/components/events/check-in-view";
import { DatabaseUnavailable } from "@/components/database-unavailable";

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;

  let user;
  try {
    ({ user } = await getSessionUser());
  } catch (error) {
    console.error('[CheckIn] Failed to load session:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-lsr-charcoal p-4">
        <DatabaseUnavailable title="Check-in Unavailable" message="We're experiencing issues. Please try again in a few minutes." />
      </div>
    );
  }

  if (!user) {
    redirect(`/auth/signin?next=/check-in/${eventId}`);
  }

  let event;
  try {
    event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      slug: true,
      attendanceEnabled: true,
      attendanceOpensAt: true,
      attendanceClosesAt: true,
    }
  });
  } catch (error) {
    console.error('[CheckIn] Failed to load event:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-lsr-charcoal p-4">
        <DatabaseUnavailable title="Check-in Unavailable" message="We're experiencing issues. Please try again in a few minutes." />
      </div>
    );
  }

  if (!event) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white bg-zinc-950">
            Event not found
        </div>
    );
  }

  let existing;
  try {
    existing = await prisma.eventAttendance.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } }
  });
  } catch {
    existing = null;
  }

  const now = new Date();
  let status: "OPEN" | "NOT_ENABLED" | "NOT_OPEN_YET" | "CLOSED" | "ALREADY_CHECKED_IN" = "OPEN";
  let opensAt: Date | null = null;

  if (existing) {
      status = "ALREADY_CHECKED_IN";
  } else if (!event.attendanceEnabled) {
      status = "NOT_ENABLED";
  } else if (event.attendanceOpensAt && now < event.attendanceOpensAt) {
      status = "NOT_OPEN_YET";
      opensAt = event.attendanceOpensAt;
  } else if (event.attendanceClosesAt && now > event.attendanceClosesAt) {
      status = "CLOSED";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lsr-charcoal p-4">
      <CheckInView 
        eventId={event.id} 
        eventSlug={event.slug}
        eventTitle={event.title}
        status={status}
        opensAt={opensAt?.toISOString()}
        checkedInAt={existing?.checkedInAt.toISOString()}
        currentUser={{
            displayName: user.displayName,
            handle: user.handle,
            avatarUrl: user.avatarUrl
        }}
      />
    </div>
  );
}