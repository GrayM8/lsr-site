import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { getEventAttendanceState } from "@/server/services/attendance.service";
import { RegistrationConfigForm } from "@/components/admin/registration-config-form";
import { RegistrationManager } from "@/components/admin/registration-manager";
import { AttendanceConfigForm } from "@/components/admin/attendance-config-form";
import { AttendanceManager } from "@/components/admin/attendance-manager";
import { generateQrCodeDataUrl } from "@/lib/qr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LiveTailButton } from "@/components/admin/live-tail-button";

export default async function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Event & Registration Data (Combined logic or separate)
  // We can use getEventAttendanceState for attendance stuff.
  // RegistrationManager needs "registrations".
  
  const [attendanceState, allUsers] = await Promise.all([
    getEventAttendanceState(id).catch(() => null),
    prisma.user.findMany({
        select: { id: true, displayName: true, handle: true },
        orderBy: { displayName: 'asc' }
    })
  ]);

  if (!attendanceState) return notFound();

  const { event, lists } = attendanceState;

  // 2. Prepare QR
  // Determine Check-in URL. Ideally from ENV or request headers, but usually relative in Next.js needs absolute for QR.
  // We'll use NEXT_PUBLIC_SITE_URL or vercel url or fallback.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) 
      || "http://localhost:3000";
  const checkInUrl = `${baseUrl}/check-in/${event.id}`;
  const qrDataUrl = await generateQrCodeDataUrl(checkInUrl);

  // 3. Prepare Registrations for RegistrationManager
  // It expects "RegistrationWithUser".
  // getEventAttendanceState uses "REGISTERED" status for stats, but RegistrationManager needs ALL (waitlisted etc).
  // So we might need to fetch all registrations separately or modify getEventAttendanceState.
  // Let's fetch all registrations here to be safe and compatible with RegistrationManager.
  const allRegistrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
  });

  return (
    <main className="mx-auto max-w-6xl p-8 pb-32">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold">Manage: {event.title}</h1>
            <p className="text-muted-foreground">{event.slug}</p>
        </div>
        <div className="flex gap-2">
            <LiveTailButton />
            <Button asChild variant="outline">
                <Link href="/admin/events">Back to Events</Link>
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                      <AttendanceManager 
                          eventId={event.id}
                          eventTitle={event.title}
                          checkInUrl={checkInUrl}
                          qrDataUrl={qrDataUrl}
                          checkedIn={lists.checkedIn}
                          missing={lists.missing}
                          walkIns={lists.walkIns}
                          allUsers={allUsers}
                      />
                  </div>
                  <div>
                      <AttendanceConfigForm event={event} checkInCount={lists.checkedIn.length} />
                  </div>
              </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                       <RegistrationManager eventId={event.id} registrations={allRegistrations} />
                  </div>
                  <div>
                      <RegistrationConfigForm event={event} />
                  </div>
               </div>
          </TabsContent>
      </Tabs>
    </main>
  );
}
