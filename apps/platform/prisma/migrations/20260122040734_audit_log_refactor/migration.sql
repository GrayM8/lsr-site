/*
  Warnings:

  - You are about to drop the column `action` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `diffJson` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `metaJson` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `actionType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "action",
DROP COLUMN "diffJson",
DROP COLUMN "metaJson",
ADD COLUMN     "actionType" TEXT NOT NULL,
ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "targetUserId" TEXT;

-- DropEnum
DROP TYPE "public"."AuditAction";

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "public"."AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actionType_createdAt_idx" ON "public"."AuditLog"("actionType", "createdAt");
