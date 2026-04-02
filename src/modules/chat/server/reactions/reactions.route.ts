import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

function authUserId(request: NextRequest): number | null {
  const payload = verifyToken(request);
  if (!payload) return null;
  const id = Number(payload.userId);
  return Number.isFinite(id) ? id : null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = authUserId(request);
    if (userId == null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, emoji } = body as { messageId?: unknown; emoji?: unknown };

    if (messageId == null || emoji == null || String(emoji).trim() === "") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mid = typeof messageId === "number" ? messageId : parseInt(String(messageId), 10);
    if (!Number.isFinite(mid)) {
      return NextResponse.json({ error: "Invalid messageId" }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: mid },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const reaction = await prisma.messageReaction.upsert({
      where: {
        messageId_userId: {
          messageId: mid,
          userId,
        },
      },
      update: {
        emoji: String(emoji),
        messageOwnerId: message.senderId,
      },
      create: {
        messageId: mid,
        userId,
        emoji: String(emoji),
        messageOwnerId: message.senderId,
      },
    });

    return NextResponse.json(reaction);
  } catch (error) {
    console.error("Error adding reaction:", error);
    return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = authUserId(request);
    if (userId == null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId } = body as { messageId?: unknown };

    if (messageId == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mid = typeof messageId === "number" ? messageId : parseInt(String(messageId), 10);
    if (!Number.isFinite(mid)) {
      return NextResponse.json({ error: "Invalid messageId" }, { status: 400 });
    }

    await prisma.messageReaction.deleteMany({
      where: {
        messageId: mid,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing reaction:", error);
    return NextResponse.json({ error: "Failed to remove reaction" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (authUserId(request) == null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");
    const messageIds = searchParams.get("messageIds");

    if (!messageId && !messageIds) {
      return NextResponse.json({ error: "Message ID(s) is required" }, { status: 400 });
    }

    if (messageIds) {
      const messageIdArray = messageIds
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((n) => Number.isFinite(n));

      if (messageIdArray.length === 0) {
        return NextResponse.json([]);
      }

      const reactions = await prisma.messageReaction.findMany({
        where: {
          messageId: { in: messageIdArray },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const groupedReactions: Record<number, Array<{
        messageId: number;
        emoji: string;
        userId: number;
        user: { id: number; username: string; imageUrl: string | null };
      }>> = {};

      reactions.forEach((reaction) => {
        if (!groupedReactions[reaction.messageId]) {
          groupedReactions[reaction.messageId] = [];
        }
        groupedReactions[reaction.messageId].push({
          messageId: reaction.messageId,
          emoji: reaction.emoji,
          userId: reaction.userId,
          user: reaction.user,
        });
      });

      return NextResponse.json(Object.values(groupedReactions));
    }

    const singleId = parseInt(messageId!, 10);
    const reactions = await prisma.messageReaction.findMany({
      where: {
        messageId: singleId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const withIds = reactions.map((r) => ({
      messageId: r.messageId,
      emoji: r.emoji,
      userId: r.userId,
      user: r.user,
    }));

    return NextResponse.json([withIds]);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 });
  }
}
