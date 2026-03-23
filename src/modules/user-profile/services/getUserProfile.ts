import { prisma } from "@/src/lib/db";
import type { JWTPayload } from "@/src/lib/auth";

export async function getUserProfile(username: string, currentUser: JWTPayload | null) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      createdAt: true,
      posts: {
        select: {
          id: true,
          content: true,
          imageUrl: true,
          likes: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }
  let isFollowing = false;
  if (currentUser) {
    const followRelation = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(currentUser.userId),
          followingId: user.id,
        },
      },
    });
    isFollowing = !!followRelation;
  }
  const isOwnProfile = currentUser?.username === username;

  return {
    ...user,
    isFollowing,
    isOwnProfile,
  };
}
