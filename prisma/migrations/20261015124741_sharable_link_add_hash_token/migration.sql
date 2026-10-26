/*
  Warnings:

  - You are about to drop the column `revokedAt` on the `UplinkUploadLink` table. All the data in the column will be lost.
  - Added the required column `token` to the `UplinkUploadLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UplinkUploadLink" DROP COLUMN "revokedAt",
ADD COLUMN     "token" TEXT NOT NULL;
