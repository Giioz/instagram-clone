import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/src/modules/common/lib/db";
import { saveFile } from "@/src/modules/common/lib/fileUpload";

const JWT_SECRET = process.env.JWT_SECRET || "instagram-clone-production-secret-key-2025";

interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

async function getFileFromRequest(request: NextRequest): Promise<File | null> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return null;
    }
    
    return file;
  } catch (error) {
    console.error('Error parsing file from request:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Create story request received");
    
    const payload = verifyToken(request);
    
    if (!payload) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = await getFileFromRequest(request);
    
    if (!file) {
      console.log("No file provided");
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const mediaUrl = await saveFile(file, 'stories');

    const story = await prisma.story.create({
      data: {
        userId: parseInt(payload.userId),
        mediaUrl,
        expiresAt: new Date(Date.now() + (process.env.STORY_EXPIRY_HOURS ? parseInt(process.env.STORY_EXPIRY_HOURS) * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)), // Configurable expiry, default 24 hours
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

    console.log("Story created successfully:", story.id);
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Create story error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("Delete story request received");
    
    const payload = verifyToken(request);
    
    if (!payload) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('id');

    if (!storyId) {
      console.log("No story ID provided");
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: {
        id: parseInt(storyId),
      },
    });

    if (!story) {
      console.log("Story not found:", storyId);
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.userId !== parseInt(payload.userId)) {
      console.log("Forbidden: User trying to delete another user's story");
      return NextResponse.json({ error: "Forbidden - You can only delete your own stories" }, { status: 403 });
    }

    await prisma.story.delete({
      where: {
        id: parseInt(storyId),
      },
    });

    console.log("Story deleted successfully:", storyId);
    return NextResponse.json({ message: "Story deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete story error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Get stories request received");
    
    const payload = verifyToken(request);
    
    if (!payload) {
      console.log("Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Retrieved ${stories.length} stories`);
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Get stories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
