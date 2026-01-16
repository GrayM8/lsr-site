import { prisma } from "@/server/db";
import { notFound } from "next/navigation";
import { ResultDetailClient } from "./client";

export default async function ResultDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;
  const result = await prisma.rawResultUpload.findUnique({
    where: { id: awaitedParams.id },
    include: {
      uploadedBy: true,
      parseReport: true,
    },
  });

  if (!result) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <ResultDetailClient result={result} />
    </main>
  );
}
