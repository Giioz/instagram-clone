"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Story, User } from "@prisma/client";
import { useAuth } from "@/src/hooks/useAuth";
import { useStories } from "@/src/hooks/useStories";
import UserPreview from "./UserPreview";
import StoryHeader from "./StoryHeader";
import StoryContent from "./StoryContent";
import NavigationButtons from "./NavigationButtons";
import StoryActions from "./StoryActions";

interface GroupedStoriesType {
  user: User;
  stories: Story[];
}

interface StoryViewerProps {
  allGroupedStories: GroupedStoriesType[];
  currentUserIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryViewer({
  allGroupedStories,
  currentUserIndex,
  isOpen,
  onClose,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserIdx, setCurrentUserIdx] = useState(currentUserIndex);
  const [progress, setProgress] = useState(0);
  const [groupedStories, setGroupedStories] = useState(allGroupedStories);
  const { user } = useAuth();
  const { handleDelete } = useStories();

  useEffect(() => {
    setGroupedStories(allGroupedStories);
  }, [allGroupedStories]);

  const currentUser = groupedStories[currentUserIdx];
  const stories = currentUser?.stories || [];

  useEffect(() => {
    setCurrentUserIdx(currentUserIndex);
    setCurrentStoryIndex(0);
    setProgress(0);
  }, [currentUserIndex]);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            if (currentUserIdx < groupedStories.length - 1) {
              setCurrentUserIdx(currentUserIdx + 1);
              setCurrentStoryIndex(0);
              return 0;
            } else {
              return 100;
            }
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, currentUserIdx, stories.length, groupedStories.length, isOpen]);

  useEffect(() => {
    if (progress === 100) {
      onClose();
    }
  }, [progress, onClose]);

  useEffect(() => setProgress(0), [currentStoryIndex, currentUserIdx]);

  const handlePreviousUserOrStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else if (currentUserIdx > 0) {
      const prevUserIdx = currentUserIdx - 1;
      const prevUserStories = groupedStories[prevUserIdx].stories;
      setCurrentUserIdx(prevUserIdx);
      setCurrentStoryIndex(prevUserStories.length - 1);
      setProgress(0);
    }
  };

  const handleNextUserOrStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else if (currentUserIdx < groupedStories.length - 1) {
      setCurrentUserIdx(currentUserIdx + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleStoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width / 3) handlePreviousUserOrStory();
    else if (x > (width * 2) / 3) handleNextUserOrStory();
  };

  const handleDeleteStory = async () => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory && user && parseInt(user.userId) === currentStory.userId) {
      try {
        await handleDelete(currentStory.id);

        setGroupedStories((prev) =>
          prev.map((group) => ({
            ...group,
            stories: group.stories.filter((s) => s.id !== currentStory.id),
          }))
        );

        onClose();
      } catch (error) {
        console.error("Failed to delete story:", error);
      }
    }
  };

  if (!isOpen || !currentUser || stories.length === 0) return null;
  const currentStory = stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-[#1A1A1A] z-50 flex items-center justify-center">
      {currentUserIdx > 0 && (
        <UserPreview
          user={groupedStories[currentUserIdx - 1].user}
          stories={groupedStories[currentUserIdx - 1].stories}
          position="left"
          onClick={() => {
            setCurrentUserIdx(currentUserIdx - 1);
            setCurrentStoryIndex(0);
            setProgress(0);
          }}
        />
      )}
      {currentUserIdx < groupedStories.length - 1 && (
        <UserPreview
          user={groupedStories[currentUserIdx + 1].user}
          stories={groupedStories[currentUserIdx + 1].stories}
          position="right"
          onClick={() => {
            setCurrentUserIdx(currentUserIdx + 1);
            setCurrentStoryIndex(0);
            setProgress(0);
          }}
        />
      )}
      <div className="relative w-[399px] max-w-full h-[709.328px] flex flex-col bg-gray-900 rounded-lg overflow-hidden text-base font-sans select-none transition-all duration-300 ease-in-out">
        <StoryHeader
          currentUser={currentUser.user}
          currentStory={currentStory}
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          progress={progress}
          user={user}
          onClose={onClose}
          onDeleteStory={handleDeleteStory}
        />

        <StoryContent
          currentStory={currentStory}
          currentUser={currentUser.user}
          onStoryClick={handleStoryClick}
        />

        <NavigationButtons
          onPrevious={handlePreviousUserOrStory}
          onNext={handleNextUserOrStory}
          disabledPrevious={currentStoryIndex === 0 && currentUserIdx === 0}
          disabledNext={currentStoryIndex === stories.length - 1 && currentUserIdx === groupedStories.length - 1}
        />

        <StoryActions currentUser={currentUser.user} />
      </div>
    </div>
  );
}