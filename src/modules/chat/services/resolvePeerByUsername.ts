import { prisma } from "@/src/lib/db";
import type { ChatUserBrief } from "@/src/modules/chat/types";

export async function resolvePeerByUsername(
  me: number,
  username: string,
): Promise<ChatUserBrief | null> {
  const u = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: me },
    },
    select: { id: true, username: true, name: true, imageUrl: true },
  });
  return u;
}
