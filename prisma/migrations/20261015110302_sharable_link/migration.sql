/*
  Warnings:

  - A unique constraint covering the columns `[uploadLinkId]` on the table `UplinkAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."UplinkAsset" ADD COLUMN     "uploadLinkId" UUID;

-- CreateTable
CREATE TABLE "public"."UplinkUploadLink" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UplinkUploadLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UplinkUploadLink_tokenHash_key" ON "public"."UplinkUploadLink"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "UplinkAsset_uploadLinkId_key" ON "public"."UplinkAsset"("uploadLinkId");

-- AddForeignKey
ALTER TABLE "public"."UplinkAsset" ADD CONSTRAINT "UplinkAsset_uploadLinkId_fkey" FOREIGN KEY ("uploadLinkId") REFERENCES "public"."UplinkUploadLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
