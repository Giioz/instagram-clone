import Link from "next/link";
import Image from "next/image";
import type { ChatUserBrief } from "@/src/modules/chat/types";

interface ChatHeaderProps {
  selectedPeer: ChatUserBrief;
}

export default function ChatHeader({ selectedPeer }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-gray-800/80 px-4 shrink-0 py-3">
      <Image
        src={selectedPeer.imageUrl || "/default-avatar.png"}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover bg-gray-800"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${encodeURIComponent(selectedPeer.username)}`}
            className="truncate font-semibold hover:underline text-[16px]"
          >
            {selectedPeer.username}
          </Link>
        </div>
        <p className="truncate text-[12px] text-gray-500">{selectedPeer.name}</p>
      </div>
    </header>
  );
}
