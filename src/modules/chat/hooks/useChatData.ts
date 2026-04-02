"use client";

import { useQuery } from "@tanstack/react-query";
import { parseChatFetchError } from "@/src/modules/chat/lib/parseChatFetchError";
import type { ChatMessageDTO, ChatUserBrief, ConversationSummary } from "@/src/modules/chat/types";

export function useConversations(enabled: boolean) {
  return useQuery({
    queryKey: ["chat-conversations"],
    queryFn: async () => {
      const res = await fetch("/api/chat/conversations", { credentials: "include" });
      if (!res.ok) throw new Error(await parseChatFetchError(res));
      const data = (await res.json()) as { conversations: ConversationSummary[] };
      return data.conversations;
    },
    enabled,
  });
}

export function useContacts(enabled: boolean) {
  return useQuery({
    queryKey: ["chat-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/chat/contacts", { credentials: "include" });
      if (!res.ok) throw new Error(await parseChatFetchError(res));
      const data = (await res.json()) as { contacts: ChatUserBrief[] };
      return data.contacts;
    },
    enabled,
  });
}

export function usePeerMessages(peerId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["chat-messages", peerId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/messages?peerId=${peerId}`, { credentials: "include" });
      if (!res.ok) throw new Error(await parseChatFetchError(res));
      const data = (await res.json()) as { messages: ChatMessageDTO[] };
      return data.messages;
    },
    enabled: enabled && peerId != null,
  });
}

export async function fetchPeerByUsername(username: string): Promise<ChatUserBrief | null> {
  const res = await fetch(
    `/api/chat/peer?username=${encodeURIComponent(username)}`,
    { credentials: "include" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not resolve user");
  const data = (await res.json()) as { user: ChatUserBrief };
  return data.user;
}

export async function markReadHttp(peerId: number) {
  await fetch("/api/chat/mark-read", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peerId }),
  });
}
