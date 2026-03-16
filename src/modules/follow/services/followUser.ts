import { prisma } from "@/src/lib/db";
import type { JWTPayload } from "@/src/lib/auth";

export async function followUser(followingId: string, payload: JWTPayload) {
  try {
    console.log("followUser called", { followingId, payload });
    const followerId = parseInt(payload.userId);
    const followingUserId = parseInt(followingId);
    
    console.log("Parsed IDs:", { followerId, followingUserId });
    if (followerId === followingUserId) {
      console.log("Cannot follow yourself");
      throw new Error("You cannot follow yourself");
    }
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: followingUserId,
        },
      },
    });

    if (existingFollow) {
      console.log("Already following");
      throw new Error("Already following this user");
    }
    console.log("Creating follow relationship");
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId: followingUserId,
      },
    });

    console.log("Follow created successfully:", follow);
    return { success: true, follow };
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}
