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
  if (!data.Result) throw new Error("Invalid JSON data: Missing Result array");

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

    // 2. Process Participants (Cars) & Map Identity
    // Map: CarId (int) -> ParticipantId (UUID)
    const carIdToParticipantId = new Map<number, string>();
    // Map: DriverGuid (string) -> ParticipantId (UUID) - useful for Laps/Results
    const guidToParticipantId = new Map<string, string>();

    // Pre-fetch identities
    const cars = Array.isArray(data.Cars) ? data.Cars : [];
    const driverGuids = cars.map((c: any) => c.Driver?.Guid).filter(Boolean);
    
    // Also fetch guids from Result array if Cars is missing or incomplete
    if (Array.isArray(data.Result)) {
        data.Result.forEach((r: any) => {
            if (r.DriverGuid) driverGuids.push(r.DriverGuid);
        });
    }
    
    const uniqueGuids = Array.from(new Set(driverGuids)) as string[];
    const identities = await tx.driverIdentity.findMany({
      where: { driverGuid: { in: uniqueGuids } },
    });
    const identityMap = new Map(identities.map((i) => [i.driverGuid, i.userId]));

    // Create Participants from Cars array
    const processedGuids = new Set<string>();
    
    for (const car of cars) {
        const driver = car.Driver;
        const guid = driver?.Guid || `UNKNOWN_GUID_${car.CarId}`;
        
        if (processedGuids.has(guid)) {
            // Already created a participant for this GUID in this session. 
            // This happens if same driver is listed multiple times (e.g. driver swaps or data anomaly)
            // Just update mapping and skip creation.
            const existingId = guidToParticipantId.get(guid);
            if (existingId && car.CarId !== undefined) {
                carIdToParticipantId.set(car.CarId, existingId);
            }
            continue;
        }
        processedGuids.add(guid);

        const userId = identityMap.get(guid);

        const participant = await tx.raceParticipant.create({
            data: {
                sessionId: session.id,
                driverGuid: guid,
                displayName: driver?.Name || "Unknown",
                carName: car.Model,
                carClass: driver?.ClassID || "UNKNOWN", // Or map from elsewhere
                teamName: driver?.Team,
                userId: userId,
                // New Fields
                carIdInSession: car.CarId,
                nation: driver?.Nation,
                skin: car.Skin,
                ballastKg: car.BallastKG,
                restrictor: car.Restrictor,
            }
        });

        if (car.CarId !== undefined) {
            carIdToParticipantId.set(car.CarId, participant.id);
        }
        if (guid) {
            guidToParticipantId.set(guid, participant.id);
        }
    }

    // 3. Process Results
    // We iterate the Result array. Match to participant by Guid or CarId.
    if (Array.isArray(data.Result)) {
        let position = 1;
        for (const res of data.Result) {
            let participantId = guidToParticipantId.get(res.DriverGuid);
            
            // If not found by GUID, try CarId if available in Result object
            if (!participantId && res.CarId !== undefined) {
                participantId = carIdToParticipantId.get(res.CarId);
            }

            // If still not found (e.g. participant wasn't in Cars array?), create one?
            // For now, skip or handle gracefully.
            if (!participantId) {
                console.warn(`Result entry for guid ${res.DriverGuid} / carId ${res.CarId} has no matching participant.`);
                continue;
            }

            await tx.raceResult.create({
                data: {
                    sessionId: session.id,
                    participantId: participantId,
                    position: position++, // Implicit order in JSON usually
                    classPosition: 0, // Not explicitly in JSON usually
                    bestLapTime: res.BestLap,
                    totalTime: res.TotalTime,
                    lapsCompleted: res.LapCount ?? 0, // Result often has LapCount or similar? Or inferred from Laps? 
                                                      // Wait, JSON sample has "Laps" array, but Result object has... 
                                                      // JSON Sample Result object: BallastKG, BestLap, CarId, ... TotalTime.
                                                      // It does NOT have "LapsCompleted". We might need to count them from Laps array or assume it matches.
                                                      // Actually, let's check JSON again. Result array doesn't have "Laps" count.
                                                      // We should count them from Laps array for this driver.
                    status: res.Disqualified ? "DSQ" : "FINISHED",
                    
                    // New Fields
                    penaltyTime: res.PenaltyTime,
                    lapPenalty: res.LapPenalty,
                    isDisqualified: res.Disqualified || false,
                }
            });
        }
    }

    // 4. Process Laps
    if (Array.isArray(data.Laps)) {
        const lapsToCreate: any[] = [];
        
        // We need to count laps per driver to assign lap numbers if not provided
        const driverLapCounts = new Map<string, number>();

        // Sort laps by timestamp globally to be safe, though usually grouped by driver or chronological
        const sortedLaps = [...data.Laps].sort((a, b) => (a.Timestamp || 0) - (b.Timestamp || 0));

        for (const lap of sortedLaps) {
            let participantId = guidToParticipantId.get(lap.DriverGuid);
            if (!participantId && lap.CarId !== undefined) {
                participantId = carIdToParticipantId.get(lap.CarId);
            }
            if (!participantId) continue;

            const currentCount = driverLapCounts.get(participantId) || 0;
            const lapNumber = currentCount + 1;
            driverLapCounts.set(participantId, lapNumber);

            // Handle sectors: JSON has "Sectors": [int, int, int]
            const s1 = lap.Sectors?.[0] ?? null;
            const s2 = lap.Sectors?.[1] ?? null;
            const s3 = lap.Sectors?.[2] ?? null;

            lapsToCreate.push({
                sessionId: session.id,
                participantId,
                lapNumber,
                lapTime: lap.LapTime,
                sector1: s1,
                sector2: s2,
                sector3: s3,
                valid: lap.Cuts === 0, // Assuming 0 cuts = valid
                
                // New Fields
                cuts: lap.Cuts,
                tyre: lap.Tyre,
                timestamp: lap.Timestamp,
            });
        }

        if (lapsToCreate.length > 0) {
            await tx.raceLap.createMany({
                data: lapsToCreate
            });
        }
        
        // Backfill lapsCompleted in RaceResult if needed
        for (const [pid, count] of driverLapCounts) {
            await tx.raceResult.updateMany({
                where: { sessionId: session.id, participantId: pid },
                data: { lapsCompleted: count }
            });
        }
    }

    // 5. Process Events
    if (Array.isArray(data.Events)) {
        const eventsToCreate: any[] = [];
        for (const evt of data.Events) {
            // Primary participant
            let participantId = null;
            if (evt.CarId !== undefined) participantId = carIdToParticipantId.get(evt.CarId);
            if (!participantId && evt.Driver?.Guid) participantId = guidToParticipantId.get(evt.Driver.Guid);

            // Other participant (can be -1 for ENV)
            let otherParticipantId = null;
            if (evt.OtherCarId !== undefined && evt.OtherCarId !== -1) {
                otherParticipantId = carIdToParticipantId.get(evt.OtherCarId);
            }
            if (!otherParticipantId && evt.OtherDriver?.Guid) {
                otherParticipantId = guidToParticipantId.get(evt.OtherDriver.Guid);
            }

            eventsToCreate.push({
                sessionId: session.id,
                type: evt.Type,
                carId: evt.CarId,
                driverGuid: evt.Driver?.Guid,
                participantId: participantId, // Nullable
                
                otherCarId: evt.OtherCarId,
                otherDriverGuid: evt.OtherDriver?.Guid,
                otherParticipantId: otherParticipantId, // Nullable
                
                impactSpeed: evt.ImpactSpeed,
                
                worldPosX: evt.WorldPosition?.X,
                worldPosY: evt.WorldPosition?.Y,
                worldPosZ: evt.WorldPosition?.Z,
                
                relPosX: evt.RelPosition?.X,
                relPosY: evt.RelPosition?.Y,
                relPosZ: evt.RelPosition?.Z,
            });
        }

        if (eventsToCreate.length > 0) {
            await tx.raceEvent.createMany({
                data: eventsToCreate
            });
        }
    }

    // 6. Update Upload Status
    await tx.rawResultUpload.update({
      where: { id: uploadId },
      data: { status: "INGESTED" },
    });
  }, {
    maxWait: 20000, // default: 2000
    timeout: 20000, // default: 5000
  });

  revalidatePath(`/admin/results/${uploadId}`);
}
