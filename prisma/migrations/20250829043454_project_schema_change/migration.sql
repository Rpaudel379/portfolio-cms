-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('LIVE', 'DEVELOPMENT', 'INPROGRESS', 'MAINTENANCE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "public"."Timeline" ALTER COLUMN "work_type" SET DEFAULT 'WORK';

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "category" TEXT NOT NULL,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'INPROGRESS',
    "year" TEXT,
    "github" TEXT,
    "demo" TEXT,
    "features" TEXT[],
    "challenges" TEXT,
    "technologies" JSONB,
    "thumbnail" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
