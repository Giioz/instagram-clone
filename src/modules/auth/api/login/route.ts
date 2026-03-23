import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/src/modules/common/lib/db';

const app = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || "instagram-clone-production-secret-key-2025";

app.post('/api/auth/login', async (c) => {
  try {
    console.log("Login request received");
    
    const body = await c.req.text();
    console.log("Request body:", body);
    
    if (!body) {
      console.log("Empty request body");
      return c.json({ error: "Request body is empty" }, 400);
    }
    
    let loginData;
    try {
      loginData = JSON.parse(body);
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      return c.json({ error: "Invalid JSON format" }, 400);
    }
    
    const { email, password } = loginData;
    if (!email || !password) {
      const errors: { email?: string; password?: string } = {};
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
      return c.json({ errors }, 400);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ errors: { email: "Invalid credentials" } }, 401);


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return c.json({ errors: { password: "Invalid credentials" } }, 401);

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const response = c.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username
      }
    }, 200);

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*60*60}; SameSite=Strict; ${process.env.NODE_ENV==='production'?'Secure':''}`
    );

    return response;

  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return c.json({ error: "Invalid JSON format" }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;