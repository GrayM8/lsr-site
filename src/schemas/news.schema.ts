import { z } from "zod";

export const newsPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphenated"),
  excerpt: z.string().optional(),
  bodyMd: z.string().min(1, "Content is required"),
  published: z.boolean(),
});

export type NewsPostSchema = z.infer<typeof newsPostSchema>;
