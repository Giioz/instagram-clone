/*
  Warnings:

  - Added the required column `messageOwnerId` to the `MessageReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageReaction" ADD COLUMN     "messageOwnerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VerifyEmail" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerifyEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyEmail_userEmail_key" ON "VerifyEmail"("userEmail");
