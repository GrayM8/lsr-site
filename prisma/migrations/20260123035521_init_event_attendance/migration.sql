/*
  Manual Fix for Attendance Migration
*/

-- 1. Drop old table and foreign keys
DROP TABLE IF EXISTS "public"."Attendance" CASCADE;

-- 2. Handle Enum Change (Drop old, create new)
-- Note: We use CASCADE to drop columns using this enum if any were missed, 
-- but we just dropped the only table using it.
DROP TYPE IF EXISTS "public"."CheckinMethod" CASCADE;
CREATE TYPE "public"."CheckinMethod" AS ENUM ('QR', 'MANUAL');

-- 3. Create new Enum
CREATE TYPE "public"."AttendanceReportingMode" AS ENUM ('ASSUME_REGISTERED', 'CHECKIN_REQUIRED');

-- 4. Alter Event Table
ALTER TABLE "public"."Event" ADD COLUMN     "attendanceClosesAt" TIMESTAMP(3),
ADD COLUMN     "attendanceEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "attendanceOpensAt" TIMESTAMP(3),
ADD COLUMN     "attendanceReportingMode" "public"."AttendanceReportingMode" NOT NULL DEFAULT 'ASSUME_REGISTERED';

-- 5. Create new EventAttendance Table
CREATE TABLE "public"."EventAttendance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "public"."CheckinMethod" NOT NULL,
    "checkedInByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id")
);

-- 6. Create Indexes
CREATE INDEX "EventAttendance_eventId_checkedInAt_idx" ON "public"."EventAttendance"("eventId", "checkedInAt");
CREATE INDEX "EventAttendance_eventId_userId_idx" ON "public"."EventAttendance"("eventId", "userId");
CREATE UNIQUE INDEX "EventAttendance_eventId_userId_key" ON "public"."EventAttendance"("eventId", "userId");

-- 7. Add Constraints
ALTER TABLE "public"."EventAttendance" ADD CONSTRAINT "EventAttendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."EventAttendance" ADD CONSTRAINT "EventAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."EventAttendance" ADD CONSTRAINT "EventAttendance_checkedInByUserId_fkey" FOREIGN KEY ("checkedInByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
