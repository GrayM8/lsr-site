"use server";

import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/server/auth/session";

export async function uploadResult(formData: FormData) {
  const { user } = await getSessionUser();
  const { ok } = await requireAdmin();
  if (!ok || !user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const fileText = await file.text();
  let rawJson;
  try {
    rawJson = JSON.parse(fileText);
  } catch (error) {
    throw new Error("Invalid JSON file");
  }

  const fileBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha256 = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const newResult = await prisma.rawResultUpload.create({
    data: {
      filename: file.name,
      filesize: file.size,
      sha256,
      rawJson,
      uploadedByUserId: user.id,
    },
    include: {
      uploadedBy: true,
    },
  });

  revalidatePath("/admin/results");

  return newResult;
}

export async function previewParseResult(uploadId: string) {
  const { ok } = await requireAdmin();
  if (!ok) {
    throw new Error("Unauthorized");
  }

  const upload = await prisma.rawResultUpload.findUnique({
    where: { id: uploadId },
  });

  if (!upload) {
    throw new Error("Upload not found");
  }

  const { rawJson } = upload;

  if (typeof rawJson !== "object" || rawJson === null) {
    await prisma.rawResultUpload.update({
      where: { id: uploadId },
      data: { status: "FAILED", errorMessage: "Invalid JSON structure" },
    });
    throw new Error("Invalid JSON structure");
  }

  const { Result: results, Laps: laps } = rawJson as {
    Result: any[];
    Laps: any[];
  };

  const anomalies: string[] = [];
  if (!Array.isArray(results)) {
    anomalies.push("Missing or invalid 'Result' array");
  }
  if (!Array.isArray(laps)) {
    anomalies.push("Missing or invalid 'Laps' array");
  }

  const drivers = new Map<string, { driverName: string; carModel: string }>();
  if (Array.isArray(results)) {
    for (const result of results) {
      if (result.DriverGuid && !drivers.has(result.DriverGuid)) {
        drivers.set(result.DriverGuid, {
          driverName: result.DriverName,
          carModel: result.CarModel,
        });
      } else {
        anomalies.push("Missing or duplicate driver GUID in results");
      }
    }
  }

  const report = {
    drivers: Array.from(drivers.entries()).map(([guid, data]) => ({
      guid,
      ...data,
    })),
    resultsCount: results?.length ?? 0,
    lapsCount: laps?.length ?? 0,
    anomalies,
  };

  await prisma.parseReport.upsert({
    where: { uploadId },
    create: {
      uploadId,
      ...report,
    },
    update: {
      ...report,
    },
  });

  const updatedUpload = await prisma.rawResultUpload.update({
    where: { id: uploadId },
    data: {
      status: anomalies.length > 0 ? "FAILED" : "PARSED",
      errorMessage: anomalies.length > 0 ? anomalies.join(", ") : null,
    },
    include: {
      parseReport: true,
      uploadedBy: true,
    },
  });

  revalidatePath(`/admin/results/${uploadId}`);
  revalidatePath(`/admin/results`);

  return updatedUpload;
}

