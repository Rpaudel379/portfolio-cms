/*
  Warnings:

  - You are about to drop the column `type` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `work_type` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."WorkType" AS ENUM ('EDUCATION', 'WORK', 'PROJECT', 'ACHIEVEMENT', 'FREELANCE');

-- AlterTable
ALTER TABLE "public"."Timeline" DROP COLUMN "type",
ADD COLUMN     "work_type" "public"."WorkType" NOT NULL;

-- DropEnum
DROP TYPE "public"."TimelineType";
