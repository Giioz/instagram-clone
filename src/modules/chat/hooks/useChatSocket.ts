"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClientToServerMessage, ServerToClientMessage } from "@/src/modules/chat/types";

export type ChatSocketStatus =
  | "idle"
  | "connecting"
  | "open"
  | "reconnecting"
  | "error"
  | "closed";

function wsBaseUrl(): string {
  if (typeof window === "undefined") return "";
  return (process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:3001").replace(/\/$/, "");
}

export function useChatSocket(enabled: boolean, myUserId: number | null) {
  const qc = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionGen = useRef(0);

  const [status, setStatus] = useState<ChatSocketStatus>("idle");
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(() => new Set());
  const [typingFromUserId, setTypingFromUserId] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  }, []);

  const connect = useCallback(
    (generation: number) => {
      if (!enabled || myUserId == null) return;

      void (async () => {
        setStatus("connecting");
        setLastError(null);
        const tokenRes = await fetch("/api/chat/ws-token", { credentials: "include" });
        if (generation !== sessionGen.current) return;

        if (!tokenRes.ok) {
          setStatus("error");
          setLastError("Could not obtain WebSocket credentials.");
          return;
        }
        const { token } = (await tokenRes.json()) as { token: string };
        if (generation !== sessionGen.current) return;

        const url = `${wsBaseUrl()}?token=${encodeURIComponent(token)}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (generation !== sessionGen.current) return;
          reconnectAttempt.current = 0;
          setStatus("open");
        };

        ws.onmessage = (ev) => {
          if (generation !== sessionGen.current) return;
          try {
            const data = JSON.parse(String(ev.data)) as ServerToClientMessage;
            if (data.type === "connected") {
              setOnlineUsers(new Set(data.onlineUserIds));
            } else if (data.type === "presence") {
              setOnlineUsers((prev) => {
                const next = new Set(prev);
                if (data.online) next.add(data.userId);
                else next.delete(data.userId);
                return next;
              });
            } else if (data.type === "message") {
              qc.invalidateQueries({ queryKey: ["chat-conversations"] });
              qc.invalidateQueries({ queryKey: ["chat-messages"] });
            } else if (data.type === "typing") {
              if (data.fromUserId === myUserId) return;
              if (data.isTyping) {
                setTypingFromUserId(data.fromUserId);
                if (typingTimer.current) clearTimeout(typingTimer.current);
                typingTimer.current = setTimeout(() => setTypingFromUserId(null), 3500);
              } else {
                setTypingFromUserId((cur) => (cur === data.fromUserId ? null : cur));
              }
            } else if (data.type === "error") {
              setLastError(data.message);
            }
          } catch {
            /* ignore */
          }
        };

        ws.onerror = () => {
          if (generation !== sessionGen.current) return;
          setLastError("WebSocket connection error.");
        };

        ws.onclose = () => {
          if (generation !== sessionGen.current) return;
          if (wsRef.current === ws) wsRef.current = null;
          if (!enabled || myUserId == null) {
            setStatus("closed");
            return;
          }
          setStatus("reconnecting");
          const attempt = reconnectAttempt.current++;
          const delay = Math.min(30_000, 800 * Math.pow(2, attempt));
          clearReconnectTimer();
          reconnectTimer.current = setTimeout(() => {
            if (generation !== sessionGen.current) return;
            connect(generation);
          }, delay);
        };
      })();
    },
    [clearReconnectTimer, enabled, myUserId, qc],
  );

  useEffect(() => {
    if (!enabled || myUserId == null) {
      sessionGen.current += 1;
      clearReconnectTimer();
      wsRef.current?.close();
      wsRef.current = null;
      setStatus("idle");
      setOnlineUsers(new Set());
      return;
    }

    const generation = ++sessionGen.current;
    reconnectAttempt.current = 0;
    clearReconnectTimer();
    connect(generation);

    return () => {
      sessionGen.current += 1;
      clearReconnectTimer();
      if (typingTimer.current) clearTimeout(typingTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect, clearReconnectTimer, enabled, myUserId]);

  const send = useCallback((msg: ClientToServerMessage) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(msg));
    return true;
  }, []);

  const sendText = useCallback(
    (receiverId: number, text: string, replyToId?: number | null) =>
      send({ type: "send", receiverId, text, replyToId }),
    [send],
  );

  const sendTyping = useCallback(
    (receiverId: number, isTyping: boolean) => send({ type: "typing", receiverId, isTyping }),
    [send],
  );

  const markRead = useCallback(
    (peerId: number) => send({ type: "mark_read", peerId }),
    [send],
  );

  const reconnectNow = useCallback(() => {
    if (!enabled || myUserId == null) return;
    clearReconnectTimer();
    reconnectAttempt.current = 0;
    sessionGen.current += 1;
    const generation = sessionGen.current;
    wsRef.current?.close();
    wsRef.current = null;
    connect(generation);
  }, [clearReconnectTimer, connect, enabled, myUserId]);

  return {
    status,
    onlineUsers,
    typingFromUserId,
    lastError,
    sendText,
    sendTyping,
    markRead,
    reconnect: reconnectNow,
  };
}
