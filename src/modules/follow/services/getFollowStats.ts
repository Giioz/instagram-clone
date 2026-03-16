import { prisma } from "@/src/lib/db";
import type { JWTPayload } from "@/src/lib/auth";

export async function getFollowStats(userId: string, currentUser?: JWTPayload | null) {
  try {
    const targetUserId = parseInt(userId);
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: { followingId: targetUserId },
      }),
      prisma.follow.count({
        where: { followerId: targetUserId },
      }),
    ]);

    let isFollowing = false;
    if (currentUser && parseInt(currentUser.userId) !== targetUserId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: parseInt(currentUser.userId),
            followingId: targetUserId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return {
      followersCount,
      followingCount,
      isFollowing,
    };
  } catch (error) {
    console.error("Error getting follow stats:", error);
    throw error;
  }
}
