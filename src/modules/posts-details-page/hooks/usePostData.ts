import { prisma } from "@/src/lib/db";
import { verifyTokenString } from "@/src/lib/auth";
import { cookies } from "next/headers";

export async function getPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(postId) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  return post;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  
  const payload = verifyTokenString(token);
  if (!payload) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: parseInt(payload.userId) },
  });
  
  return user;
}

export async function checkIfUserSavedPost(postId: string, userId: number | null) {
  if (!userId) return false;
  
  const savedPost = await prisma.savePost.findFirst({
    where: {
      postId: parseInt(postId),
      userId: userId,
    },
  });

  return !!savedPost;
}

export async function checkIfUserIsFollowing(postUserId: number, currentUserId: number | null) {
  if (!currentUserId || postUserId === currentUserId) return false;
  
  const follow = await prisma.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: postUserId,
    },
  });

  return !!follow;
}
