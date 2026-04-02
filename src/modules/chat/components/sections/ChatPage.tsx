"use client";

import { useAuth } from "@/src/modules/auth/hooks/useAuth";
import {
  useContacts,
  useConversations,
  usePeerMessages,
} from "@/src/modules/chat/hooks/useChatData";
import { useChatSocketContext } from "@/src/modules/chat/context/ChatSocketContext";
import { useChatPageState } from "@/src/modules/chat/hooks/useChatPageState";
import { useChatPageEffects } from "@/src/modules/chat/hooks/useChatPageEffects";
import { useChatPageActions } from "@/src/modules/chat/hooks/useChatPageActions";
import { mergeInbox, type InboxRow } from "@/src/modules/chat/utils/mergeInbox";
import type { ChatUserBrief, ChatMessageDTO } from "@/src/modules/chat/types";
import { useState, useEffect } from "react";
import ChatHeader from "@/src/modules/chat/components/sections/ChatHeader";
import ChatInput from "@/src/modules/chat/components/common/ChatInput";
import MessageList from "@/src/modules/chat/components/common/MessageList";
import ReplyBar from "@/src/modules/chat/components/common/ReplyBar";
import ChatSidebar from "@/src/modules/chat/components/sections/ChatSidebar";

export const ChatPage = () => {
  const { user } = useAuth();
  const myId = user ? Number(user.userId) : null;

  const { selectedPeer, setSelectedPeer } = useChatPageState();

  const socketEnabled = !!user && myId != null && Number.isFinite(myId);
  const { onlineUsers } = useChatSocketContext();

  const { data: conversations, isLoading: loadingConv } =
    useConversations(socketEnabled);
  const { data: contacts, isLoading: loadingContacts } =
    useContacts(socketEnabled);

  const inboxRows = mergeInbox(conversations, contacts);

  const { selectPeer } = useChatPageActions({
    selectedPeer,
    input: "",
    replyTo: null,
    setInput: () => {},
    setReplyTo: () => {},
    setSelectedPeer,
    typingEmitTimer: { current: null },
    lastTypingSent: { current: false },
    sendText: () => false,
    sendTyping: () => {},
    refetchMessages: () => {},
    socketStatus: "",
  });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B1014] pl-20 text-white">
      <ChatLayout
        selectedPeer={selectedPeer}
        loadingConv={loadingConv}
        loadingContacts={loadingContacts}
        inboxRows={inboxRows}
        onlineUsersFromProps={onlineUsers}
        selectPeer={selectPeer}
        myId={myId}
      />
    </div>
  );
};

interface ChatLayoutProps {
  selectedPeer: ChatUserBrief | null;
  loadingConv: boolean;
  loadingContacts: boolean;
  inboxRows: InboxRow[];
  onlineUsersFromProps: Set<number>;
  selectPeer: (peer: ChatUserBrief) => void;
  myId: number | null;
}

export const ChatLayout = ({
  selectedPeer,
  loadingConv,
  loadingContacts,
  inboxRows,
  onlineUsersFromProps,
  selectPeer,
  myId,
}: ChatLayoutProps) => {
  const {
    status: socketStatus,
    sendText,
    sendTyping,
    markRead: markReadWs,
  } = useChatSocketContext();
  const {
    listRef,
    input,
    replyTo,
    setInput,
    setReplyTo,
    setSelectedPeer,
    typingEmitTimer,
    lastTypingSent,
  } = useChatPageState();

  const socketEnabled = true;
  const [localMessages, setLocalMessages] = useState<ChatMessageDTO[]>([]);
  
  const {
    data: serverMessages,
    isLoading: loadingMessages,
    error: messagesQueryError,
    refetch: refetchMessages,
  } = usePeerMessages(selectedPeer?.id || null, socketEnabled);
  
  // Sync server messages with local state
  useEffect(() => {
    if (serverMessages) {
      setLocalMessages(serverMessages);
    }
  }, [serverMessages]);
  
  const messages = localMessages;
  const threadLoadError = messagesQueryError
    ? String(messagesQueryError.message)
    : null;
  
  const handleMessageDeleted = (messageId: number) => {
    setLocalMessages((prev: ChatMessageDTO[]) => prev.filter((msg: ChatMessageDTO) => msg.id !== messageId));
  };

  const { onInputChange, onSend } = useChatPageActions({
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
  });

  useChatPageEffects({
    withUsername: null,
    socketEnabled,
    selectedPeer,
    myId: myId,
    markReadWs,
    messages: messages || [],
    setSelectedPeer,
    setResolveError: () => {},
    listRef,
    sendTyping,
  });

  return (
    <div className="flex h-full w-full">
        <ChatSidebar
          loadingConv={loadingConv}
          loadingContacts={loadingContacts}
          inboxRows={inboxRows}
          selectedPeer={selectedPeer}
          onlineUsers={onlineUsersFromProps}
          selectPeer={selectPeer}
        />
        <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {!selectedPeer ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-500">
              <p>Select a conversation</p>
              <p className="text-xs">
                Choose someone you follow or open a profile and tap Message.
              </p>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ChatHeader selectedPeer={selectedPeer} />

              <MessageList
                listRef={listRef}
                loadingMessages={loadingMessages}
                threadLoadError={threadLoadError}
                messages={messages || []}
                myId={myId}
                selectedPeer={selectedPeer}
                setReplyTo={setReplyTo}
                onMessageDeleted={handleMessageDeleted}
              />

              <ReplyBar
                replyTo={replyTo}
                myId={myId}
                selectedPeer={selectedPeer}
                setReplyTo={setReplyTo}
              />

              <ChatInput
                input={input}
                onInputChange={onInputChange}
                onSend={onSend}
                socketStatus={socketStatus}
              />
            </div>
          )}
        </section>
    </div>
  );
};
