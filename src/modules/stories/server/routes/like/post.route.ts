import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId } = await request.json();

    if (!storyId || isNaN(parseInt(storyId))) {
      return NextResponse.json({ error: "Valid Story ID is required" }, { status: 400 });
    }

    const storyIdNum = parseInt(storyId);
    const userIdNum = parseInt(payload.userId);
    const existingLike = await prisma.storyLike.findUnique({
      where: {
        userId_storyId: {
          userId: userIdNum,
          storyId: storyIdNum
        }
      }
    });

    if (existingLike) {
      await prisma.storyLike.delete({
        where: {
          userId_storyId: {
            userId: userIdNum,
            storyId: storyIdNum
          }
        }
      });
      return NextResponse.json({ message: "Story unliked successfully" });
    } else {
      const like = await prisma.storyLike.create({
        data: {
          userId: userIdNum,
          storyId: storyIdNum,
        },
      });
      return NextResponse.json({ message: "Story liked successfully", like }, { status: 201 });
    }
  } catch (error) {
    console.error("Story like error:", error);
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "Already liked" }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
