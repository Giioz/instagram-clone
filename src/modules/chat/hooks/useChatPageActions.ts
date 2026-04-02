"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessageDTO, ChatUserBrief } from "@/src/modules/chat/types";

interface UseChatPageActionsProps {
  selectedPeer: ChatUserBrief | null;
  input: string;
  replyTo: ChatMessageDTO | null;
  setInput: (input: string) => void;
  setReplyTo: (replyTo: ChatMessageDTO | null) => void;
  setSelectedPeer: (peer: ChatUserBrief | null) => void;
  typingEmitTimer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  lastTypingSent: React.MutableRefObject<boolean>;
  sendText: (receiverId: number, text: string, replyToId?: number | null) => boolean;
  sendTyping: (receiverId: number, isTyping: boolean) => void;
  refetchMessages: () => void;
  socketStatus: string;
}

export function useChatPageActions({
  selectedPeer,
  input,
  replyTo,
  setInput,
  setReplyTo,
  setSelectedPeer,
  typingEmitTimer,
  lastTypingSent,
  sendText,
  sendTyping,
  refetchMessages,
  socketStatus,
}: UseChatPageActionsProps) {
  const router = useRouter();
  const qc = useQueryClient();

  const selectPeer = useCallback(
    (peer: ChatUserBrief) => {
      setSelectedPeer(peer);
      setInput("");
      router.replace(`/messages?with=${encodeURIComponent(peer.username)}`, { scroll: false });
    },
    [router, setInput, setSelectedPeer],
  );

  const flushTypingFalse = useCallback(() => {
    if (!selectedPeer || !lastTypingSent.current) return;
    lastTypingSent.current = false;
    sendTyping(selectedPeer.id, false);
  }, [selectedPeer, sendTyping]);

  const onInputChange = useCallback(
    (v: string) => {
      setInput(v);
      if (!selectedPeer) return;
      if (!v.trim()) {
        if (typingEmitTimer.current) clearTimeout(typingEmitTimer.current);
        flushTypingFalse();
        return;
      }
      if (!lastTypingSent.current) {
        lastTypingSent.current = true;
        sendTyping(selectedPeer.id, true);
      }
      if (typingEmitTimer.current) clearTimeout(typingEmitTimer.current);
      typingEmitTimer.current = setTimeout(() => {
        sendTyping(selectedPeer.id, false);
        lastTypingSent.current = false;
      }, 2000);
    },
    [selectedPeer, setInput, sendTyping, flushTypingFalse],
  );

  const onSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPeer || !input.trim()) return;
      flushTypingFalse();
      const ok = sendText(selectedPeer.id, input.trim(), replyTo?.id);
      if (ok) {
        setInput("");
        setReplyTo(null);
        void refetchMessages();
        void qc.invalidateQueries({ queryKey: ["chat-conversations"] });
      }
    },
    [selectedPeer, input, replyTo, flushTypingFalse, sendText, setInput, setReplyTo, refetchMessages, qc],
  );

  return {
    selectPeer,
    onInputChange,
    onSend,
  };
}
