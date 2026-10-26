import z from "zod";

export const idSchema = z.uuid({ error: "Valid id is required" });
export const nanoidSchema = z.nanoid();

export type IDSchema = z.infer<typeof idSchema>;
