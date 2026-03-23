import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/modules/common/lib/auth";
import { prisma } from "@/src/modules/common/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    const deletedSave = await prisma.savePost.deleteMany({
      where: {
        userId: parseInt(payload.userId),
        postId: parseInt(postId)
      }
    });

    if (deletedSave.count === 0) {
      return NextResponse.json(
        { error: "Post was not saved" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error("Unsave post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
