-- CreateEnum
CREATE TYPE "public"."ProfileStatus" AS ENUM ('active', 'retired', 'deleted');

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "iRating" INTEGER,
    "socials" JSONB,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."ProfileStatus" NOT NULL DEFAULT 'active',
    "eid" TEXT,
    "gradYear" INTEGER,
    "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "public"."Profile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_eid_key" ON "public"."Profile"("eid");
