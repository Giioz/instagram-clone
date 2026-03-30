export type ChatUserBrief = {
  id: number;
  username: string;
  name: string;
  imageUrl: string | null;
};

export type ChatMessageDTO = {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt: string;
  readAt: string | null;
  replyToId: number | null;
  replyToText: string | null;
  replyTo: ChatMessageDTO | null;
};

export type ConversationSummary = {
  peer: ChatUserBrief;
  lastMessage: Pick<ChatMessageDTO, "id" | "text" | "createdAt" | "senderId">;
  unread: number;
};

export type ClientToServerMessage =
  | { type: "send"; receiverId: number; text: string; replyToId?: number | null }
  | { type: "typing"; receiverId: number; isTyping: boolean }
  | { type: "mark_read"; peerId: number };

export type ServerToClientMessage =
  | { type: "connected"; userId: number; onlineUserIds: number[] }
  | { type: "message"; message: ChatMessageDTO }
  | { type: "typing"; fromUserId: number; isTyping: boolean }
  | { type: "presence"; userId: number; online: boolean }
  | { type: "error"; code?: string; message: string };
