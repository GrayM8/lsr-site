-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "roundNumber" INTEGER;

-- AlterTable
ALTER TABLE "public"."Season" ADD COLUMN     "seriesId" TEXT,
ALTER COLUMN "leagueId" DROP NOT NULL,
ALTER COLUMN "pointsRule" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Season_seriesId_idx" ON "public"."Season"("seriesId");

-- AddForeignKey
ALTER TABLE "public"."Season" ADD CONSTRAINT "Season_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."EventSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
