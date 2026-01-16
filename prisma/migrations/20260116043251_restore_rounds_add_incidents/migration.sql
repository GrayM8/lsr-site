-- AlterTable
ALTER TABLE "public"."Entry" ADD COLUMN     "totalCollisions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCuts" INTEGER NOT NULL DEFAULT 0;
