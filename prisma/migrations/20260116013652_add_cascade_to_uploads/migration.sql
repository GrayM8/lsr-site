-- DropForeignKey
ALTER TABLE "public"."ParseReport" DROP CONSTRAINT "ParseReport_uploadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RaceSession" DROP CONSTRAINT "RaceSession_uploadId_fkey";

-- AddForeignKey
ALTER TABLE "public"."RaceSession" ADD CONSTRAINT "RaceSession_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "public"."RawResultUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParseReport" ADD CONSTRAINT "ParseReport_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "public"."RawResultUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
