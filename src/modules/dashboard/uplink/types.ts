export type UploadAssetDTO = {
  id: string;
  publicName: string;
  originalName: string;
  contentType: string;
  sizeBytes: string;
  storageUrl: string;
  status: "PENDING" | "READY";
  createdAt: string;
};
