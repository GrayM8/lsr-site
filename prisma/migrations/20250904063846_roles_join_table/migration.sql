/*
  Warnings:

  - You are about to drop the column `roles` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "roles";

-- DropEnum
DROP TYPE "public"."Role";

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

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "public"."Role"("code");

-- CreateIndex
CREATE INDEX "ProfileRole_roleId_idx" ON "public"."ProfileRole"("roleId");

-- AddForeignKey
ALTER TABLE "public"."ProfileRole" ADD CONSTRAINT "ProfileRole_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileRole" ADD CONSTRAINT "ProfileRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
