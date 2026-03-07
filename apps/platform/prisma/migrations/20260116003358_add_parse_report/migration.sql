-- CreateTable
CREATE TABLE "public"."ParseReport" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "drivers" JSONB NOT NULL,
    "resultsCount" INTEGER NOT NULL,
    "lapsCount" INTEGER NOT NULL,
    "anomalies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParseReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParseReport_uploadId_key" ON "public"."ParseReport"("uploadId");

-- AddForeignKey
ALTER TABLE "public"."ParseReport" ADD CONSTRAINT "ParseReport_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "public"."RawResultUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
