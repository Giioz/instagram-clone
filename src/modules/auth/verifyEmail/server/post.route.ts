import { Hono } from "hono";
import { prisma } from "@/src/lib/db";
import { cookies } from "next/headers";

const app = new Hono();

app.post("/api/auth/verify-email", async (c) => {
  try {
    const body = await c.req.json();

    if (!body) {
      return c.json({ error: "Request body is empty" }, 400);
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return c.json({ error: "Invalid JSON format" }, 400);
    }

    const { code } = parsedBody;
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("pending_verification_email")?.value;

    if (!userEmail || !code) {
      return c.json({ error: "Email and code are required." }, 400);
    }

    const [verifyReq, user] = await Promise.all([
      prisma.verifyEmail.findUnique({ where: { userEmail } }),
      prisma.user.findUnique({ where: { email: userEmail } }),
    ]);

    if (!verifyReq || !user) {
      return c.json({ error: "Email verification request not found." }, 404);
    }

    const isExpired = new Date() > verifyReq.expiresAt;

    if (isExpired) {
      await prisma.verifyEmail.delete({ where: { userEmail } });
      return c.json({ error: "Verification code has expired." }, 400);
    }

    if (verifyReq.code !== Number(code)) {
      return c.json({ error: "Invalid verification code." }, 400);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email: userEmail },
        data: { emailVerified: true },
      }),
      prisma.verifyEmail.delete({ where: { userEmail } }),
    ]);

    cookieStore.delete("pending_verification_email");

    return c.json({ 
      message: "Email verified successfully.",
      redirect: "/login"
    }, 200);
  } catch (error) {
    console.error("Verification error:", error);
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return c.json({ error: "Invalid JSON format" }, 400);
    }
    return c.json({ error: "Internal server error. Please try again later." }, 500);
  }
});

export default app;