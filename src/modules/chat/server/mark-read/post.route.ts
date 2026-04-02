import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { markConversationRead } from "@/src/modules/chat/services/markPeerRead";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const me = Number(payload.userId);
    const body = await request.json().catch(() => null);
    const peerId = body?.peerId != null ? Number(body.peerId) : NaN;
    if (!Number.isFinite(me) || !Number.isFinite(peerId) || peerId === me) {
      return NextResponse.json({ error: "Invalid peer" }, { status: 400 });
    }

    await markConversationRead(me, peerId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
