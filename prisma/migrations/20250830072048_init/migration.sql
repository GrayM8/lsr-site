-- CreateEnum
CREATE TYPE "public"."SponsorTier" AS ENUM ('title', 'gold', 'silver', 'bronze');

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "bio" TEXT,
    "headshotUrl" TEXT,
    "instagram" TEXT,
    "twitch" TEXT,
    "iRating" INTEGER,
    "totalWins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sponsor" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "logoUrl" TEXT,
    "tier" "public"."SponsorTier" NOT NULL DEFAULT 'bronze',

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "location" TEXT,
    "description" TEXT,
    "externalUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_handle_key" ON "public"."Driver"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_instagram_key" ON "public"."Driver"("instagram");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_twitch_key" ON "public"."Driver"("twitch");

-- CreateIndex
CREATE INDEX "Driver_handle_idx" ON "public"."Driver"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_name_key" ON "public"."Sponsor"("name");
