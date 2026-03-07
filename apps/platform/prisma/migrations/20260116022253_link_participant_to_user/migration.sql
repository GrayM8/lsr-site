-- AddForeignKey
ALTER TABLE "public"."RaceParticipant" ADD CONSTRAINT "RaceParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
