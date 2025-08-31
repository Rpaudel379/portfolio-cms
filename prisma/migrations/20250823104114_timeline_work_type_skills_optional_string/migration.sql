-- AlterTable
ALTER TABLE "public"."Timeline" ALTER COLUMN "skills" DROP NOT NULL,
ALTER COLUMN "skills" SET DATA TYPE TEXT;
