"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPeerByUsername, markReadHttp } from "./useChatData";
import type { ChatUserBrief } from "@/src/modules/chat/types";

interface UseChatPageEffectsProps {
  withUsername: string | null;
  socketEnabled: boolean;
  selectedPeer: ChatUserBrief | null;
  myId: number | null;
  markReadWs: (peerId: number) => void;
  messages: any[];
  setSelectedPeer: (peer: ChatUserBrief | null) => void;
  setResolveError: (error: string | null) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  sendTyping: (receiverId: number, isTyping: boolean) => void;
}

export function useChatPageEffects({
  withUsername,
  socketEnabled,
  selectedPeer,
  myId,
  markReadWs,
  messages,
  setSelectedPeer,
  setResolveError,
  listRef,
  sendTyping,
}: UseChatPageEffectsProps) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!withUsername || !socketEnabled) return;
    let cancelled = false;
    setResolveError(null);
    void (async () => {
      try {
        const peer = await fetchPeerByUsername(withUsername);
        if (cancelled) return;
        if (!peer) {
          setResolveError(`No user "${withUsername}".`);
          return;
        }
        setSelectedPeer(peer);
      } catch {
        setResolveError("Could not open chat.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [withUsername, socketEnabled, setSelectedPeer, setResolveError]);

  useEffect(() => {
    if (!selectedPeer || !myId) return;
    void markReadHttp(selectedPeer.id);
    markReadWs(selectedPeer.id);
    void qc.invalidateQueries({ queryKey: ["chat-conversations"] });
  }, [selectedPeer, myId, markReadWs, qc]);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, selectedPeer?.id]);

  useEffect(() => {
    return () => {
      if (selectedPeer) {
        sendTyping(selectedPeer.id, false);
      }
    };
  }, [selectedPeer, sendTyping]);
}
