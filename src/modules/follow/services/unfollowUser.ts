import { prisma } from "@/src/lib/db";
import type { JWTPayload } from "@/src/lib/auth";

export async function unfollowUser(followingId: string, payload: JWTPayload) {
  try {
    const followerId = parseInt(payload.userId);
    const followingUserId = parseInt(followingId);

    console.log("unfollowUser called", { followerId, followingUserId });
    const follow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: followingUserId,
        },
      },
    });

    console.log("Unfollow successful:", follow);
    return { success: true, follow };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      throw new Error("You are not following this user");
    }
    throw error;
  }
}
