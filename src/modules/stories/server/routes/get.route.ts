import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { verifyToken } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const currentUser = verifyToken(request);
    
    let stories;
    
    if (currentUser) {
      const currentUserId = parseInt(currentUser.userId);

      const followedUsers = await prisma.follow.findMany({
        where: {
          followerId: currentUserId
        },
        select: {
          followingId: true
        }
      });

      const followedUserIds = followedUsers.map(f => f.followingId);
      followedUserIds.push(currentUserId); // Include current user
      
      stories = await prisma.story.findMany({
        where: {
          expiresAt: {
            gt: new Date(),
          },
          userId: {
            in: followedUserIds
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, 
      });
    } else {
      stories = await prisma.story.findMany({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });
    }

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Get stories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}