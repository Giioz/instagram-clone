import { ChatPage, ChatLayout } from "./components/sections/ChatPage";
import ChatHeader from "./components/sections/ChatHeader";
import ChatSidebar from "./components/sections/ChatSidebar";
import ChatInput from "./components/common/ChatInput";
import MessageList from "./components/common/MessageList";
import ReplyBar from "./components/common/ReplyBar";

export const ChatModule = () => {
  return (
    <div className="h-full">
      <ChatPage />
    </div>
  );
};

export {
  ChatPage,
  ChatLayout,
  ChatHeader,
  ChatSidebar,
  ChatInput,
  MessageList,
  ReplyBar,
};
