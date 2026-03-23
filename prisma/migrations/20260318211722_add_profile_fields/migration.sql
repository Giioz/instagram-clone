/*
  Warnings:

  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'CUSTOM', 'PREFER_NOT_TO_SAY');

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followingId_fkey";

-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '24 hours');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(150),
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'PREFER_NOT_TO_SAY',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "Follow";
