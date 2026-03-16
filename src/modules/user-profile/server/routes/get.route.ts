import { NextRequest, NextResponse } from "next/server";
import { getUserProfile } from "@/src/modules/user-profile/services/getUserProfile";
import { verifyTokenString } from "@/src/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || 
    request.cookies.get("token")?.value;

    let currentUser = null;
    if (token) {
      currentUser = verifyTokenString(token);
    }

    const userProfile = await getUserProfile(username, currentUser);

    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
