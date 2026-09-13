import { z } from "zod";

export const legalPageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must not exceed 120 characters"),
  content: z
    .string()
    .min(1, "Content is required")
});

export type LegalPageFormData = z.infer<typeof legalPageSchema>;
