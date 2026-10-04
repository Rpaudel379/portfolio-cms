import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { getUplinkConfig, type UplinkConfig } from "@/lib/uplink/config";

type GlobalWithUplinkClient = typeof globalThis & {
  uplinkR2Client?: S3Client;
};

const globalForUplink = globalThis as GlobalWithUplinkClient;

export type UplinkStorage = {
  client: S3Client;
  bucketName: string;
  publicBaseUrl: string;
};

const getOrCreateClient = (config: UplinkConfig) => {
  if (!globalForUplink.uplinkR2Client) {
    globalForUplink.uplinkR2Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return globalForUplink.uplinkR2Client;
};

/**
 * Get the lazy R2 connection details. Returns null when Uplink is optional
 * and has not been configured in this environment.
 */
export const getUplinkStorage = (): UplinkStorage | null => {
  const config = getUplinkConfig();
  if (!config) return null;

  return {
    client: getOrCreateClient(config),
    bucketName: config.bucketName,
    publicBaseUrl: config.publicBaseUrl,
  };
};
