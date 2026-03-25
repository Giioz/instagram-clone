import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function DELETE(request: NextRequest) {
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
      include: { post: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    const isCommentOwner = comment.userId === parseInt(session.userId);
    const isPostOwner = comment.post.userId === parseInt(session.userId);

    if (!isCommentOwner && !isPostOwner) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}