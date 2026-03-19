import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { verifyToken } from "@/src/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const currentUser = verifyToken(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = parseInt(currentUser.userId);

    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        bio: true,
        website: true,
        gender: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}