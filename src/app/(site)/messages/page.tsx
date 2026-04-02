import { ChatPage } from "@/src/modules/chat/components/sections/ChatPage";
import { Suspense } from "react";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B1014] text-gray-400">
          Loading messages…
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  );
}
