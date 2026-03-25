import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await verifyToken(request);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const [comment, existingLike] = await Promise.all([
        tx.comment.findUnique({
          where: { id: parseInt(commentId) },
        }),
        tx.commentLike.findUnique({
          where: {
            userId_commentId: {
              userId: parseInt(session.userId),
              commentId: parseInt(commentId),
            },
          },
        }),
      ]);

      if (!comment) {
        throw new Error("Comment not found");
      }

      let liked: boolean;

      if (existingLike) {
        await tx.commentLike.delete({
          where: {
            userId_commentId: {
              userId: parseInt(session.userId),
              commentId: parseInt(commentId),
            },
          },
        });
        liked = false;
      } else {
        await tx.commentLike.create({
          data: {
            userId: parseInt(session.userId),
            commentId: parseInt(commentId),
          },
        });
        liked = true;
      }
      const likeCount = await tx.commentLike.count({
        where: { commentId: parseInt(commentId) },
      });

      return { liked, likeCount };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error toggling comment like:", error);
    if (error instanceof Error && error.message === "Comment not found") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
