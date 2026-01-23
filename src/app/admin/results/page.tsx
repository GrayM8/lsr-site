import { prisma } from "@/server/db";
import { ResultsAdminClient } from "@/app/admin/results/client";

export default async function ResultsAdminPage() {
  const results = await prisma.rawResultUpload.findMany({
    orderBy: {
      uploadedAt: "desc",
    },
    include: {
      uploadedBy: true,
      event: true,
    },
  });

  return (
    <div className="h-full">
      <ResultsAdminClient results={results} />
    </div>
  );
}
