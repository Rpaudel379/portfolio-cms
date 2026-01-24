import { idSchema } from "@/schema/common.schema";
import z from "zod";

export const projectStatusEnum = z.enum(
  ["LIVE", "DEVELOPMENT", "COMPLETE", "INPROGRESS", "MAINTENANCE", "ARCHIVED"],
  { error: "This status is invalid" },
);

export type ProjectStatusEnum = z.infer<typeof projectStatusEnum>;

export const projectCategoryEnum = z.enum([
  "Full-Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
]);

export type ProjectCategoryEnum = z.infer<typeof projectCategoryEnum>;

export const projectSchema = z.object(
  {
    title: z
      .string({ error: "Title is required" })
      .min(3, "Title is very small")
      .max(90, "Title is too long"),
    description: z
      .string({ error: "description is required" })
      .min(5, "Description is too short")
      .max(1000, "Description is too long"),
    tags: z.array(z.string()),
    category: projectCategoryEnum,
    status: projectStatusEnum,
    year: z
      .string({ error: "Year is required" })
      .min(4, "valid date is required")
      .max(4, "valid date is required")
      .optional()
      .default(() => new Date().getFullYear().toString()),
    github: z.string().nullish(),
    demo: z.string().nullish(),
    features: z.array(z.string()),
    challenges: z.string().nullish(),
    technologies: z.record(z.string(), z.array(z.string())).nullish(),
    imageFile: z.file().nullish(),
  },
  { error: "Valid Project data is required" },
);

export type ProjectSchema = z.infer<typeof projectSchema>;

export const projectSchemaDTO = projectSchema.extend({
  id: idSchema,
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  thumbnail: z.string().nullish(),
  imageId: z.string().nullish(),
  imagePath: z.string().nullish(),
});

export type ProjectSchemaDTO = z.infer<typeof projectSchemaDTO>;
