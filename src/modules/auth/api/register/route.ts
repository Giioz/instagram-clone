import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { prisma } from "@/src/modules/common/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username, birthday } = await request.json();

    if (!email || !password || !name || !username || !birthday) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        birthday: new Date(birthday),
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
