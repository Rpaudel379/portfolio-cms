-- CreateEnum
CREATE TYPE "public"."UplinkAssetStatus" AS ENUM ('PENDING', 'READY');

-- CreateTable
CREATE TABLE "public"."UplinkAsset" (
    "id" UUID NOT NULL,
    "publicName" VARCHAR(180) NOT NULL,
    "bucketName" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "status" "public"."UplinkAssetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UplinkAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UplinkAsset_publicName_key" ON "public"."UplinkAsset"("publicName");

-- CreateIndex
CREATE UNIQUE INDEX "UplinkAsset_bucketName_objectKey_key" ON "public"."UplinkAsset"("bucketName", "objectKey");
