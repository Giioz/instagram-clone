import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { getMessagesBetween } from "@/src/modules/chat/services/getMessages";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const me = Number(payload.userId);
    const peerParam = request.nextUrl.searchParams.get("peerId");
    const peerId = peerParam ? Number(peerParam) : NaN;
    if (!Number.isFinite(me) || !Number.isFinite(peerId) || peerId === me) {
      return NextResponse.json({ error: "Invalid peer" }, { status: 400 });
    }

    const messages = await getMessagesBetween(me, peerId);
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
