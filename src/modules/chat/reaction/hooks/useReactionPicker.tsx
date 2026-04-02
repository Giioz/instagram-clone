"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPickerModal from "../components/EmojiPickerModal";

interface UseReactionPickerReturn {
  showEmojiPicker: boolean;
  emojiPickerAnchor: DOMRect | null;
  emojiTargetId: number | null;
  emojiPickerIsMine: boolean;
  messageReactions: Record<number, { emoji: string; isMine: boolean; users: any[] }>;
  openEmojiPicker: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, messageId: number, mine: boolean) => void;
  closeEmojiPicker: () => void;
  handleEmojiSelect: (emoji: string, _messageFromMe: boolean) => void;
  EmojiPickerComponent: React.FC;
}

export function useReactionPicker(
  messages: { id: number; senderId: number }[],
  myId: number | null
): UseReactionPickerReturn {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerAnchor, setEmojiPickerAnchor] = useState<DOMRect | null>(null);
  const [emojiTargetId, setEmojiTargetId] = useState<number | null>(null);
  const [emojiPickerIsMine, setEmojiPickerIsMine] = useState(false);
  const queryClient = useQueryClient();

  const { data: messageReactions = {} } = useQuery({
    queryKey: ["chat-reactions", messages.map(m => m.id)],
    queryFn: async () => {
      if (!myId || messages.length === 0) return {};

      try {
        const messageIds = messages.map((m) => m.id).join(",");
        const response = await fetch(`/api/chat/reactions?messageIds=${messageIds}`, {
          credentials: "include",
        });
        if (!response.ok) return {};

        const allReactions: any[][] = await response.json();
        const reactionsMap: Record<
          number,
          { emoji: string; isMine: boolean; users: any[] }
        > = {};

        allReactions.forEach((group) => {
          group.forEach((reaction: any) => {
            const messageId = reaction.messageId as number;
            if (messageId == null) return;

            if (!reactionsMap[messageId]) {
              reactionsMap[messageId] = {
                emoji: reaction.emoji,
                isMine: reaction.userId === myId,
                users: [],
              };
            }
            reactionsMap[messageId].users.push(reaction.user);
            if (reaction.userId === myId) {
              reactionsMap[messageId].emoji = reaction.emoji;
              reactionsMap[messageId].isMine = true;
            }
          });
        });

        return reactionsMap;
      } catch (error) {
        console.error("Failed to load reactions:", error);
        return {};
      }
    },
    enabled: !!myId && messages.length > 0,
  });

  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: number; emoji: string }) => {
      const response = await fetch("/api/chat/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add reaction");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat-reactions"] });
      closeEmojiPicker();
    },
    onError: (err) => console.error("Failed to save reaction:", err),
  });

  const removeReactionMutation = useMutation({
    mutationFn: async ({ messageId }: { messageId: number }) => {
      const response = await fetch("/api/chat/reactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to remove reaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-reactions"] });
      closeEmojiPicker();
    },
    onError: (err) => console.error("Failed to delete reaction:", err),
  });

  const openEmojiPicker = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    messageId: number,
    mine: boolean
  ) => {
    setEmojiPickerAnchor(e.currentTarget.getBoundingClientRect());
    setEmojiTargetId(messageId);
    setEmojiPickerIsMine(mine);
    setShowEmojiPicker(true);
  };

  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
    setEmojiPickerAnchor(null);
    setEmojiTargetId(null);
  };

  const handleEmojiSelect = (emoji: string, _messageFromMe: boolean) => {
    if (emojiTargetId == null || myId == null) return;

    const targetId = emojiTargetId;
    const existingReaction = messageReactions[targetId];

    if (existingReaction && existingReaction.emoji === emoji) {
      removeReactionMutation.mutate({ messageId: targetId });
    } else {
      addReactionMutation.mutate({ messageId: targetId, emoji });
    }
  };

  const EmojiPickerComponent: React.FC = () => (
    <EmojiPickerModal
      isOpen={showEmojiPicker}
      onClose={closeEmojiPicker}
      onEmojiSelect={handleEmojiSelect}
      anchorRect={emojiPickerAnchor}
      isMine={emojiPickerIsMine}
      currentReaction={emojiTargetId ? messageReactions[emojiTargetId]?.emoji : undefined}
    />
  );

  return {
    showEmojiPicker,
    emojiPickerAnchor,
    emojiTargetId,
    emojiPickerIsMine,
    messageReactions,
    openEmojiPicker,
    closeEmojiPicker,
    handleEmojiSelect,
    EmojiPickerComponent,
  };
}
