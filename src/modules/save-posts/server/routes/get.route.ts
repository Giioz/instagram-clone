import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const savedPosts = await prisma.savePost.findMany({
      where: {
        userId: parseInt(payload.userId)
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const posts = savedPosts.map(savePost => ({
      ...savePost.post,
      isSaved: true
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Get saved posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
