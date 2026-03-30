import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { getFollowingContacts } from "@/src/modules/chat/services/getFollowingContacts";

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

    const contacts = await getFollowingContacts(me);
    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
