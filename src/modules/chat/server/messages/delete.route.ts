import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { deleteMessage } from "@/src/modules/chat/services/deleteMessage";

export async function DELETE(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(payload.userId);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageIdParam = searchParams.get("messageId");
    const messageId = messageIdParam ? Number(messageIdParam) : NaN;

    if (!Number.isFinite(messageId)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    const success = await deleteMessage(messageId, userId);

    if (!success) {
      return NextResponse.json(
        { error: "Message not found or you don't have permission" },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
