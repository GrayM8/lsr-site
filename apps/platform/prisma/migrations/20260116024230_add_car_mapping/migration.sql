-- AlterTable
ALTER TABLE "public"."RaceParticipant" ADD COLUMN     "carMappingId" TEXT;

-- CreateTable
CREATE TABLE "public"."CarMapping" (
    "id" TEXT NOT NULL,
    "gameCarName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "secondaryDisplayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarMapping_gameCarName_key" ON "public"."CarMapping"("gameCarName");

-- AddForeignKey
ALTER TABLE "public"."RaceParticipant" ADD CONSTRAINT "RaceParticipant_carMappingId_fkey" FOREIGN KEY ("carMappingId") REFERENCES "public"."CarMapping"("id") ON DELETE SET NULL ON UPDATE CASCADE;
