import { getSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db";
import { redirect } from "next/navigation";
import { CheckInView } from "@/components/events/check-in-view";

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await getSessionUser();
  const { id: eventId } = await params;

  if (!user) {
    // Redirect to signin with return URL
    redirect(`/auth/signin?next=/check-in/${eventId}`);
  }

  const event = await prisma.event.findUnique({
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

  if (!event) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white bg-zinc-950">
            Event not found
        </div>
    );
  }

  // Check if already checked in
  const existing = await prisma.eventAttendance.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } }
  });

  const now = new Date();
  let canCheckIn = true;
  let reason = "";

  if (existing) {
     // If already checked in, we pass this state. Logic in view handles it.
  } else {
      if (!event.attendanceEnabled) {
        canCheckIn = false;
        reason = "Check-in is not enabled for this event.";
      } else if (event.attendanceOpensAt && now < event.attendanceOpensAt) {
        canCheckIn = false;
        reason = `Check-in opens at ${event.attendanceOpensAt.toLocaleTimeString()}`;
      } else if (event.attendanceClosesAt && now > event.attendanceClosesAt) {
        canCheckIn = false;
        reason = "Check-in has closed.";
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <CheckInView 
        eventId={event.id} 
        eventSlug={event.slug}
        eventTitle={event.title}
        initialStatus={{
            canCheckIn,
            reason,
            alreadyCheckedIn: !!existing,
            checkedInAt: existing?.checkedInAt
        }} 
      />
    </div>
  );
}
