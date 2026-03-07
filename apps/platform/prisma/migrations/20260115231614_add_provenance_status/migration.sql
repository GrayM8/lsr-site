-- CreateEnum
CREATE TYPE "public"."ProvenanceStatus" AS ENUM ('UPLOADED', 'PARSED', 'INGESTED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Provenance" ADD COLUMN     "status" "public"."ProvenanceStatus" NOT NULL DEFAULT 'UPLOADED';
