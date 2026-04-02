import { prisma } from "@/src/lib/db";

export async function markConversationRead(me: number, peerId: number) {
  await prisma.message.updateMany({
    where: { senderId: peerId, receiverId: me, readAt: null },
    data: { readAt: new Date() },
  });
}
