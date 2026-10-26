export type UploadAssetDTO = {
  id: string;
  publicName: string;
  originalName: string;
  contentType: string;
  sizeBytes: string;
  storageUrl: string;
  status: "PENDING" | "READY";
  source: "SHARED" | "DASHBOARD";
  createdAt: string;
};

export type UploadLinkDTO = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  status: "ACTIVE" | "EXPIRED" | "USED";
};
