"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useStories } from "@/src/hooks/useStories";
import StoryUploadModal from "./StoryUploadModal";
import StoryItem from "./StoryItem";
import StoryViewer from "./StoryViewer";
import StoryCircle from "@/src/modules/common/components/StoryCircle";

export default function Stories() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const { groupedStories, loading, uploading, handleUpload } = useStories();

  if (loading) {
    return (
      <div className="flex gap-4 p-4 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <StoryCircle className="animate-pulse" key={i}>
            <div className="w-full h-full bg-gray-800 rounded-full"></div>
          </StoryCircle>
        ))}
      </div>
    );
  }

  return (
    <>
    
      <div className="rounded-lg mb-6 relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={7.5}
          slidesPerView={6}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
        >
          <SwiperSlide>
            <div className="flex flex-col items-center gap-0.5">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center hover:opacity-90 transition"
              >
                <StoryCircle>
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <Plus size={24} className="text-white" />
                  </div>
                </StoryCircle>
              </button>
              <span className="text-[12px] text-gray-300">Your story</span>
            </div>
          </SwiperSlide>
          {groupedStories.map((groupedStory, index) => (
            <SwiperSlide key={groupedStory.user.id}>
              <StoryItem 
                groupedStory={groupedStory} 
                onClick={() => setSelectedUserIndex(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
      <StoryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        uploading={uploading}
      />
      {selectedUserIndex !== null && (
        <StoryViewer
          allGroupedStories={groupedStories}
          currentUserIndex={selectedUserIndex}
          isOpen={selectedUserIndex !== null}
          onClose={() => setSelectedUserIndex(null)}
        />
      )}
    </>
  );
}
