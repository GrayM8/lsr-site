/*
  Warnings:

  - You are about to drop the column `status` on the `Provenance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RawResultUploadStatus" AS ENUM ('UPLOADED', 'PARSED', 'INGESTED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Provenance" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."ProvenanceStatus";

-- CreateTable
CREATE TABLE "public"."RawResultUpload" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."RawResultUploadStatus" NOT NULL DEFAULT 'UPLOADED',
    "errorMessage" TEXT,

    CONSTRAINT "RawResultUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RawResultUpload_uploadedByUserId_idx" ON "public"."RawResultUpload"("uploadedByUserId");

-- AddForeignKey
ALTER TABLE "public"."RawResultUpload" ADD CONSTRAINT "RawResultUpload_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
