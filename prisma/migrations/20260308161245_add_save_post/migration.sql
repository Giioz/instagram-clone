-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '24 hours');

-- CreateTable
CREATE TABLE "SavePost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavePost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavePost_userId_postId_key" ON "SavePost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "SavePost" ADD CONSTRAINT "SavePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavePost" ADD CONSTRAINT "SavePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
