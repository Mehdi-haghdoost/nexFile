import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
  "application/zip",
  "application/x-rar-compressed",
  "video/mp4",
  "video/mpeg",
  "audio/mpeg",
  "audio/wav",
];

export const uploadFileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255, "File name cannot exceed 255 characters"),

  originalName: z.string().min(1, "Original file name is required"),

  mimeType: z
    .string()
    .refine(
      (type) => ALLOWED_FILE_TYPES.includes(type),
      "File type not allowed"
    ),

  size: z
    .number()
    .positive("File size must be greater than 0")
    .max(MAX_FILE_SIZE, "File size exceeds 100MB limit"),

  extension: z.string().min(1, "File extension is required"),

  // ✅ FIX: Add path and url to schema
  path: z.string().min(1, "File path is required"),
  
  url: z.string().min(1, "File URL is required"),

  folder: z.string().optional().nullable(),

  tags: z.array(z.string().trim()).optional().default([]),
});

export const updateFileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255, "File name cannot exceed 255 characters")
    .optional(),

  folder: z.string().optional().nullable(),

  tags: z.array(z.string().trim()).optional(),

  isStarred: z.boolean().optional(),
});