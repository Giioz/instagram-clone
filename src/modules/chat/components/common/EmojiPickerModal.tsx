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

  // Reset to quick-row every time the picker opens
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

  const totalHeight = showFullPicker
    ? quickRowHeight + fullPickerHeight
    : quickRowHeight;

  // Position above the anchor
  const top = Math.max(8, anchorRect.top - totalHeight - 8);

  // Horizontal: clamp to viewport
  const left = Math.min(
    Math.max(8, anchorRect.left + anchorRect.width / 2 - pickerWidth / 2),
    window.innerWidth - pickerWidth - 8
  );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-white/10"
        style={{
          position: "fixed",
          top: `${top}px`,
          left: `${left}px`,
          width: `${pickerWidth}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quick reaction row */}
        <div className="flex items-center justify-between px-3 py-2">
          {defaultEmojis.map((emoji) => (
            <button
              key={emoji}
              className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-2xl ${
                currentReaction === emoji ? "bg-white/20" : ""
              }`}
              onClick={() => {
                onEmojiSelect(emoji, isMine);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
          {/* Remove reaction button */}
          {currentReaction && (
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400 text-xl"
              onClick={() => {
                onEmojiSelect(currentReaction, isMine);
                onClose();
              }}
              title="Remove reaction"
            >
              ×
            </button>
          )}
          {/* + opens full picker */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors text-white text-xl font-light"
            onClick={() => setShowFullPicker(true)}
          >
            +
          </button>
        </div>

        {/* Full emoji picker — shown only after + is pressed */}
        {showFullPicker && (
          <div className="border-t border-white/10">
            <Picker
              onEmojiClick={(emojiData: any) => {
                onEmojiSelect(emojiData.emoji, isMine);
                onClose();
              }}
              skinTonesDisabled
              searchDisabled={false}
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
              width={pickerWidth}
              height={fullPickerHeight}
            />
          </div>
        )}
      </div>
    </div>
  );
}