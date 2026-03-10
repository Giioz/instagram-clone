"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useStories } from "@/src/hooks/useStories";
import StoryUploadModal from "./StoryUploadModal";
import StoryItem from "./StoryItem";

export default function Stories() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { stories, loading, uploading, handleUpload } = useStories();

  if (loading) {
    return (
      <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={6}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
        >
          <SwiperSlide>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <Plus size={24} className="text-white" />
              </button>
              <span className="text-xs text-gray-300">Your story</span>
            </div>
          </SwiperSlide>
          {stories.map((story) => (
            <SwiperSlide key={story.id}>
              <StoryItem story={story} />
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
    </>
  );
}
