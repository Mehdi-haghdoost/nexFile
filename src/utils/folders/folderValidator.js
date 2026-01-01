import { z } from "zod";

export const createFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(100, "Folder name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .default(""),

  accessType: z.enum(["regular", "specific"]).default("regular"),

  parentFolder: z.string().optional().nullable(),

  color: z.string().optional().default("#4C3CC6"),

  icon: z.string().optional().default("folder"),

  tags: z.array(z.string().trim()).optional().default([]),
});

export const updateFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(100, "Folder name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  accessType: z.enum(["regular", "specific"]).optional(),

  color: z.string().optional(),

  icon: z.string().optional(),

  tags: z.array(z.string().trim()).optional(),

  isStarred: z.boolean().optional(),

  isArchived: z.boolean().optional(),
});