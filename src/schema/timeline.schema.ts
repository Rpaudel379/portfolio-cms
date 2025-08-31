import { idSchema } from "@/schema/common.schema";
import { z } from "zod";

export const timelineTypeEnum = z.enum(
  ["EDUCATION", "WORK", "PROJECT", "ACHIEVEMENT", "FREELANCE"],
  { error: "Valid type is required" }
);

export type TimelineTypeEnum = z.infer<typeof timelineTypeEnum>;

export const timelineSchema = z.object(
  {
    year: z
      .string({
        error: "year is required",
      })
      .min(4, "valid date is required")
      .max(4, "valid date is required"),
    title: z
      .string()
      .min(3, "Title is very small")
      .max(90, "Title is too long"),
    company: z.string().max(90, "Company name is too long").nullish(),
    description: z
      .string({ error: "description is required" })
      .min(5, "Description is too short")
      .max(500, "Description is too long"),
    work_type: timelineTypeEnum,
    skills: z.string().max(100, "Skills are too long").nullish(),
  },
  { error: "Valid Timeline data is required" }
);

export type TimelineSchema = z.infer<typeof timelineSchema>;

export const timeSchemaDTO = timelineSchema.extend({
  id: idSchema,
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type TimelineSchemaDTO = z.infer<typeof timeSchemaDTO>;
