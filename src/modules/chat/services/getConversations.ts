import { prisma } from "@/src/lib/db";
import type { ConversationSummary } from "@/src/modules/chat/types";

export async function getConversationsForUser(me: number): Promise<ConversationSummary[]> {
  const recent = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { receiverId: me }] },
    orderBy: { createdAt: "desc" },
    take: 800,
    include: {
      sender: { select: { id: true, username: true, name: true, imageUrl: true } },
      receiver: { select: { id: true, username: true, name: true, imageUrl: true } },
    },
  });

  const unreadGroups = await prisma.message.groupBy({
    by: ["senderId"],
    where: { receiverId: me, readAt: null },
    _count: { id: true },
  });
  const unreadBySender = new Map(unreadGroups.map((g) => [g.senderId, g._count.id]));

  const byPeer = new Map<
    number,
    {
      peer: ConversationSummary["peer"];
      lastMessage: ConversationSummary["lastMessage"];
    }
  >();

  for (const m of recent) {
    const peerId = m.senderId === me ? m.receiverId : m.senderId;
    if (byPeer.has(peerId)) continue;
    const peer = m.senderId === me ? m.receiver : m.sender;
    byPeer.set(peerId, {
      peer: {
        id: peer.id,
        username: peer.username,
        name: peer.name,
        imageUrl: peer.imageUrl,
      },
      lastMessage: {
        id: m.id,
        text: m.text,
        createdAt: m.createdAt.toISOString(),
        senderId: m.senderId,
      },
    });
  }

  const summaries: ConversationSummary[] = [...byPeer.entries()].map(([peerId, v]) => ({
    ...v,
    unread: unreadBySender.get(peerId) ?? 0,
  }));

  summaries.sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime(),
  );

  return summaries;
}
