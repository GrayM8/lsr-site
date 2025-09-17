-- CreateEnum
CREATE TYPE "public"."ProfileStatus" AS ENUM ('active', 'retired', 'deleted');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('draft', 'scheduled', 'in_progress', 'canceled', 'postponed', 'completed');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('yes', 'waitlist', 'no', 'canceled');

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileRole" (
    "profileId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "ProfileRole_pkey" PRIMARY KEY ("profileId","roleId")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "iRating" INTEGER,
    "socials" JSONB,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."ProfileStatus" NOT NULL DEFAULT 'active',
    "duesPaid" BOOLEAN NOT NULL DEFAULT false,
    "duesPaidAt" TIMESTAMP(3),
    "major" TEXT,
    "eid" TEXT,
    "gradYear" INTEGER,
    "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "room" TEXT,
    "geo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "startsAtUtc" TIMESTAMP(3) NOT NULL,
    "endsAtUtc" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'draft',
    "rsvpRequired" BOOLEAN NOT NULL DEFAULT false,
    "rsvpOpenAt" TIMESTAMP(3),
    "rsvpCloseAt" TIMESTAMP(3),
    "capacity" INTEGER,
    "waitlistEnabled" BOOLEAN NOT NULL DEFAULT true,
    "venueId" TEXT,
    "meetingUrl" TEXT,
    "streamUrl" TEXT,
    "dialIn" TEXT,
    "accessInstructions" TEXT,
    "createdByProfileId" TEXT NOT NULL,
    "hostProfileId" TEXT NOT NULL,
    "requiresDuesPaid" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "embargoUntil" TIMESTAMP(3),
    "updatedByProfileId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAccessRole" (
    "eventId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "EventAccessRole_pkey" PRIMARY KEY ("eventId","roleId")
);

-- CreateTable
CREATE TABLE "public"."EventInvite" (
    "eventId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "EventInvite_pkey" PRIMARY KEY ("eventId","profileId")
);

-- CreateTable
CREATE TABLE "public"."EventRSVP" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" "public"."RSVPStatus" NOT NULL,
    "waitlistPos" INTEGER,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventCheckin" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,

    CONSTRAINT "EventCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "public"."Role"("code");

-- CreateIndex
CREATE INDEX "ProfileRole_roleId_idx" ON "public"."ProfileRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "public"."Profile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_eid_key" ON "public"."Profile"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "public"."Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startsAtUtc_idx" ON "public"."Event"("status", "startsAtUtc");

-- CreateIndex
CREATE INDEX "Event_startsAtUtc_idx" ON "public"."Event"("startsAtUtc");

-- CreateIndex
CREATE INDEX "EventAccessRole_roleId_idx" ON "public"."EventAccessRole"("roleId");

-- CreateIndex
CREATE INDEX "EventInvite_profileId_idx" ON "public"."EventInvite"("profileId");

-- CreateIndex
CREATE INDEX "EventRSVP_eventId_status_respondedAt_idx" ON "public"."EventRSVP"("eventId", "status", "respondedAt");

-- CreateIndex
CREATE INDEX "EventRSVP_eventId_waitlistPos_idx" ON "public"."EventRSVP"("eventId", "waitlistPos");

-- CreateIndex
CREATE UNIQUE INDEX "EventRSVP_eventId_profileId_key" ON "public"."EventRSVP"("eventId", "profileId");

-- CreateIndex
CREATE INDEX "EventCheckin_eventId_idx" ON "public"."EventCheckin"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCheckin_eventId_profileId_key" ON "public"."EventCheckin"("eventId", "profileId");

-- AddForeignKey
ALTER TABLE "public"."ProfileRole" ADD CONSTRAINT "ProfileRole_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileRole" ADD CONSTRAINT "ProfileRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdByProfileId_fkey" FOREIGN KEY ("createdByProfileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_hostProfileId_fkey" FOREIGN KEY ("hostProfileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAccessRole" ADD CONSTRAINT "EventAccessRole_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAccessRole" ADD CONSTRAINT "EventAccessRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventInvite" ADD CONSTRAINT "EventInvite_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventInvite" ADD CONSTRAINT "EventInvite_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRSVP" ADD CONSTRAINT "EventRSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRSVP" ADD CONSTRAINT "EventRSVP_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventCheckin" ADD CONSTRAINT "EventCheckin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventCheckin" ADD CONSTRAINT "EventCheckin_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
