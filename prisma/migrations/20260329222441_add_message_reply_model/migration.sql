-- CreateTable
CREATE TABLE "CommentReply" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReply" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "replyToId" INTEGER NOT NULL,
    "replyToText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentReply_commentId_createdAt_idx" ON "CommentReply"("commentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReply_messageId_key" ON "MessageReply"("messageId");

-- CreateIndex
CREATE INDEX "MessageReply_replyToId_idx" ON "MessageReply"("replyToId");

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReply" ADD CONSTRAINT "MessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReply" ADD CONSTRAINT "MessageReply_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
