// src/schemas/result.schema.ts
import { z } from 'zod';
import { FinishStatus } from '@prisma/client';

export const resultRowSchema = z.object({
  entryId: z.string().uuid(),
  position: z.number().int().positive().optional(),
  points: z.number().int().optional(),
  bestLapMs: z.number().int().positive().optional(),
  totalTimeMs: z.number().int().positive().optional(),
  lapsCompleted: z.number().int().positive().optional(),
  status: z.nativeEnum(FinishStatus).default('finished'),
  penaltiesJson: z.string().optional(), // Assuming JSON as string for transport
});

export const resultsUpdateRequestSchema = z.array(resultRowSchema);

export type ResultRow = z.infer<typeof resultRowSchema>;
export type ResultsUpdateRequest = z.infer<typeof resultsUpdateRequestSchema>;
