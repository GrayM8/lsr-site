-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('draft', 'scheduled', 'in_progress', 'canceled', 'postponed', 'completed');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'retired', 'deleted');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('public', 'members', 'officers');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('meeting', 'practice', 'race', 'workshop', 'social');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('going', 'waitlist', 'canceled');

-- CreateEnum
CREATE TYPE "public"."CheckinMethod" AS ENUM ('qr', 'manual', 'import');

-- CreateEnum
CREATE TYPE "public"."SessionKind" AS ENUM ('practice', 'qual', 'race');

-- CreateEnum
CREATE TYPE "public"."FinishStatus" AS ENUM ('finished', 'dnf', 'dns', 'dsq');

-- CreateEnum
CREATE TYPE "public"."ResultSource" AS ENUM ('manual', 'stracker', 'import');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('stripe', 'manual', 'other');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('succeeded', 'pending', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('ANNUAL_DUES', 'LEAGUE_FEE');

-- CreateEnum
CREATE TYPE "public"."EntitlementKind" AS ENUM ('lsr_member', 'league_access');

-- CreateEnum
CREATE TYPE "public"."EntitlementScope" AS ENUM ('year', 'season', 'lifetime');

-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('create', 'update', 'delete', 'import', 'login', 'logout', 'rsvp', 'checkin', 'payment_success', 'payment_failed', 'profile_update');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "iRating" INTEGER,
    "socials" JSONB,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'active',
    "major" TEXT,
    "gradYear" INTEGER,
    "eid" TEXT,
    "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "public"."AuthIdentity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "diffJson" JSONB,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembershipTier" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "MembershipTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "type" "public"."ProductType" NOT NULL,
    "name" TEXT NOT NULL,
    "leagueId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "provider" "public"."PaymentProvider" NOT NULL,
    "providerRef" TEXT,
    "status" "public"."PaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "public"."EntitlementKind" NOT NULL,
    "leagueId" TEXT,
    "scope" "public"."EntitlementScope" NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "sourcePaymentId" TEXT,
    "meta" JSONB,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descriptionMd" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Season" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "pointsRule" JSONB NOT NULL,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Round" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "kind" "public"."SessionKind" NOT NULL,
    "trackId" TEXT,
    "carId" TEXT,
    "classId" TEXT,
    "laps" INTEGER,
    "durationMin" INTEGER,
    "startedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Class" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entry" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "classId" TEXT NOT NULL,
    "carId" TEXT,
    "number" INTEGER,
    "nickname" TEXT,
    "isEligiblePoints" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Result" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "position" INTEGER,
    "points" INTEGER,
    "bestLapMs" INTEGER,
    "totalTimeMs" INTEGER,
    "lapsCompleted" INTEGER,
    "status" "public"."FinishStatus" NOT NULL DEFAULT 'finished',
    "penaltiesJson" JSONB,
    "source" "public"."ResultSource" NOT NULL DEFAULT 'manual',
    "provenanceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Provenance" (
    "id" TEXT NOT NULL,
    "source" "public"."ResultSource" NOT NULL,
    "payloadSha256" TEXT NOT NULL,
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Provenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImportArtifact" (
    "id" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdById" TEXT,
    "provenanceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "layout" TEXT,
    "country" TEXT,
    "lengthM" INTEGER,
    "simKey" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Car" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "simKey" TEXT,
    "classHint" TEXT,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSeries_pkey" PRIMARY KEY ("id")
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
    "seriesId" TEXT,
    "venueId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "startsAtUtc" TIMESTAMP(3) NOT NULL,
    "endsAtUtc" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',
    "status" "public"."EventStatus" NOT NULL DEFAULT 'scheduled',
    "rsvpRequired" BOOLEAN NOT NULL DEFAULT false,
    "rsvpOpenAt" TIMESTAMP(3),
    "rsvpCloseAt" TIMESTAMP(3),
    "capacity" INTEGER,
    "waitlistEnabled" BOOLEAN NOT NULL DEFAULT true,
    "meetingUrl" TEXT,
    "streamUrl" TEXT,
    "dialIn" TEXT,
    "accessInstructions" TEXT,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventEligibility" (
    "eventId" TEXT NOT NULL,
    "allowsGeneral" BOOLEAN NOT NULL DEFAULT true,
    "requiresLsrMember" BOOLEAN NOT NULL DEFAULT false,
    "requiresLeagueId" TEXT,
    "minRoleId" TEXT,
    "eligibilityJson" JSONB,

    CONSTRAINT "EventEligibility_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "public"."RSVP" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."RSVPStatus" NOT NULL,
    "waitlistPos" INTEGER,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'web',

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "public"."CheckinMethod",

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "bodyMd" TEXT NOT NULL,
    "authorId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bodyMd" TEXT NOT NULL,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'public',
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "storageUrl" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntityTag" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "EntityTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "public"."User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "User_eid_key" ON "public"."User"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "public"."Role"("key");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "public"."UserRole"("roleId");

-- CreateIndex
CREATE INDEX "AuthIdentity_userId_idx" ON "public"."AuthIdentity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_provider_providerUserId_key" ON "public"."AuthIdentity"("provider", "providerUserId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "public"."AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipTier_key_key" ON "public"."MembershipTier"("key");

-- CreateIndex
CREATE INDEX "UserMembership_userId_validTo_idx" ON "public"."UserMembership"("userId", "validTo");

-- CreateIndex
CREATE UNIQUE INDEX "UserMembership_userId_tierId_validFrom_key" ON "public"."UserMembership"("userId", "tierId", "validFrom");

-- CreateIndex
CREATE INDEX "Product_leagueId_idx" ON "public"."Product"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_type_leagueId_key" ON "public"."Product"("type", "leagueId");

-- CreateIndex
CREATE INDEX "Payment_userId_productId_status_paidAt_idx" ON "public"."Payment"("userId", "productId", "status", "paidAt");

-- CreateIndex
CREATE INDEX "Entitlement_userId_kind_leagueId_validTo_idx" ON "public"."Entitlement"("userId", "kind", "leagueId", "validTo");

-- CreateIndex
CREATE INDEX "Entitlement_leagueId_idx" ON "public"."Entitlement"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "League_slug_key" ON "public"."League"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_key" ON "public"."Season"("slug");

-- CreateIndex
CREATE INDEX "Season_leagueId_year_idx" ON "public"."Season"("leagueId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Round_slug_key" ON "public"."Round"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Round_eventId_key" ON "public"."Round"("eventId");

-- CreateIndex
CREATE INDEX "Round_seasonId_date_idx" ON "public"."Round"("seasonId", "date");

-- CreateIndex
CREATE INDEX "Session_roundId_kind_idx" ON "public"."Session"("roundId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "Class_slug_key" ON "public"."Class"("slug");

-- CreateIndex
CREATE INDEX "Class_leagueId_idx" ON "public"."Class"("leagueId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "public"."Team"("slug");

-- CreateIndex
CREATE INDEX "Entry_seasonId_classId_idx" ON "public"."Entry"("seasonId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "unique_entry_user" ON "public"."Entry"("seasonId", "classId", "userId");

-- CreateIndex
CREATE INDEX "Result_sessionId_position_idx" ON "public"."Result"("sessionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Result_sessionId_entryId_key" ON "public"."Result"("sessionId", "entryId");

-- CreateIndex
CREATE INDEX "Provenance_source_createdAt_idx" ON "public"."Provenance"("source", "createdAt");

-- CreateIndex
CREATE INDEX "ImportArtifact_createdAt_idx" ON "public"."ImportArtifact"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Track_simKey_key" ON "public"."Track"("simKey");

-- CreateIndex
CREATE UNIQUE INDEX "Car_simKey_key" ON "public"."Car"("simKey");

-- CreateIndex
CREATE UNIQUE INDEX "EventSeries_slug_key" ON "public"."EventSeries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "public"."Event"("slug");

-- CreateIndex
CREATE INDEX "Event_startsAtUtc_idx" ON "public"."Event"("startsAtUtc");

-- CreateIndex
CREATE INDEX "Event_status_startsAtUtc_idx" ON "public"."Event"("status", "startsAtUtc");

-- CreateIndex
CREATE INDEX "EventEligibility_requiresLeagueId_idx" ON "public"."EventEligibility"("requiresLeagueId");

-- CreateIndex
CREATE INDEX "EventEligibility_minRoleId_idx" ON "public"."EventEligibility"("minRoleId");

-- CreateIndex
CREATE INDEX "RSVP_eventId_status_respondedAt_idx" ON "public"."RSVP"("eventId", "status", "respondedAt");

-- CreateIndex
CREATE INDEX "RSVP_eventId_waitlistPos_idx" ON "public"."RSVP"("eventId", "waitlistPos");

-- CreateIndex
CREATE UNIQUE INDEX "RSVP_eventId_userId_key" ON "public"."RSVP"("eventId", "userId");

-- CreateIndex
CREATE INDEX "Attendance_eventId_idx" ON "public"."Attendance"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_userId_key" ON "public"."Attendance"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "public"."Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "public"."Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "public"."Tag"("slug");

-- CreateIndex
CREATE INDEX "EntityTag_entityType_entityId_idx" ON "public"."EntityTag"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "EntityTag_tagId_idx" ON "public"."EntityTag"("tagId");

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthIdentity" ADD CONSTRAINT "AuthIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMembership" ADD CONSTRAINT "UserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserMembership" ADD CONSTRAINT "UserMembership_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."MembershipTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entitlement" ADD CONSTRAINT "Entitlement_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entitlement" ADD CONSTRAINT "Entitlement_sourcePaymentId_fkey" FOREIGN KEY ("sourcePaymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Season" ADD CONSTRAINT "Season_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round" ADD CONSTRAINT "Round_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_carId_fkey" FOREIGN KEY ("carId") REFERENCES "public"."Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "public"."Provenance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Provenance" ADD CONSTRAINT "Provenance_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImportArtifact" ADD CONSTRAINT "ImportArtifact_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImportArtifact" ADD CONSTRAINT "ImportArtifact_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "public"."Provenance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."EventSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventEligibility" ADD CONSTRAINT "EventEligibility_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventEligibility" ADD CONSTRAINT "EventEligibility_requiresLeagueId_fkey" FOREIGN KEY ("requiresLeagueId") REFERENCES "public"."League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventEligibility" ADD CONSTRAINT "EventEligibility_minRoleId_fkey" FOREIGN KEY ("minRoleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntityTag" ADD CONSTRAINT "EntityTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
