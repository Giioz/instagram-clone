"use client";

import { useRef, useState } from "react";
import type { ChatMessageDTO, ChatUserBrief } from "@/src/modules/chat/types";

export function useChatPageState() {
  const [selectedPeer, setSelectedPeer] = useState<ChatUserBrief | null>(null);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessageDTO | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typingEmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSent = useRef(false);

  return {
    selectedPeer,
    setSelectedPeer,
    input,
    setInput,
    replyTo,
    setReplyTo,
    resolveError,
    setResolveError,
    listRef,
    typingEmitTimer,
    lastTypingSent,
  };
}
