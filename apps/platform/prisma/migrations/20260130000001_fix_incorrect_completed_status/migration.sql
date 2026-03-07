-- Fix events that were incorrectly marked as COMPLETED but are still in the future
UPDATE "Event"
SET "status" = 'PUBLISHED'
WHERE "status" = 'COMPLETED'
  AND "endsAtUtc" > NOW();
