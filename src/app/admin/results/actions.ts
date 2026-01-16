"use server";

import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/server/auth/session";
import { RawResultUploadStatus } from "@prisma/client";

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
        // Only report if actually missing, duplicates are expected in results if multi-class? 
        // Actually usually one result entry per driver per session.
        if (!result.DriverGuid) {
             anomalies.push("Missing driver GUID in result entry");
        }
      }
    }
  }

  // UPSERT DRIVER IDENTITIES
  for (const [guid, data] of drivers) {
    await prisma.driverIdentity.upsert({
      where: { driverGuid: guid },
      create: {
        driverGuid: guid,
        lastSeenName: data.driverName,
      },
      update: {
        lastSeenName: data.driverName,
      },
    });
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

export async function bindEventToUpload(uploadId: string, eventId: string) {
  const { ok } = await requireAdmin();
  if (!ok) throw new Error("Unauthorized");

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  await prisma.rawResultUpload.update({
    where: { id: uploadId },
    data: { eventId },
  });

  revalidatePath(`/admin/results/${uploadId}`);
}

export async function deleteUpload(uploadId: string, force: boolean = false) {
  const { ok } = await requireAdmin();
  if (!ok) throw new Error("Unauthorized");

  const upload = await prisma.rawResultUpload.findUnique({
    where: { id: uploadId },
    include: { ingestedSessions: true },
  });

  if (!upload) throw new Error("Upload not found");

  if (upload.ingestedSessions.length > 0 && !force) {
    throw new Error("Cannot delete ingested upload without force option");
  }

  await prisma.rawResultUpload.delete({
    where: { id: uploadId },
  });

  revalidatePath("/admin/results");
}

export async function ingestUpload(uploadId: string) {
  const { ok } = await requireAdmin();
  if (!ok) throw new Error("Unauthorized");

  const upload = await prisma.rawResultUpload.findUnique({
    where: { id: uploadId },
  });

  if (!upload) throw new Error("Upload not found");
  if (!upload.eventId) throw new Error("No event assigned to upload");
  if (upload.status === "INGESTED") throw new Error("Already ingested");

  const data = upload.rawJson as any;

  // Basic validation
  if (!data.Result || !data.Laps) throw new Error("Invalid JSON data for ingestion");

  await prisma.$transaction(async (tx) => {
    // 1. Create RaceSession
    const session = await tx.raceSession.create({
      data: {
        uploadId,
        eventId: upload.eventId!,
        sessionType: data.Type || "UNKNOWN",
        trackName: data.TrackName || "UNKNOWN",
        trackConfig: data.TrackConfig,
        startedAt: data.Date ? new Date(data.Date) : new Date(),
      },
    });

    // 2. Map Drivers and Create Participants
    const participantsMap = new Map<string, string>(); // driverGuid -> participantId

    // Pre-fetch identities to get userIds
    const driverGuids = (data.Result as any[]).map((r: any) => r.DriverGuid).filter(Boolean);
    const identities = await tx.driverIdentity.findMany({
      where: { driverGuid: { in: driverGuids } },
    });
    const identityMap = new Map(identities.map((i) => [i.driverGuid, i.userId]));

    for (const res of data.Result) {
      if (!res.DriverGuid) continue;
      
      const userId = identityMap.get(res.DriverGuid);

      const participant = await tx.raceParticipant.create({
        data: {
          sessionId: session.id,
          driverGuid: res.DriverGuid,
          displayName: res.DriverName,
          carName: res.CarModel,
          carClass: "UNKNOWN", // In AC JSON, sometimes stored differently or implicit
          teamName: res.TeamName,
          userId: userId,
        },
      });
      participantsMap.set(res.DriverGuid, participant.id);

      // 3. Create Result for this participant
      await tx.raceResult.create({
        data: {
          sessionId: session.id,
          participantId: participant.id,
          position: res.Position || 999,
          classPosition: 0, // Placeholder
          bestLapTime: res.BestLap,
          totalTime: res.TotalTime,
          lapsCompleted: res.Laps ?? 0,
          status: "FINISHED", // Simplify for now
        },
      });
    }

    // 4. Create Laps
    // We need to order laps by timestamp if available to assign lap numbers correctly per driver
    const laps = (data.Laps as any[]).slice();
    // Assuming Laps have Timestamp. If not, we might trust the order.
    // Group by driver
    const lapsByDriver = new Map<string, any[]>();
    for (const lap of laps) {
      if (!lap.DriverGuid) continue;
      if (!lapsByDriver.has(lap.DriverGuid)) {
        lapsByDriver.set(lap.DriverGuid, []);
      }
      lapsByDriver.get(lap.DriverGuid)!.push(lap);
    }

    const lapsToCreate: any[] = [];
    for (const [driverGuid, driverLaps] of lapsByDriver) {
      const participantId = participantsMap.get(driverGuid);
      if (!participantId) continue;

      // Sort by timestamp if present
      if (driverLaps[0]?.Timestamp) {
        driverLaps.sort((a, b) => a.Timestamp - b.Timestamp);
      }

      let lapNum = 1;
      for (const lap of driverLaps) {
         lapsToCreate.push({
             sessionId: session.id,
             participantId,
             lapNumber: lapNum++,
             lapTime: lap.LapTime,
             sector1: lap.Sector1,
             sector2: lap.Sector2,
             sector3: lap.Sector3,
             valid: lap.Cuts === 0,
         });
      }
    }
    
    if (lapsToCreate.length > 0) {
        await tx.raceLap.createMany({
            data: lapsToCreate
        });
    }

    // 5. Update Upload Status
    await tx.rawResultUpload.update({
      where: { id: uploadId },
      data: { status: "INGESTED" },
    });
  });

  revalidatePath(`/admin/results/${uploadId}`);
}