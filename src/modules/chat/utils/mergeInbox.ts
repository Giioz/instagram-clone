import type { ChatUserBrief, ConversationSummary } from "@/src/modules/chat/types";

export type InboxRow =
  | ConversationSummary
  | { peer: ChatUserBrief; lastMessage: null; unread: 0 };

export function mergeInbox(
  conversations: ConversationSummary[] | undefined,
  contacts: ChatUserBrief[] | undefined,
): InboxRow[] {
  const conv = conversations ?? [];
  const ids = new Set(conv.map((c) => c.peer.id));
  const extra: InboxRow[] = (contacts ?? [])
    .filter((c) => !ids.has(c.id))
    .map((peer) => ({ peer, lastMessage: null, unread: 0 as const }));

  const withTime = conv.map((c) => ({
    row: c as InboxRow,
    t: new Date(c.lastMessage.createdAt).getTime(),
  }));
  const noTime = extra.map((row) => ({
    row,
    t: 0,
  }));
  return [...withTime, ...noTime]
    .sort((a, b) => b.t - a.t || a.row.peer.username.localeCompare(b.row.peer.username))
    .map((x) => x.row);
}
