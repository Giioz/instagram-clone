import type { ChatMessageDTO } from "@/src/modules/chat/types";

interface MessageOptionsModalProps {
  showMessage: boolean;
  message: ChatMessageDTO | null;
  anchorRect: DOMRect | null;
  isMine: boolean;
  onClose: () => void;
  onDeleteMessage?: (messageId: number) => void;
  onForwardMessage?: (messageText: string) => void;
}

function formatMessageTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MessageOptionsModal({
  showMessage,
  message,
  anchorRect,
  isMine,
  onClose,
  onDeleteMessage,
  onForwardMessage,
}: MessageOptionsModalProps) {
  if (!showMessage || !message || !anchorRect) return null;

  const modalWidth = 192;
  const modalHeight = 210;

  const top = anchorRect.top - modalHeight + 50;
  const left = isMine ? anchorRect.right - modalWidth : anchorRect.left;

  const handleDeleteMessage = async () => {
    if (!message?.id) return;
    try {
      const response = await fetch(
        `/api/chat/messages?messageId=${message.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        onDeleteMessage?.(message.id);
        onClose();
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleForwardMessage = () => {
    if (!message?.text) return;
    
    // Call the parent's forward handler
    onForwardMessage?.(message.text);
  };

  const handleCopyMessage = () => {
    if (message?.text) {
      navigator.clipboard.writeText(message.text);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="bg-[#262626] rounded-2xl p-1 w-48 shadow-lg"
        style={{
          position: "fixed",
          top: `${Math.max(8, top)}px`,
          left: `${Math.max(8, left)}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Time header */}
        <div className="px-3 py-2 border-b border-white/10">
          <span
            className="block text-[12px] leading-4.5 font-normal"
            style={{
              color: "#a8a8a8",
              fontFamily:
                '-apple-system, "system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        <div className="py-1">
          <button
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
            onClick={handleForwardMessage}
          >
            <span className="text-white text-sm">Forward</span>
            <svg
              aria-label="Forward"
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="18"
              role="img"
              viewBox="0 0 24 24"
              width="18"
            >
              <title>Forward</title>
              <path
                d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
              <line
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                x1="7.488"
                x2="15.515"
                y1="12.208"
                y2="7.641"
              ></line>
            </svg>
          </button>

          <button
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
            onClick={handleCopyMessage}
          >
            <span className="text-white text-sm">Copy</span>
            <svg
              aria-label="Copy"
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="18"
              role="img"
              viewBox="0 0 24 24"
              width="18"
            >
              <title>Copy</title>
              <path d="m20.12 4.707-2.826-2.828A3.026 3.026 0 0 0 15.17 1h-5.167A3.007 3.007 0 0 0 7 4.004V5h-.996A3.007 3.007 0 0 0 3 8.004v11.992A3.007 3.007 0 0 0 6.004 23h7.992A3.007 3.007 0 0 0 17 19.996V19h.996A3.007 3.007 0 0 0 21 15.996V6.83a2.98 2.98 0 0 0-.88-2.123ZM18.586 6 16 6.001V3.414L18.586 6ZM15 19.996C15 20.55 14.55 21 13.996 21H6.004C5.45 21 5 20.55 5 19.996V8.004C5 7.45 5.45 7 6.004 7H7v8.996A3.007 3.007 0 0 0 10.004 19H15v.996ZM17.996 17h-7.992C9.45 17 9 16.55 9 15.996V4.004C9 3.45 9.45 3 10.004 3H14v3.001A2 2 0 0 0 15.999 8H19v7.996C19 16.55 18.55 17 17.996 17Z"></path>
            </svg>
          </button>

          {isMine ? (
            <button
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
              onClick={handleDeleteMessage}
            >
              <span className="text-red-500 text-sm">Unsend</span>
              <svg
                aria-label="Unsend"
                className="x1lliihq x1n2onr6 xkmlbd1"
                fill="currentColor"
                color="#ef4444"
                height="18"
                role="img"
                viewBox="0 0 24 24"
                width="18"
              >
                <title>Unsend</title>
                <path d="M12 .5C5.659.5.5 5.66.5 12S5.659 23.5 12 23.5c6.34 0 11.5-5.16 11.5-11.5S18.34.5 12 .5Zm0 21c-5.238 0-9.5-4.262-9.5-9.5S6.762 2.5 12 2.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5Z"></path>
                <path d="M14.5 10H9.414l1.293-1.293a1 1 0 1 0-1.414-1.414l-3 2.999a1 1 0 0 0 0 1.414l3 3.001a.997.997 0 0 0 1.414 0 1 1 0 0 0 0-1.414L9.415 12H14.5c.827 0 1.5.674 1.5 1.501 0 .395-.157.794-.431 1.096-.227.249-.508.403-.735.403L14 14.999a1 1 0 0 0-.001 2l.833.001h.002c.796 0 1.604-.386 2.215-1.059a3.625 3.625 0 0 0 .951-2.44C18 11.571 16.43 10 14.5 10Z"></path>
              </svg>
            </button>
          ) : (
            <button
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700 transition-colors rounded-lg"
              onClick={() => {
                console.log("Report message:", message);
                onClose();
              }}
            >
              <span className="text-red-500 text-sm">Report</span>
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
