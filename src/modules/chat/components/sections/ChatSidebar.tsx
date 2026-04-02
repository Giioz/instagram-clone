import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { ChatUserBrief } from "@/src/modules/chat/types";
import type { InboxRow } from "@/src/modules/chat/utils/mergeInbox";

interface ChatSidebarProps {
  loadingConv: boolean;
  loadingContacts: boolean;
  inboxRows: InboxRow[];
  selectedPeer: ChatUserBrief | null;
  onlineUsers: Set<number>;
  selectPeer: (peer: ChatUserBrief) => void;
}

export default function ChatSidebar({
  loadingConv,
  loadingContacts,
  inboxRows,
  selectedPeer,
  selectPeer,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 w-97.5 shrink-0 flex-col border-r border-gray-800/80">
      <div className="flex items-center justify-between px-6 py-5">
        <h1 className="text-xl font-semibold">Messages</h1>
        <span className="text-sm text-gray-400">Requests</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {(loadingConv || loadingContacts) && (
          <div className="flex justify-center py-10 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {!loadingConv &&
          !loadingContacts &&
          inboxRows.map((row) => {
            const active = selectedPeer?.id === row.peer.id;
            const preview =
              row.lastMessage == null
                ? "Start a conversation"
                : row.lastMessage.text.slice(0, 48) +
                  (row.lastMessage.text.length > 48 ? "…" : "");
            return (
              <button
                key={row.peer.id}
                type="button"
                onClick={() => selectPeer(row.peer)}
                className={`flex w-full items-center gap-3 px-5 py-2 text-left transition hover:bg-gray-900/30 ${
                  active ? "bg-gray-900/50" : ""
                }`}
              >
                <Image
                  src={row.peer.imageUrl || "/default-avatar.png"}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover bg-gray-800"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{row.peer.username}</span>
                  </div>
                  <p className="truncate text-sm text-gray-400">{preview}</p>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}
