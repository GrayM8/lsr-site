-- CreateEnum
CREATE TYPE "public"."SessionType" AS ENUM ('qualifying', 'race');

-- CreateEnum
CREATE TYPE "public"."FinishStatus" AS ENUM ('finished', 'dnf', 'dns', 'dsq');

-- CreateEnum
CREATE TYPE "public"."ResultStatus" AS ENUM ('draft', 'provisional', 'official');

-- CreateTable
CREATE TABLE "public"."EventResult" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "public"."SessionType" NOT NULL,
    "status" "public"."ResultStatus" NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    "source" TEXT,
    "createdByProfileId" TEXT NOT NULL,
    "officialAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventResultEntry" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "profileId" TEXT,
    "displayName" TEXT NOT NULL,
    "position" INTEGER,
    "status" "public"."FinishStatus" NOT NULL DEFAULT 'finished',
    "lapsCompleted" INTEGER,
    "totalTimeMs" INTEGER,
    "bestLapMs" INTEGER,
    "gapToP1Ms" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventResultEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventResult_eventId_status_idx" ON "public"."EventResult"("eventId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EventResult_eventId_type_key" ON "public"."EventResult"("eventId", "type");

-- CreateIndex
CREATE INDEX "EventResultEntry_resultId_position_idx" ON "public"."EventResultEntry"("resultId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "EventResultEntry_resultId_profileId_key" ON "public"."EventResultEntry"("resultId", "profileId");

-- AddForeignKey
ALTER TABLE "public"."EventResult" ADD CONSTRAINT "EventResult_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventResult" ADD CONSTRAINT "EventResult_createdByProfileId_fkey" FOREIGN KEY ("createdByProfileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventResultEntry" ADD CONSTRAINT "EventResultEntry_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."EventResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventResultEntry" ADD CONSTRAINT "EventResultEntry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
