import type { ChatMessageDTO, ChatUserBrief } from "@/src/modules/chat/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import MessageOptionsModal from "./MessageOptionsModal";
import EmojiPickerModal from "./EmojiPickerModal";

interface MessageListProps {
  listRef: React.RefObject<HTMLDivElement | null>;
  loadingMessages: boolean;
  threadLoadError: string | null;
  messages: ChatMessageDTO[];
  myId: number | null;
  selectedPeer: ChatUserBrief | null;
  setReplyTo: (message: ChatMessageDTO | null) => void;
  onMessageDeleted?: (messageId: number) => void;
}

export default function MessageList({
  listRef,
  loadingMessages,
  threadLoadError,
  messages,
  myId,
  selectedPeer,
  setReplyTo,
  onMessageDeleted,
}: MessageListProps) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessageDTO | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [modalIsMine, setModalIsMine] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerAnchor, setEmojiPickerAnchor] = useState<DOMRect | null>(null);
  const [emojiTargetId, setEmojiTargetId] = useState<number | null>(null);
  const [emojiPickerIsMine, setEmojiPickerIsMine] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<number, { emoji: string; isMine: boolean; count: number; users: any[] }>>({});

  useEffect(() => {
    const loadReactions = async () => {
      if (!myId || messages.length === 0) return;

      try {
        const messageIds = messages.map((m) => m.id).join(",");
        const response = await fetch(`/api/chat/reactions?messageIds=${messageIds}`, {
          credentials: "include",
        });
        if (!response.ok) return;

        const allReactions: any[][] = await response.json();
        const reactionsMap: Record<
          number,
          { emoji: string; isMine: boolean; count: number; users: any[] }
        > = {};

        allReactions.forEach((group) => {
          group.forEach((reaction: any) => {
            const messageId = reaction.messageId as number;
            if (messageId == null) return;

            if (!reactionsMap[messageId]) {
              reactionsMap[messageId] = {
                emoji: reaction.emoji,
                isMine: reaction.userId === myId,
                count: 0,
                users: [],
              };
            }
            reactionsMap[messageId].count += 1;
            reactionsMap[messageId].users.push(reaction.user);
            if (reaction.userId === myId) {
              reactionsMap[messageId].emoji = reaction.emoji;
              reactionsMap[messageId].isMine = true;
            }
          });
        });

        setMessageReactions(reactionsMap);
      } catch (error) {
        console.error("Failed to load reactions:", error);
      }
    };

    loadReactions();
  }, [messages, myId]);

  if (loadingMessages) return <div className="p-4 text-gray-400">Loading messages...</div>;
  if (threadLoadError) return <div className="p-4 text-red-500">{threadLoadError}</div>;

  const openModal = (e: React.MouseEvent<HTMLButtonElement>, m: ChatMessageDTO, mine: boolean) => {
    setAnchorRect(e.currentTarget.getBoundingClientRect());
    setSelectedMessage(m);
    setModalIsMine(mine);
    setShowMessageModal(true);
  };

  const handleDeleteMessage = (messageId: number) => {
    onMessageDeleted?.(messageId);
    closeModal();
    fetch(`/api/chat/messages?messageId=${messageId}`, {
      method: "DELETE",
      credentials: "include",
    }).catch((error) => console.error("Background delete failed:", error));
  };

  const handleForwardMessage = (_messageText: string) => {
    closeModal();
  };

  const openEmojiPicker = (e: React.MouseEvent<HTMLButtonElement>, messageId: number, mine: boolean) => {
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

  // ✅ Optimistic update: UI updates immediately, API syncs in background
  const handleEmojiSelect = (emoji: string, _messageFromMe: boolean) => {
    if (emojiTargetId == null || myId == null) return;

    const targetId = emojiTargetId; // capture before closeEmojiPicker nulls it
    const existingReaction = messageReactions[targetId];

    if (existingReaction && existingReaction.emoji === emoji) {
      // Same emoji → remove
      setMessageReactions((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      closeEmojiPicker();

      fetch("/api/chat/reactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: targetId }),
        credentials: "include",
      }).catch((err) => console.error("Failed to delete reaction:", err));
    } else {
      // New or changed emoji → add/update
      setMessageReactions((prev) => ({
        ...prev,
        [targetId]: {
          emoji,
          isMine: true,
          count: prev[targetId]?.count ?? 1,
          users: prev[targetId]?.users || [],
        },
      }));
      closeEmojiPicker();

      fetch("/api/chat/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: targetId,
          emoji,
        }),
        credentials: "include",
      }).catch((err) => console.error("Failed to save reaction:", err));
    }
  };

  const closeModal = () => {
    setShowMessageModal(false);
    setTimeout(() => setSelectedMessage(null), 0);
  };

  const getBubbleRadius = (isFirst: boolean, isLast: boolean, mine: boolean): string => {
    if (isFirst && isLast) return "rounded-[18px]";
    if (mine) {
      if (isFirst) return "rounded-[18px] rounded-br-[4px]";
      if (isLast) return "rounded-[18px] rounded-tr-[4px]";
      return "rounded-[18px] rounded-r-[4px]";
    } else {
      if (isFirst) return "rounded-[18px] rounded-bl-[4px]";
      if (isLast) return "rounded-[18px] rounded-tl-[4px]";
      return "rounded-[18px] rounded-l-[4px]";
    }
  };

  const ActionButtons = ({ m, mine }: { m: ChatMessageDTO; mine: boolean }) => {
    const isActiveMessage = showMessageModal && selectedMessage?.id === m.id;
    return (
      <div
        className={`flex flex-row items-center gap-1 transition-all duration-200 ease-out ${
          isActiveMessage
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
        } ${mine ? "mr-2" : "ml-2"}`}
      >
        {mine ? (
          <>
            <button type="button" onClick={(e) => openModal(e, m, true)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="More options">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
            <button type="button" onClick={() => setReplyTo(m)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="Reply">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <path d="M14 8.999H4.413l5.294-5.292a1 1 0 1 0-1.414-1.414l-7 6.998c-.014.014-.019.033-.032.048A.933.933 0 0 0 1 9.998V10c0 .027.013.05.015.076a.907.907 0 0 0 .282.634l6.996 6.998a1 1 0 0 0 1.414-1.414L4.415 11H14a7.008 7.008 0 0 1 7 7v3.006a1 1 0 0 0 2 0V18a9.01 9.01 0 0 0-9-9Z" />
              </svg>
            </button>
            <button type="button" onClick={(e) => openEmojiPicker(e, m.id, true)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="React">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={(e) => openEmojiPicker(e, m.id, false)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="React">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" />
              </svg>
            </button>
            <button type="button" onClick={() => setReplyTo(m)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="Reply">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <path d="M14 8.999H4.413l5.294-5.292a1 1 0 1 0-1.414-1.414l-7 6.998c-.014.014-.019.033-.032.048A.933.933 0 0 0 1 9.998V10c0 .027.013.05.015.076a.907.907 0 0 0 .282.634l6.996 6.998a1 1 0 0 0 1.414-1.414L4.415 11H14a7.008 7.008 0 0 1 7 7v3.006a1 1 0 0 0 2 0V18a9.01 9.01 0 0 0-9-9Z" />
              </svg>
            </button>
            <button type="button" onClick={(e) => openModal(e, m, false)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors" title="More options">
              <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div ref={listRef} className="flex flex-1 flex-col gap-[2px] overflow-y-auto overflow-x-hidden px-4 py-4">
        {messages.map((m: ChatMessageDTO, index: number) => {
          const mine = m.senderId === myId;
          const hasReply = !!(m.replyToId && m.replyTo);
          const reaction = messageReactions[m.id];

          const prev = messages[index - 1];
          const next = messages[index + 1];

          const prevSame = prev && prev.senderId === m.senderId && !hasReply && !(prev.replyToId && prev.replyTo);
          const nextSame = next && next.senderId === m.senderId && !(next.replyToId && next.replyTo);

          const isFirst = !prevSame;
          const isLast = !nextSame;
          const groupStart = isFirst && index !== 0;
          const bubbleRadius = getBubbleRadius(isFirst, isLast, mine);

          return (
            <div
              key={m.id}
              className={`group relative flex w-full flex-col gap-0.5 ${mine ? "items-end" : "items-start"} ${groupStart ? "mt-2" : ""} ${reaction ? "mb-3" : ""}`}
            >
              {hasReply && (
                <div className={`flex w-full items-end gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}>
                  {!mine && <div className="w-8 shrink-0" />}
                  <div className={`flex flex-col max-w-[70%] gap-1 ${mine ? "items-end" : "items-start"}`}>
                    <span className="text-xs text-gray-400">
                      You replied to {m.replyTo!.senderId === myId ? "yourself" : selectedPeer?.username}
                    </span>
                    <div className={`rounded-[18px] px-3 py-1.5 ${m.replyTo!.senderId === myId ? "bg-[#4a5df9]" : "bg-[#25292e]"}`}>
                      <span className="text-[14px] text-white/90 break-all">{m.replyTo!.text}</span>
                    </div>
                  </div>
                  {mine && <div className="w-8 shrink-0" />}
                </div>
              )}

              <div className={`flex w-full items-center gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}>
                {!mine && (
                  <div className="w-8 shrink-0 self-end">
                    {isLast && (
                      <Image
                        src={selectedPeer?.imageUrl || "/default-avatar.png"}
                        alt="" width={32} height={32}
                        className="h-8 w-8 rounded-full object-cover bg-gray-800"
                      />
                    )}
                  </div>
                )}

                <div className={`relative flex flex-col max-w-[70%] ${mine ? "items-end" : "items-start"}`}>
                  <div className={`relative min-w-0 wrap-break-word px-3 py-2 text-[15px] font-normal ${bubbleRadius} ${mine ? "bg-[#4a5df9] text-white" : "bg-[#25292e] text-white"}`}>
                    <span className="text-[15px] break-all">{m.text}</span>

                    {reaction && (
                      <div
                        className={`absolute -bottom-4 flex items-center gap-1 px-2 py-1 rounded-full bg-[#2a2a2a] border-2 border-black shadow-md hover:scale-110 transition-transform ${
                          mine ? "-right-1" : "-left-1"
                        }`}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          openEmojiPicker(e as any, m.id, mine);
                        }}
                        title={`${reaction.count} reaction${reaction.count > 1 ? 's' : ''}: ${reaction.users.map(u => u.username).join(', ')}`}
                      >
                        <span className="text-base">{reaction.emoji}</span>
                        {reaction.count > 1 && (
                          <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 ml-1">
                            {reaction.count}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ActionButtons m={m} mine={mine} />
              </div>
            </div>
          );
        })}
      </div>

      <MessageOptionsModal
        showMessage={showMessageModal}
        message={selectedMessage}
        anchorRect={anchorRect}
        isMine={modalIsMine}
        onClose={closeModal}
        onDeleteMessage={handleDeleteMessage}
        onForwardMessage={handleForwardMessage}
      />

      <EmojiPickerModal
        isOpen={showEmojiPicker}
        onClose={closeEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        anchorRect={emojiPickerAnchor}
        isMine={emojiPickerIsMine}
        currentReaction={emojiTargetId ? messageReactions[emojiTargetId]?.emoji : undefined}
      />
    </>
  );
}