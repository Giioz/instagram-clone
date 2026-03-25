import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await verifyToken(request);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const [likeCount, userLike] = await Promise.all([
      prisma.commentLike.count({
        where: { commentId: parseInt(commentId) },
      }),
      prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: parseInt(session.userId),
            commentId: parseInt(commentId),
          },
        },
      }),
    ]);

    return NextResponse.json({
      likeCount,
      isLiked: !!userLike,
    });
  } catch (error) {
    console.error("Error fetching comment like status:", error);
    return NextResponse.json(
      { error: "Failed to fetch like status" },
      { status: 500 }
    );
  }
}
