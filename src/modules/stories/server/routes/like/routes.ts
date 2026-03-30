import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyToken } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    
    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const likes = await prisma.storyLike.findMany({
      where: { storyId: parseInt(storyId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ likes });
  } catch (error) {
    console.error('Error fetching story likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const storyIdRaw = body.storyId;
    const storyIdNum = parseInt(String(storyIdRaw), 10);
    const userIdNum = parseInt(String(payload.userId), 10);

    if (!storyIdRaw || Number.isNaN(storyIdNum)) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }
    if (Number.isNaN(userIdNum)) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    const existingLike = await prisma.storyLike.findUnique({
      where: {
        userId_storyId: {
          userId: userIdNum,
          storyId: storyIdNum,
        },
      },
    });

    if (existingLike) {
      await prisma.storyLike.delete({
        where: {
          userId_storyId: {
            userId: userIdNum,
            storyId: storyIdNum,
          },
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.storyLike.create({
        data: {
          userId: userIdNum,
          storyId: storyIdNum,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling story like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
