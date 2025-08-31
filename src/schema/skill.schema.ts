import { idSchema } from "@/schema/common.schema";
import { z } from "zod";

export const skillSchema = z
  .string({ error: "skill name is required" })
  .min(3, "skill length must be atleast 3 characters long")
  .max(30, "skill length must be less than 30 characters");

export type SkillSchema = z.infer<typeof skillSchema>;

export const skillSchemaDTO = z.object(
  {
    id: idSchema,
    name: z
      .string({ error: "skill name is required" })
      .min(3, "skill length must be atleast 3 characters long")
      .max(30, "skill length must be less than 30 characters"),
    createdAt: z.date(),
    updatedAt: z.date(),
  },
  { error: "Valid data is required" }
);

export type SkillSchemaDTO = z.infer<typeof skillSchemaDTO>;
