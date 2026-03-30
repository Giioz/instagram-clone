import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/src/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "instagram-clone-production-secret-key-2025";

export async function GET(request: NextRequest) {
  try {
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(payload.userId);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = jwt.sign({ userId, scope: "ws" }, JWT_SECRET, { expiresIn: "15m" });
    return NextResponse.json({ token, expiresInSeconds: 15 * 60 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
