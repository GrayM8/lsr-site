// src/env.mjs
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  // Add other environment variables here
});

export const env = envSchema.parse(process.env);
