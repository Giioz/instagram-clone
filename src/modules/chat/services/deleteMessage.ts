import { prisma } from "@/src/lib/db";

export async function deleteMessage(messageId: number, userId: number): Promise<boolean> {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return false;
  }
  if (message.senderId !== userId) {
    return false;
  }

  await prisma.message.delete({
    where: { id: messageId },
  });

  return true;
}
