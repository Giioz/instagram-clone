import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import { getConversationsForUser } from "../../../../modules/chat/services/getConversations";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const me = Number(payload.userId);
    if (!Number.isFinite(me)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await getConversationsForUser(me);
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
