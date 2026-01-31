-- Rename the old enum
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";

-- Create the new enum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- Alter the column to use the new enum with casting
ALTER TABLE "Event" 
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "EventStatus" 
    USING (
      CASE status::text
        WHEN 'draft' THEN 'DRAFT'::"EventStatus"
        WHEN 'scheduled' THEN 'SCHEDULED'::"EventStatus"
        WHEN 'in_progress' THEN 'IN_PROGRESS'::"EventStatus"
        WHEN 'canceled' THEN 'CANCELLED'::"EventStatus"
        WHEN 'postponed' THEN 'POSTPONED'::"EventStatus"
        WHEN 'completed' THEN 'COMPLETED'::"EventStatus"
        ELSE 'DRAFT'::"EventStatus"
      END
    );

-- Set the new default
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- Drop the old enum
DROP TYPE "EventStatus_old";
