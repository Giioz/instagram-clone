import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { verifyToken } from "@/src/lib/auth";

const utapi = new UTApi();

export async function DELETE(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('fileUrl');

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }
    const fileKey = fileUrl.split('/f/').pop();
    
    if (!fileKey) {
      return NextResponse.json(
        { error: "Invalid file URL" },
        { status: 400 }
      );
    }

    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
