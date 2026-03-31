import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { getSuggestedUsers } from "@/src/modules/suggested-for-you/services/getSuggestedUsers";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = Number(payload.userId);
    if (!Number.isFinite(currentUserId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestedUsers = await getSuggestedUsers(currentUserId);

    return NextResponse.json({ suggestedUsers });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return NextResponse.json({ error: "Failed to fetch suggested users" }, { status: 500 });
  }
}
