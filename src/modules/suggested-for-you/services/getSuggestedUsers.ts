import { prisma } from "@/src/lib/db";
import type { MutualPreviewUser, SuggestedUser } from "../types";
export async function getSuggestedUsers(currentUserId: number): Promise<SuggestedUser[]> {
  try {
    const followingRows = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    const followingIds = followingRows.map((f) => f.followingId);

    const followerRows = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followerId: true },
    });
    const followerIds = followerRows.map((f) => f.followerId);

    const networkIds = [...new Set([...followingIds, ...followerIds])];
    if (networkIds.length === 0) {
      return [];
    }

    const candidates = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
          ...(followingIds.length > 0 ? { notIn: followingIds } : {}),
        },
      },
      select: { id: true, username: true, name: true, imageUrl: true },
      take: 120,
      orderBy: { id: "desc" },
    });

    if (candidates.length === 0) return [];

    const candidateIds = candidates.map((c) => c.id);
    const counts = new Map<number, number>();
    const previewByTarget = new Map<number, MutualPreviewUser[]>();

    const mutualFollows = await prisma.follow.findMany({
      where: {
        followingId: { in: candidateIds },
        followerId: { in: networkIds },
      },
      include: {
        follower: {
          select: { id: true, username: true, imageUrl: true },
        },
      },
    });

    for (const row of mutualFollows) {
      const tid = row.followingId;
      counts.set(tid, (counts.get(tid) ?? 0) + 1);
      const list = previewByTarget.get(tid) ?? [];
      if (list.length < 2) {
        list.push({
          id: row.follower.id,
          username: row.follower.username,
          imageUrl: row.follower.imageUrl,
        });
        previewByTarget.set(tid, list);
      }
    }

    const enriched: SuggestedUser[] = candidates
      .map((c) => ({
        ...c,
        mutualCount: counts.get(c.id) ?? 0,
        mutualPreview: previewByTarget.get(c.id) ?? [],
      }))
      .filter((c) => c.mutualCount > 0);

    enriched.sort((a, b) => b.mutualCount - a.mutualCount);
    return enriched.slice(0, 7);
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return [];
  }
}
