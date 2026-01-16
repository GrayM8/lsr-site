-- AlterTable
ALTER TABLE "public"."RawResultUpload" ADD COLUMN     "eventId" TEXT;

-- CreateTable
CREATE TABLE "public"."DriverIdentity" (
    "id" TEXT NOT NULL,
    "driverGuid" TEXT NOT NULL,
    "lastSeenName" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RaceSession" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "eventId" TEXT,
    "sessionType" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "trackConfig" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RaceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RaceParticipant" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "driverGuid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "carName" TEXT NOT NULL,
    "carClass" TEXT NOT NULL,
    "teamName" TEXT,
    "userId" TEXT,

    CONSTRAINT "RaceParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RaceResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "classPosition" INTEGER NOT NULL,
    "bestLapTime" INTEGER,
    "totalTime" INTEGER,
    "lapsCompleted" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "gap" TEXT,

    CONSTRAINT "RaceResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RaceLap" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "lapNumber" INTEGER NOT NULL,
    "lapTime" INTEGER NOT NULL,
    "sector1" INTEGER,
    "sector2" INTEGER,
    "sector3" INTEGER,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RaceLap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverIdentity_driverGuid_key" ON "public"."DriverIdentity"("driverGuid");

-- CreateIndex
CREATE INDEX "RaceSession_uploadId_idx" ON "public"."RaceSession"("uploadId");

-- CreateIndex
CREATE INDEX "RaceSession_eventId_idx" ON "public"."RaceSession"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "RaceParticipant_sessionId_driverGuid_key" ON "public"."RaceParticipant"("sessionId", "driverGuid");

-- CreateIndex
CREATE INDEX "RaceResult_sessionId_idx" ON "public"."RaceResult"("sessionId");

-- CreateIndex
CREATE INDEX "RaceLap_sessionId_participantId_idx" ON "public"."RaceLap"("sessionId", "participantId");

-- CreateIndex
CREATE INDEX "RawResultUpload_eventId_idx" ON "public"."RawResultUpload"("eventId");

-- AddForeignKey
ALTER TABLE "public"."RawResultUpload" ADD CONSTRAINT "RawResultUpload_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverIdentity" ADD CONSTRAINT "DriverIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceSession" ADD CONSTRAINT "RaceSession_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "public"."RawResultUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceSession" ADD CONSTRAINT "RaceSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceParticipant" ADD CONSTRAINT "RaceParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."RaceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceResult" ADD CONSTRAINT "RaceResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."RaceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceResult" ADD CONSTRAINT "RaceResult_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."RaceParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceLap" ADD CONSTRAINT "RaceLap_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."RaceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceLap" ADD CONSTRAINT "RaceLap_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."RaceParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
