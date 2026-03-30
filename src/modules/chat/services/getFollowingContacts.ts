import { prisma } from "@/src/lib/db";
import type { ChatUserBrief } from "@/src/modules/chat/types";

export async function getFollowingContacts(me: number): Promise<ChatUserBrief[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: me },
    include: {
      following: {
        select: { id: true, username: true, name: true, imageUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return follows.map((f) => ({
    id: f.following.id,
    username: f.following.username,
    name: f.following.name,
    imageUrl: f.following.imageUrl,
  }));
}
