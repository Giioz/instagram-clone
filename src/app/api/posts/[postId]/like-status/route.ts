import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;
    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      return NextResponse.json({ error: "Valid Post ID is required" }, { status: 400 });
    }

    const userId = parseInt(payload.userId);

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: postIdNum,
        },
      },
    });
    const post = await prisma.post.findUnique({
      where: { id: postIdNum },
      select: { likes: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      isLiked: !!existingLike,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Get like status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
