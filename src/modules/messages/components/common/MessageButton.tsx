"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageButton({ username }: { username: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() =>
        router.push(`/messages?with=${encodeURIComponent(username)}`)
      }
      className="w-[324.016px] h-[44px] rounded-lg font-semibold transition-all bg-gray-700 text-white hover:bg-gray-600 flex items-center justify-center gap-2"
    >
      <MessageCircle size={18} />
      Message
    </button>
  );
}
