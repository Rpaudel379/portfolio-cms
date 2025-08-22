import z from "zod";

export const idSchema = z.uuid({ error: "Valid id is required" });

export type IDSchema = z.infer<typeof idSchema>;
