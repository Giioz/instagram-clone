import type { ChatMessageDTO, ChatUserBrief } from "@/src/modules/chat/types";
import { useState } from "react";

interface MessageListProps {
  listRef: React.RefObject<HTMLDivElement | null>;
  loadingMessages: boolean;
  threadLoadError: string | null;
  messages: ChatMessageDTO[];
  myId: number | null;
  selectedPeer: ChatUserBrief | null;
  setReplyTo: (message: ChatMessageDTO | null) => void;
}

export default function MessageList({
  listRef,
  loadingMessages,
  threadLoadError,
  messages,
  myId,
  selectedPeer,
  setReplyTo,
}: MessageListProps) {

  if (loadingMessages) return <div className="p-4 text-gray-400">Loading messages...</div>;
  if (threadLoadError) return <div className="p-4 text-red-500">{threadLoadError}</div>;

  return (
    <div
      ref={listRef}
      className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-4 py-4"
    >
      {messages.map((m: ChatMessageDTO) => {
        const mine = m.senderId === myId;

        return (
          <div
            key={m.id}
            className={`group relative flex w-full items-center gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}
          >
            {!mine && (
              <img
                src={selectedPeer?.imageUrl || "/default-avatar.png"}
                alt=""
                className="h-8 w-8 shrink-0 rounded-full object-cover bg-gray-800"
              />
            )}

            <div
              className={`relative flex flex-col max-w-[70%] gap-0.5 ${
                mine ? "items-end" : "items-start"
              }`}
            >
              {/* Reply Preview */}
              {m.replyToId && m.replyTo && (
                <>
                  <span className="text-xs text-gray-400">
                    You replied to {m.replyTo.senderId === myId ? "yourself" : selectedPeer?.username}
                  </span>
                  <div
                    className={`rounded-[18px] px-3 py-1.5 mb-1 ${
                      m.replyTo.senderId === myId ? "bg-[#4a5df9]" : "bg-[#25292e]"
                    }`}
                  >
                    <span className="text-[14px] text-white/90 break-all">{m.replyTo.text}</span>
                  </div>
                </>
              )}

              {/* Message Bubble */}
              <div
                className={`min-w-0 break-words rounded-[18px] px-3 py-2 text-[15px] font-normal ${
                  mine ? "bg-[#4a5df9] text-white" : "bg-[#25292e] text-white"
                }`}
              >
                <span className="text-[15px] break-all">{m.text}</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-row items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out ${
                mine ? "mr-2" : "ml-2"
              }`}
            >
              {mine ? (
                <>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="More options"
                  >
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <circle cx="12" cy="12" r="1.5"></circle>
                      <circle cx="12" cy="6" r="1.5"></circle>
                      <circle cx="12" cy="18" r="1.5"></circle>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplyTo(m)}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Reply"
                  >
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M14 8.999H4.413l5.294-5.292a1 1 0 1 0-1.414-1.414l-7 6.998c-.014.014-.019.033-.032.048A.933.933 0 0 0 1 9.998V10c0 .027.013.05.015.076a.907.907 0 0 0 .282.634l6.996 6.998a1 1 0 0 0 1.414-1.414L4.415 11H14a7.008 7.008 0 0 1 7 7v3.006a1 1 0 0 0 2 0V18a9.01 9.01 0 0 0-9-9Z"></path>
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="React"
                  >
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="React"
                  >
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplyTo(m)}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Reply"
                  >
                    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                      <path d="M14 8.999H4.413l5.294-5.292a1 1 0 1 0-1.414-1.414l-7 6.998c-.014.014-.019.033-.032.048A.933.933 0 0 0 1 9.998V10c0 .027.013.05.015.076a.907.907 0 0 0 .282.634l6.996 6.998a1 1 0 0 0 1.414-1.414L4.415 11H14a7.008 7.008 0 0 1 7 7v3.006a1 1 0 0 0 2 0V18a9.01 9.01 0 0 0-9-9Z"></path>
                    </svg>
                  </button>
                  </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}