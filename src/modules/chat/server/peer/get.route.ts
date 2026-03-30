import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { resolvePeerByUsername } from "@/src/modules/chat/services/resolvePeerByUsername";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const me = Number(payload.userId);
    const username = request.nextUrl.searchParams.get("username")?.trim();
    if (!username) {
      return NextResponse.json({ error: "username required" }, { status: 400 });
    }

    const user = await resolvePeerByUsername(me, username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
