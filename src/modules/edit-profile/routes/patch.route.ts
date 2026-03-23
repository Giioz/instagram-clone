import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { verifyToken } from "@/src/lib/auth";

const GenderValues = ["MALE", "FEMALE", "CUSTOM", "PREFER_NOT_TO_SAY"] as const;
type Gender = (typeof GenderValues)[number];

function isValidUrl(url: string): boolean {
  if (!url) return true;

  try {
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    new URL(urlWithProtocol);
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = verifyToken(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bio, website, gender, imageUrl } = body;

    if (gender && !GenderValues.includes(gender as Gender)) {
      return NextResponse.json(
        { error: "Invalid gender value" },
        { status: 400 }
      );
    }

    if (bio && bio.length > 150) {
      return NextResponse.json(
        { error: "Bio must be 150 characters or less" },
        { status: 400 }
      );
    }

    if (website && !isValidUrl(website)) {
      return NextResponse.json(
        { error: "Invalid website URL" },
        { status: 400 }
      );
    }

    const currentUserId = parseInt(currentUser.userId);
    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(gender && { gender }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}