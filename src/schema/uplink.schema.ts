import z from "zod";

// The current upload flow uses one S3 PutObject request. Larger assets can use
// multipart uploads when that flow is added.
export const MAX_UPLINK_SINGLE_UPLOAD_BYTES = 5 * 1024 ** 3 - 5 * 1024 ** 2; // 5GB

export const uplinkPublicNameSchema = z
  .string()
  .trim()
  .min(1, "Link name is required")
  .max(180, "Link name must be 180 characters or fewer")
  .regex(
    /^[A-Za-z0-9](?:[A-Za-z0-9._-]{0,178}[A-Za-z0-9])?$/,
    "Use letters, numbers, dots, underscores, or hyphens; do not include a path",
  );

export const uplinkUploadRequestSchema = z.object({
  publicName: uplinkPublicNameSchema,
  originalName: z.string().trim().min(1).max(255),
  contentType: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+$/),
  size: z
    .number()
    .int()
    .min(0)
    .max(
      MAX_UPLINK_SINGLE_UPLOAD_BYTES,
      "File exceeds the single-upload limit",
    ),
});

export type UplinkUploadRequest = z.infer<typeof uplinkUploadRequestSchema>;

export const uplinkUploadLinkRequestSchema = z.object({
  name: z.string().trim().min(1, "Link name is required").max(100),
  expiresInMinutes: z.number().int().min(5).max(5 * 24 * 60),
});

export type UplinkUploadLinkRequest = z.infer<
  typeof uplinkUploadLinkRequestSchema
>;
