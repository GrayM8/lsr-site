// src/schemas/event.schema.ts
import { z } from 'zod';

export const rsvpRequestSchema = z.object({
  status: z.enum(['going', 'waitlist', 'canceled']),
});

export type RsvpRequest = z.infer<typeof rsvpRequestSchema>;
