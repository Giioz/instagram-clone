import type { ChatMessageDTO, ChatUserBrief } from "@/src/modules/chat/types";

interface ReplyBarProps {
  replyTo: ChatMessageDTO | null;
  myId: number | null;
  selectedPeer: ChatUserBrief | null;
  setReplyTo: (message: ChatMessageDTO | null) => void;
}

export default function ReplyBar({ replyTo, myId, selectedPeer, setReplyTo }: ReplyBarProps) {
  if (!replyTo) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2  border-t border-gray-800 h-15">
      <div className="flex flex-col">
        <span className="text-xs font-normal">Replying to {replyTo.senderId === myId ? "yourself" : selectedPeer?.username}</span>
        <span className="text-sm text-gray-400 truncate max-w-62.5">{replyTo.text}</span>
      </div>
      <button
        type="button"
        onClick={() => setReplyTo(null)}
        className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
      >
        <svg aria-label="Close" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16">
          <title>Close</title>
          <path d="M12.001 10.5l5.15-5.151a1 1 0 1 0-1.414-1.414l-5.15 5.151-5.151-5.151a1 1 0 0 0-1.414 1.414l5.151 5.151-5.151 5.151a1 1 0 1 0 1.414 1.414l5.151-5.151 5.151 5.151a1 1 0 1 0 1.414-1.414l-5.151-5.15z"></path>
        </svg>
      </button>
    </div>
  );
}
