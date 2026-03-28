import { prisma } from '@/src/lib/db';

export interface FollowUser {
  id: string;
  username: string;
  name: string;
  isFollowing: boolean;
}

export async function getFollowers(userId: number, currentUserId: number): Promise<FollowUser[]> {
  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
        }
      }
    }
  });
  const followersWithFollowStatus = await Promise.all(
    followers.map(async (follow) => {
      const isFollowingBack = await prisma.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: follow.follower.id,
        }
      });

      return {
        id: follow.follower.id.toString(),
        username: follow.follower.username,
        name: follow.follower.name,
        isFollowing: !!isFollowingBack,
      };
    })
  );

  return followersWithFollowStatus;
}

export async function getFollowing(userId: number, currentUserId: number): Promise<FollowUser[]> {
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          name: true,
        }
      }
    }
  });

  const followingWithFollowStatus = await Promise.all(
    following.map(async (follow) => {
      const isFollowing = await prisma.follow.findFirst({
        where: {
          followerId: currentUserId,
          followingId: follow.following.id,
        }
      });

      return {
        id: follow.following.id.toString(),
        username: follow.following.username,
        name: follow.following.name,
        isFollowing: !!isFollowing,
      };
    })
  );

  return followingWithFollowStatus;
}
