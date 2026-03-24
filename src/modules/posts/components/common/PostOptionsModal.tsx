"use client";

import React from "react";

interface PostOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnfollow: () => void;
  onAddToFavorites: () => void;
  onGoToPost: () => void;
  onAboutAccount: () => void;
  showUnfollow?: boolean;
  user: {
    id: number;
    username: string;
    name: string;
    imageUrl?: string | null;
  };
}

export default function PostOptionsModal({
  isOpen,
  onClose,
  onUnfollow,
  onAddToFavorites,
  onGoToPost,
  onAboutAccount,
  showUnfollow = false,
  user,
}: PostOptionsModalProps) {
  if (!isOpen) return null;
  const buttonStyle = "w-full h-12 text-sm border-b border-[#363636] active:bg-[#363636] transition-colors text-center";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative bg-[#202328] rounded-[24px] w-full max-w-[400px] overflow-hidden flex flex-col">

        
        {showUnfollow && (
          <button
            onClick={onUnfollow}
            className={`${buttonStyle} text-[#ED4956] font-bold`}
          >
            Unfollow
          </button>
        )}
        
        <button
          onClick={onAddToFavorites}
          className={`${buttonStyle} text-white`}
        >
          Add to favorites
        </button>
        
        <button
          onClick={onGoToPost}
          className={`${buttonStyle} text-white`}
        >
          Go to post
        </button>
        
        <button
          onClick={onAboutAccount}
          className={`${buttonStyle} text-white`}
        >
          About this account
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 text-sm text-white active:bg-[#363636] transition-colors text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}