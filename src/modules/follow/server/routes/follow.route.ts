import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/src/lib/auth";
import { followUser } from "@/src/modules/follow/services/followUser";

export async function POST(request: NextRequest) {
  try {
    const { followingId } = await request.json();
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!followingId) {
      return NextResponse.json(
        { error: "Missing followingId" },
        { status: 400 }
      );
    }

    const result = await followUser(followingId, payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to follow user" },
      { status: 500 }
    );
  }
}
