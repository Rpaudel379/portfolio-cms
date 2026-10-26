/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `UplinkUploadLink` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."UplinkUploadLink_tokenHash_key";

-- CreateIndex
CREATE UNIQUE INDEX "UplinkUploadLink_token_key" ON "public"."UplinkUploadLink"("token");
