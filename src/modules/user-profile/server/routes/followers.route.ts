import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/src/lib/auth';
import { getFollowers } from '../../services/follow-list.service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await context.params;
    const parsedUserId = parseInt(userId);
    const currentUserId = parseInt(tokenData.userId);
    
    const followers = await getFollowers(parsedUserId, currentUserId);
    return NextResponse.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
