import "server-only";

const REQUIRED_R2_ENV_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "UPLINK_PUBLIC_BASE_URL",
] as const;

export const UPLINK_OBJECT_PREFIX = "uplink";

export type UplinkConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

/**
 * Return null when Uplink has not been configured. If configuration is only
 * partially present, fail with the missing variable names instead of silently
 * creating a broken storage client.
 */
export const getUplinkConfig = (): UplinkConfig | null => {
  const values = REQUIRED_R2_ENV_VARS.map((name) => [
    name,
    process.env[name]?.trim(),
  ] as const);

  if (values.every(([, value]) => !value)) {
    return null;
  }

  const missing = values
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing Uplink configuration: ${missing.join(", ")}`);
  }

  const config = Object.fromEntries(values) as Record<
    (typeof REQUIRED_R2_ENV_VARS)[number],
    string
  >;

  let publicBaseUrl: URL;
  try {
    publicBaseUrl = new URL(config.UPLINK_PUBLIC_BASE_URL);
  } catch {
    throw new Error("UPLINK_PUBLIC_BASE_URL must be a valid absolute URL");
  }

  return {
    accountId: config.R2_ACCOUNT_ID,
    accessKeyId: config.R2_ACCESS_KEY_ID,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    bucketName: config.R2_BUCKET_NAME,
    publicBaseUrl: publicBaseUrl.toString().replace(/\/$/, ""),
  };
};

/** Prefix every Uplink object so other R2 features can use separate prefixes. */
export const getUplinkObjectKey = (key: string) => {
  const relativeKey = key.replace(/^\/+/, "");
  const segments = relativeKey.split("/");

  if (
    !relativeKey ||
    relativeKey.includes("\\") ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new Error("Uplink object keys must be valid relative paths");
  }

  return `${UPLINK_OBJECT_PREFIX}/${relativeKey}`;
};

/** Build the public custom-domain URL for a complete R2 object key. */
export const getUplinkPublicUrl = (objectKey: string) => {
  const config = getUplinkConfig();
  if (!config) return null;

  const segments = objectKey.split("/");
  if (
    segments[0] !== UPLINK_OBJECT_PREFIX ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new Error(
      `Uplink object keys must be inside the ${UPLINK_OBJECT_PREFIX}/ prefix`,
    );
  }

  const encodedKey = segments.map(encodeURIComponent).join("/");
  return `${config.publicBaseUrl}/${encodedKey}`;
};
