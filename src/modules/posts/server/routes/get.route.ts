import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor');
    
    const posts = await prisma.post.findMany({
      where: userId ? { userId: parseInt(userId) } : undefined,
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: parseInt(cursor)
        }
      }),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            savedBy: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id.toString() : null;

    return NextResponse.json({
      posts,
      nextCursor
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
