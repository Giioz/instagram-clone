"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Plus, MapPin, Smile, Users, ChevronDown } from "lucide-react";
import NextImage from "next/image";
import { MiniPhotoPanel } from "./MiniPhotoPanel";

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string[];
  onPostCreated?: () => void;
  onAddMoreImages?: (newImages: string[]) => void;
  currentUser?: {
    username: string;
    imageUrl?: string | null;
  };
}

export function PostPreviewModal({ 
  isOpen, 
  onClose, 
  imageUrls,
  onPostCreated,
  onAddMoreImages,
  currentUser
}: PostPreviewModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [altTexts, setAltTexts] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hideLikeCounts, setHideLikeCounts] = useState(false);
  const [turnOffCommenting, setTurnOffCommenting] = useState(false);

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res && res.length > 0) {
      const newUrls = res.map((file) => file.url);
      onAddMoreImages?.(newUrls);
    }
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: content.trim(),
        imageUrls: imageUrls,
        commentsDisabled: turnOffCommenting,
      };

      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (response.ok) {
        setContent("");
        onClose();
        onPostCreated?.();
        
        if ((window as any).refreshPosts) {
          (window as any).refreshPosts();
        }
        setAltTexts([]);
        setHideLikeCounts(false);
        setTurnOffCommenting(false);
      } else {
        alert(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleAddMoreClick = () => {
    setShowAddModal(true);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (imageUrls.length <= 1) return;
    const newUrls = imageUrls.filter((_, idx) => idx !== indexToRemove);
    onAddMoreImages?.(newUrls);
    if (currentIndex >= newUrls.length) {
      setCurrentIndex(newUrls.length - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 ">
        <div className=" w-full max-w-[880px] h-[583.082px] rounded-[24px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-[42.0881px] flex items-center justify-between px-4 bg-[rgb(12,16,20)]">
            <button onClick={onClose} className="text-white hover:text-gray-300">
<svg aria-label="Back" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
            </button>
            <h2 className="text-white font-semibold text-base">Create new post</h2>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
className="text-[rgb(133,161,255)] hover:text-[#A3BCFF] hover:underline font-semibold text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Share"}
            </button>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="flex-1 flex">
            {/* Left - Image Preview */}
            <div className="flex-1 bg-black flex flex-col relative">
              {/* Main Image */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="relative w-full h-full">
                  <NextImage
                    src={imageUrls[currentIndex]}
                    alt={`Preview ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>
                
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* MiniPhotoPanel inside image area */}
                <div className="absolute bottom-4 right-4 z-50">
                  <MiniPhotoPanel
                    imageUrls={imageUrls}
                    currentIndex={currentIndex}
                    onSelectImage={setCurrentIndex}
                    onRemoveImage={handleRemoveImage}
                    isUploading={isUploading}
                    onUploadComplete={handleUploadComplete}
                    onUploadBegin={() => setIsUploading(true)}
                    onUploadError={(error: Error) => {
                      console.error("Upload error:", error);
                      alert(`Upload failed: ${error.message}`);
                      setIsUploading(false);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right - Details Panel */}
            <div className="w-[339.091px] bg-[#202328] border-l border-[#363636] flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#555] scrollbar-track-transparent hover:scrollbar-thumb-[#777]">
              {/* User Info */}
              <div className="p-4 h-[59.9929px] ">
                <div className="flex items-center h gap-3">
                  <div className="w-[27.9972px] h-[27.9972px] rounded-full bg-gray-600 overflow-hidden">
                    {currentUser?.imageUrl ? (
                      <NextImage
                        src={currentUser.imageUrl}
                        alt={currentUser.username}
                        width={28}
                        height={28}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-sm">
                        {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-white font-semibold text-[14px]">
                    {currentUser?.username || "username"}
                  </span>
                </div>
              </div>

              {/* Caption Input */}
              <div className="flex-1 p-4 border-none relative">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 2200))}
                  placeholder="Write a caption..."
                  maxLength={2200}
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
                <div className="absolute bottom-4 left-4">
                  <Smile size={20} className="text-gray-500 cursor-pointer hover:text-gray-300" />
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="text-xs text-gray-500">{content.length}/2,200</span>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-[#363636] transition"
                >
                  <span className="text-[16px] font-bold">Advanced settings</span>
                  <ChevronDown 
                    size={21} 
                    className={`text-white transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                  />
                </button>
                {showAdvanced && (
                  <div className="px-4 py-3 bg-[#202328] space-y-6">
                    {/* Hide like and view counts */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-[16px] font-normal">Hide like and view counts on this post</span>
                        <button
                          onClick={() => setHideLikeCounts(!hideLikeCounts)}
                          className={`w-[44px] h-[28px] rounded-full transition-colors relative ${hideLikeCounts ? 'bg-[#0095f6]' : 'bg-[#363636]'}`}
                        >
                          <div className={`w-[24px] h-[24px] bg-white rounded-full absolute top-[2px] transition-all ${hideLikeCounts ? 'left-[18px]' : 'left-[2px]'}`} />
                        </button>
                      </div>
                      <p className="text-[rgb(168,168,168)] text-[12px]">
                        Only you will see the total number of likes and views on this post. You can change this later by going to the ⋯ menu at the top of the post. To hide like counts on other people&apos;s posts, go to your account settings.
                      </p>
                      <button className="text-[rgb(112,141,255)] text-[12px] hover:underline mt-1">Learn more</button>
                    </div>

                    {/* Turn off commenting */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-[16px] font-normal">Turn off commenting</span>
                        <button
                          onClick={() => setTurnOffCommenting(!turnOffCommenting)}
                          className={`w-[44px] h-[28px] rounded-full transition-colors relative ${turnOffCommenting ? 'bg-[#0095f6]' : 'bg-[#363636]'}`}
                        >
                          <div className={`w-[24px] h-[24px] bg-white rounded-full absolute top-[2px] transition-all ${turnOffCommenting ? 'left-[18px]' : 'left-[2px]'}`} />
                        </button>
                      </div>
                      <p className="text-[rgb(168,168,168)] text-[12px]">
                        You can change this later by going to the ⋯ menu at the top of your post.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accessibility */}
              <div>
                <button 
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-[#363636] transition"
                >
                  <span className="text-[16px] font-bold">Accessibility</span>
                  <ChevronDown 
                    size={21} 
                    className={`text-white transition-transform ${showAccessibility ? 'rotate-180' : ''}`} 
                  />
                </button>
                {showAccessibility && (
                  <div className="px-4 py-3 bg-[#202328]">
                    <p className="text-[#A8A8A8] text-[12px] mb-4">
                      Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.
                    </p>
                    <div className="space-y-3">
                      {imageUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-[44px] h-[44px] rounded-md overflow-hidden flex-shrink-0">
                            <NextImage
                              src={url}
                              alt={`Image ${idx + 1}`}
                              width={44}
                              height={44}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <input
                            type="text"
                            value={altTexts[idx] || ""}
                            onChange={(e) => {
                              const newAltTexts = [...altTexts];
                              newAltTexts[idx] = e.target.value;
                              setAltTexts(newAltTexts);
                            }}
                            placeholder="Write alt text..."
                            className="flex-1 bg-transparent rounded-[6px] text-white h-[44px] p-[14px]  text-sm placeholder-[#737373] border border-[#262626]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}
