import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/src/lib/auth';
import { prisma } from '@/src/lib/db';

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { storyId } = body;

    if (!storyId) {
      return NextResponse.json({ error: 'storyId is required' }, { status: 400 });
    }
    const story = await prisma.story.findUnique({
      where: { id: parseInt(storyId) }
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    await prisma.storySeen.upsert({
      where: {
        userId_storyId: {
          userId: parseInt(payload.userId),
          storyId: parseInt(storyId)
        }
      },
      update: {},
      create: {
        userId: parseInt(payload.userId),
        storyId: parseInt(storyId)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking story as seen:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');

    if (!storyId) {
      return NextResponse.json({ error: 'storyId is required' }, { status: 400 });
    }

    const seen = await prisma.storySeen.findUnique({
      where: {
        userId_storyId: {
          userId: parseInt(payload.userId),
          storyId: parseInt(storyId)
        }
      }
    });

    return NextResponse.json({ seen: !!seen });
  } catch (error) {
    console.error('Error checking if story is seen:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
