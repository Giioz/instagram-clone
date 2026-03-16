import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { getFollowStats } from "@/src/modules/follow/services/getFollowStats";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const payload = verifyToken(request);
    
    const stats = await getFollowStats(userId, payload);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Follow stats API error:", error);
    return NextResponse.json(
      { error: "Failed to get follow stats" },
      { status: 500 }
    );
  }
}
