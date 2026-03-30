import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { getFollowingContacts } from "@/src/modules/chat/services/getFollowingContacts";
import { getConversationsForUser } from "@/src/modules/chat/services/getConversations";
import { getMessagesBetween } from "@/src/modules/chat/services/getMessages";
import { markConversationRead } from "@/src/modules/chat/services/markPeerRead";
import { resolvePeerByUsername } from "@/src/modules/chat/services/resolvePeerByUsername";

export async function getContacts(request: NextRequest) {
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
export async function getConversations(request: NextRequest) {
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
export async function getMessages(request: NextRequest) {
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
export async function markRead(request: NextRequest) {
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
export async function getPeer(request: NextRequest) {
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
