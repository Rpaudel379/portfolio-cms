-- CreateEnum
CREATE TYPE "public"."TimelineType" AS ENUM ('EDUCATION', 'WORK', 'PROJECT', 'ACHIEVEMENT', 'FREELANCE');

-- CreateTable
CREATE TABLE "public"."Timeline" (
    "id" UUID NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "description" TEXT NOT NULL,
    "type" "public"."TimelineType" NOT NULL,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);
