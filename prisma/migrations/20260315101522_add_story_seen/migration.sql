-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '24 hours');

-- CreateTable
CREATE TABLE "StorySeen" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "storyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorySeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorySeen_userId_storyId_key" ON "StorySeen"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "StorySeen" ADD CONSTRAINT "StorySeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySeen" ADD CONSTRAINT "StorySeen_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
