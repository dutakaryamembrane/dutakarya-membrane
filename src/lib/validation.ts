import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "EDITOR"]);
export const MediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);
export const MediaSourceSchema = z.enum(["UPLOAD", "EXTERNAL"]);

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const ProjectSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  client: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  completionDate: z.string().or(z.date()).optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  area: z.string().optional().nullable(),
  structure: z.string().optional().nullable(),
  membrane: z.string().optional().nullable(),
  technicalNotes: z.string().optional().nullable(),
  seoTitle: z.string().max(60, "SEO Title maksimal 60 karakter").optional().nullable(),
  seoDescription: z.string().max(160, "SEO Description maksimal 160 karakter").optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const MaterialSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  category: z.string().min(2, "Kategori wajib diisi"),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  datasheetId: z.string().optional().nullable(),
  specifications: z.record(z.string(), z.any()).optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  productCode: z.string().optional().nullable(),
  advantages: z.string().optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().max(60).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const MediaSchema = z.object({
  type: MediaTypeSchema,
  source: MediaSourceSchema.default("UPLOAD"),
  url: z.string().url("URL tidak valid"),
  publicId: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  duration: z.number().int().optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  externalUrl: z.string().url().optional().nullable(),
  altText: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
});
