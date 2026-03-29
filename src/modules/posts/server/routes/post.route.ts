import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyToken(request);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, imageUrls } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    const imageUrlsJson = Array.isArray(imageUrls)
      ? JSON.stringify(imageUrls.filter(url => url && url.trim() !== ""))
      : imageUrls?.trim() || null;

    const post = await prisma.post.create({
      data: {
        userId: parseInt(payload.userId),
        content,
        imageUrl: imageUrlsJson,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}