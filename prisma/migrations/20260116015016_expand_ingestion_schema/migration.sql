-- AlterTable
ALTER TABLE "public"."RaceLap" ADD COLUMN     "cuts" INTEGER,
ADD COLUMN     "timestamp" INTEGER,
ADD COLUMN     "tyre" TEXT;

-- AlterTable
ALTER TABLE "public"."RaceParticipant" ADD COLUMN     "ballastKg" INTEGER,
ADD COLUMN     "carIdInSession" INTEGER,
ADD COLUMN     "nation" TEXT,
ADD COLUMN     "restrictor" INTEGER,
ADD COLUMN     "skin" TEXT;

-- AlterTable
ALTER TABLE "public"."RaceResult" ADD COLUMN     "isDisqualified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lapPenalty" INTEGER,
ADD COLUMN     "penaltyTime" INTEGER;

-- CreateTable
CREATE TABLE "public"."RaceEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "carId" INTEGER,
    "driverGuid" TEXT,
    "participantId" TEXT,
    "otherCarId" INTEGER,
    "otherDriverGuid" TEXT,
    "otherParticipantId" TEXT,
    "impactSpeed" DOUBLE PRECISION NOT NULL,
    "worldPosX" DOUBLE PRECISION,
    "worldPosY" DOUBLE PRECISION,
    "worldPosZ" DOUBLE PRECISION,
    "relPosX" DOUBLE PRECISION,
    "relPosY" DOUBLE PRECISION,
    "relPosZ" DOUBLE PRECISION,

    CONSTRAINT "RaceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RaceEvent_sessionId_idx" ON "public"."RaceEvent"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."RaceEvent" ADD CONSTRAINT "RaceEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."RaceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceEvent" ADD CONSTRAINT "RaceEvent_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."RaceParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RaceEvent" ADD CONSTRAINT "RaceEvent_otherParticipantId_fkey" FOREIGN KEY ("otherParticipantId") REFERENCES "public"."RaceParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
