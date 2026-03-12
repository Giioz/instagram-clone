import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/library/auth";
import { prisma } from "@/src/library/db";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    const existingSave = await prisma.savePost.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(payload.userId),
          postId: parseInt(postId)
        }
      }
    });

    if (existingSave) {
      return NextResponse.json(
        { error: "Post already saved" },
        { status: 409 }
      );
    }
    const savePost = await prisma.savePost.create({
      data: {
        userId: parseInt(payload.userId),
        postId: parseInt(postId),
      },
    });

    return NextResponse.json({ message: "Post saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Save post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
