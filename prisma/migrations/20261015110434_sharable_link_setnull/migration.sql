-- DropForeignKey
ALTER TABLE "public"."UplinkAsset" DROP CONSTRAINT "UplinkAsset_uploadLinkId_fkey";

-- AddForeignKey
ALTER TABLE "public"."UplinkAsset" ADD CONSTRAINT "UplinkAsset_uploadLinkId_fkey" FOREIGN KEY ("uploadLinkId") REFERENCES "public"."UplinkUploadLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
