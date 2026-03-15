import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');

    if (!storyId || isNaN(parseInt(storyId))) {
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
  } catch (error) {
    console.error("Get story likes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}