/*
  Warnings:

  - You are about to drop the column `capacity` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `rsvpCloseAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `rsvpOpenAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `rsvpRequired` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `waitlistEnabled` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `RSVP` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('REGISTERED', 'WAITLISTED', 'NOT_ATTENDING');

-- AlterEnum
ALTER TYPE "public"."AuditAction" ADD VALUE 'registration_change';

-- DropForeignKey
ALTER TABLE "public"."RSVP" DROP CONSTRAINT "RSVP_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RSVP" DROP CONSTRAINT "RSVP_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "capacity",
DROP COLUMN "rsvpCloseAt",
DROP COLUMN "rsvpOpenAt",
DROP COLUMN "rsvpRequired",
DROP COLUMN "waitlistEnabled",
ADD COLUMN     "registrationClosesAt" TIMESTAMP(3),
ADD COLUMN     "registrationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationMax" INTEGER,
ADD COLUMN     "registrationOpensAt" TIMESTAMP(3),
ADD COLUMN     "registrationWaitlistEnabled" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."RSVP";

-- DropEnum
DROP TYPE "public"."RSVPStatus";

-- CreateTable
CREATE TABLE "public"."EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."RegistrationStatus" NOT NULL,
    "waitlistOrder" INTEGER,
    "promotedAt" TIMESTAMP(3),
    "promotionSource" TEXT,
    "statusReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_status_idx" ON "public"."EventRegistration"("eventId", "status");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_status_waitlistOrder_idx" ON "public"."EventRegistration"("eventId", "status", "waitlistOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "public"."EventRegistration"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
