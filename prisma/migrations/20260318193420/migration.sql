-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '24 hours');

-- CreateIndex
CREATE INDEX "Story_expiresAt_idx" ON "Story"("expiresAt");

-- CreateIndex
CREATE INDEX "Story_userId_createdAt_idx" ON "Story"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Story_createdAt_idx" ON "Story"("createdAt");
