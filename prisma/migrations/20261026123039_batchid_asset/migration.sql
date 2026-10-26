-- AlterTable
ALTER TABLE "public"."UplinkAsset" ADD COLUMN     "batchId" TEXT;

-- CreateIndex
CREATE INDEX "UplinkAsset_batchId_idx" ON "public"."UplinkAsset"("batchId");
