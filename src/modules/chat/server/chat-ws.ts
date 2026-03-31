import "dotenv/config";
import jwt from "jsonwebtoken";
import { WebSocketServer, WebSocket } from "ws";
import { prisma } from "../../../lib/db";
import type { ChatMessageDTO } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "instagram-clone-production-secret-key-2025";
const PORT = Number(process.env.WS_PORT || 3001);

function parseUserId(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function verifyWsToken(token: string | null): number | null {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { scope?: string };
    if (decoded.scope !== "ws") return null;
    return parseUserId(decoded.userId);
  } catch {
    return null;
  }
}

const userSockets = new Map<number, Set<WebSocket>>();
const socketUserId = new Map<WebSocket, number>();

function addSocket(userId: number, ws: WebSocket) {
  let set = userSockets.get(userId);
  if (!set) {
    set = new Set();
    userSockets.set(userId, set);
  }
  set.add(ws);
  socketUserId.set(ws, userId);
}

function removeSocket(ws: WebSocket): { userId: number; fullyOffline: boolean } | null {
  const userId = socketUserId.get(ws);
  if (userId === undefined) return null;
  socketUserId.delete(ws);
  const set = userSockets.get(userId);
  if (!set) {
    userSockets.delete(userId);
    return { userId, fullyOffline: true };
  }
  set.delete(ws);
  const fullyOffline = set.size === 0;
  if (fullyOffline) userSockets.delete(userId);
  return { userId, fullyOffline };
}

function broadcast(json: string) {
  for (const [, sockets] of userSockets) {
    for (const ws of sockets) {
      if (ws.readyState === WebSocket.OPEN) ws.send(json);
    }
  }
}

function sendToUser(userId: number, data: object) {
  const msg = JSON.stringify(data);
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  for (const ws of sockets) {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg);
  }
}

function toDto(m: {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt: Date;
  readAt: Date | null;
  reply?: {
    replyToId: number;
    replyToText: string;
    replyTo?: {
      id: number;
      senderId: number;
      receiverId: number;
      text: string;
      createdAt: Date;
      readAt: Date | null;
    } | null;
  } | null;
}): ChatMessageDTO {
  return {
    id: m.id,
    senderId: m.senderId,
    receiverId: m.receiverId,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    readAt: m.readAt ? m.readAt.toISOString() : null,
    replyToId: m.reply?.replyToId ?? null,
    replyToText: m.reply?.replyToText ?? null,
    replyTo: m.reply?.replyTo ? {
      id: m.reply.replyTo.id,
      senderId: m.reply.replyTo.senderId,
      receiverId: m.reply.replyTo.receiverId,
      text: m.reply.replyTo.text,
      createdAt: m.reply.replyTo.createdAt.toISOString(),
      readAt: m.reply.replyTo.readAt ? m.reply.replyTo.readAt.toISOString() : null,
      replyToId: null,
      replyToText: null,
      replyTo: null,
    } : null,
  };
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws, req) => {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  const token = url.searchParams.get("token");
  const userId = verifyWsToken(token);

  if (userId === null) {
    ws.send(JSON.stringify({ type: "error", code: "unauthorized", message: "Invalid or missing token" }));
    ws.close();
    return;
  }

  addSocket(userId, ws);
  const onlineIds = [...userSockets.keys()];
  ws.send(JSON.stringify({ type: "connected", userId, onlineUserIds: onlineIds }));
  broadcast(JSON.stringify({ type: "presence", userId, online: true }));

  ws.on("message", async (raw) => {
    try {
      const text = raw.toString();
      const data = JSON.parse(text) as { type?: string };

      if (data.type === "send") {
        const { receiverId, text: body, replyToId } = data as { type: "send"; receiverId: number; text: string; replyToId?: number | null };
        if (typeof receiverId !== "number" || typeof body !== "string" || !body.trim()) {
          ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
          return;
        }
        if (receiverId === userId) return;

        let replyToText: string | null = null;
        if (replyToId) {
          const repliedMsg = await prisma.message.findUnique({
            where: { id: replyToId },
            select: { text: true }
          });
          replyToText = repliedMsg?.text ?? null;
        }
        const msg = await prisma.message.create({
          data: { senderId: userId, receiverId, text: body.trim() },
        });
        
        if (replyToId && replyToText) {
          await prisma.messageReply.create({
            data: { messageId: msg.id, replyToId, replyToText },
          });
        }
        
        const msgWithReply = await prisma.message.findUnique({
          where: { id: msg.id },
          include: { reply: { include: { replyTo: true } } },
        });
        const dto = toDto(msgWithReply!);
        sendToUser(userId, { type: "message", message: dto });
        sendToUser(receiverId, { type: "message", message: dto });
        return;
      }

      if (data.type === "typing") {
        const { receiverId, isTyping } = data as { type: "typing"; receiverId: number; isTyping: boolean };
        if (typeof receiverId !== "number" || receiverId === userId) return;
        sendToUser(receiverId, { type: "typing", fromUserId: userId, isTyping: !!isTyping });
        return;
      }

      if (data.type === "mark_read") {
        const { peerId } = data as { type: "mark_read"; peerId: number };
        if (typeof peerId !== "number" || peerId === userId) return;
        await prisma.message.updateMany({
          where: { senderId: peerId, receiverId: userId, readAt: null },
          data: { readAt: new Date() },
        });
      }
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Bad request" }));
    }
  });

  ws.on("close", () => {
    const result = removeSocket(ws);
    if (result?.fullyOffline) {
      broadcast(JSON.stringify({ type: "presence", userId: result.userId, online: false }));
    }
  });
});

wss.on("listening", () => {});
