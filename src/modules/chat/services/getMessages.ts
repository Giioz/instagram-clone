import { prisma } from "@/src/lib/db";
import type { ChatMessageDTO } from "@/src/modules/chat/types";

export async function getMessagesBetween(
  me: number,
  peerId: number,
  limit = 200,
): Promise<ChatMessageDTO[]> {
  const rows = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me, receiverId: peerId },
        { senderId: peerId, receiverId: me },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: { 
      reply: { 
        select: { 
          replyToId: true, 
          replyToText: true,
          replyTo: {
            select: {
              id: true,
              senderId: true,
              receiverId: true,
              text: true,
              createdAt: true,
              readAt: true,
            }
          }
        } 
      } 
    },
  });

  return rows.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    readAt: m.readAt ? m.readAt.toISOString() : null,
    replyToId: m.reply?.replyToId ?? null,
    replyToText: m.reply?.replyToText ?? null,
    replyTo: m.reply?.replyTo ? {
      id: m.reply.replyTo.id,
      senderId: m.reply.replyTo.senderId,
      receiverId: m.reply.replyTo.receiverId,
      text: m.reply.replyTo.text,
      createdAt: m.reply.replyTo.createdAt.toISOString(),
      readAt: m.reply.replyTo.readAt ? m.reply.replyTo.readAt.toISOString() : null,
      replyToId: null,
      replyToText: null,
      replyTo: null,
    } : null,
  }));
}
