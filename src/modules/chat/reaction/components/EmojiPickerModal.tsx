"use client";

import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string, isMine: boolean) => void;
  anchorRect: DOMRect | null;
  isMine: boolean;
  currentReaction?: string;
}

const defaultEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍"];

export default function EmojiPickerModal({
  isOpen,
  onClose,
  onEmojiSelect,
  anchorRect,
  isMine,
  currentReaction,
}: EmojiPickerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showFullPicker, setShowFullPicker] = useState(false);

  useEffect(() => {
    if (isOpen) setShowFullPicker(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !anchorRect) return null;

  const quickRowHeight = 56;
  const fullPickerHeight = 350;
  const pickerWidth = showFullPicker ? 320 : 296;
  const totalHeight = showFullPicker ? quickRowHeight + fullPickerHeight : quickRowHeight;
  const top = Math.max(8, anchorRect.top - 8 - totalHeight);
  const left = isMine
    ? Math.min(
        Math.max(8, anchorRect.right - pickerWidth),
        window.innerWidth - pickerWidth - 8
      )
    : Math.min(
        Math.max(8, anchorRect.left),
        window.innerWidth - pickerWidth - 8
      );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-[#1e1e1e] rounded-[26px] shadow-xl overflow-hidden border border-white/10"
        style={{
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          width: `${pickerWidth}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center px-3 py-2">
          {defaultEmojis.map((emoji) => (
            <button
              key={emoji}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl transition-colors hover:bg-white/10 ${
                currentReaction === emoji ? "bg-white/10" : ""
              }`}
              onClick={() => {
                onEmojiSelect(emoji, isMine);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a3a3a] text-xl font-light text-white transition-colors hover:bg-[#4a4a4a]"
            onClick={() => setShowFullPicker(true)}
          >
            +
          </button>
        </div>
            {showFullPicker && (
              <div className="border-t border-white/10 [&_.EmojiPickerReact]:!bg-[#1e1e1e] [&_.epr-header]:!bg-[#1e1e1e] [&_.epr-body]:!bg-[#1e1e1e] [&_.epr-category-nav]:!bg-[#1e1e1e] [&_.epr-search-container_input]:!bg-[#2a2a2a] [&_.epr-search-container_input]:!text-white [&_.epr-emoji-category-label]:!bg-[#1e1e1e] [&_.epr-emoji-category-label]:!text-gray-400">
                <Picker
                  onEmojiClick={(emojiData: any) => {
                    onEmojiSelect(emojiData.emoji, isMine);
                    onClose();
                  }}
                  skinTonesDisabled
                  searchDisabled={false}
                  previewConfig={{ showPreview: false }}
                  lazyLoadEmojis
                  theme={"dark" as any}
                  width={pickerWidth}
                  height={fullPickerHeight}
                />
              </div>
            )}
      </div>
    </div>
  );
}