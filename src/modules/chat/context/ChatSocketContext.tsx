"use client";

import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import { useChatSocket } from "@/src/modules/chat/hooks/useChatSocket";
import { createContext, useContext } from "react";

type ChatSocketApi = ReturnType<typeof useChatSocket>;

const ChatSocketContext = createContext<ChatSocketApi | null>(null);

export function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const myId = user ? Number(user.userId) : null;
  const enabled = !!user && myId != null && Number.isFinite(myId);
  const value = useChatSocket(enabled, myId);

  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}

export function useChatSocketContext(): ChatSocketApi {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) {
    throw new Error("useChatSocketContext must be used within ChatSocketProvider");
  }
  return ctx;
}
