import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const postId = searchParams.get('postId');
    if (storyId) {
      if (isNaN(parseInt(storyId))) {
        return NextResponse.json({ error: "Valid Story ID is required" }, { status: 400 });
      }

      const likes = await prisma.storyLike.findMany({
        where: { storyId: parseInt(storyId) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50 
      });

      return NextResponse.json({ likes });
    }
    if (postId) {
      if (isNaN(parseInt(postId))) {
        return NextResponse.json({ error: "Valid Post ID is required" }, { status: 400 });
      }

      const likes = await prisma.postLike.findMany({
        where: { postId: parseInt(postId) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50 
      });

      return NextResponse.json({ likes });
    }

    return NextResponse.json({ error: "Either storyId or postId is required" }, { status: 400 });
  } catch (error) {
    console.error("Get likes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}