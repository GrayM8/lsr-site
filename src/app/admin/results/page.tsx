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
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Race Results</h1>
      </div>
      <ResultsAdminClient results={results} />
    </main>
  );
}
