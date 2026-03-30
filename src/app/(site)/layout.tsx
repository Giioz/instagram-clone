import Sidebar from "@/src/components/layout/Sidebar";
import { ChatSocketProvider } from "@/src/modules/chat/context/ChatSocketContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatSocketProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </ChatSocketProvider>
  );
}
