import { idSchema } from "@/schema/common.schema";
import z from "zod";

export const contactSchema = z.object(
  {
    email: z.email({ error: "Valid email address is required" }),
    phone: z.string({ error: "Valid mobile number is required" }),
    location: z.string({ error: "Valid field is required" }),
  },
  { error: "Valid data is required" },
);

export type ContactSchema = z.infer<typeof contactSchema>;

export const contactSchemaDTO = contactSchema.extend({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ContactSchemaDTO = z.infer<typeof contactSchemaDTO>;
