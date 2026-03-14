import { Hono } from 'hono';
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/db";

const app = new Hono();

app.post('/api/auth/register', async (c) => {
  try {
    console.log("Registration request received");
    
    const body = await c.req.text();
    console.log("Request body:", body);
    
    if (!body) {
      console.log("Empty request body");
      return c.json({ error: "Request body is empty" }, 400);
    }
    
    let registerData;
    try {
      registerData = JSON.parse(body);
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      return c.json({ error: "Invalid JSON format" }, 400);
    }
    
    const { email, password, name, username, birthday } = registerData;

    if (!email || !password || !name || !username || !birthday) {
      return c.json(
        { error: "All fields are required" },
        400
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return c.json(
        { error: "User with this email or username already exists" },
        409
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

    return c.json(
      {
        message: "User created successfully",
        user
      },
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return c.json({ error: "Invalid JSON format" }, 400);
    }
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
});

export default app;
