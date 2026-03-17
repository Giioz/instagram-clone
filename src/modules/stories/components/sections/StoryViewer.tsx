import type { Story, User } from "@prisma/client";
import { useStoryViewer } from "@/src/modules/stories/hooks/useStoryViewer";
import UserPreview from "../common/UserPreview";
import StoryHeader from "./StoryHeader";
import StoryContent from "./StoryContent";
import NavigationButtons from "../common/NavigationButtons";
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
  const {
    currentStoryIndex,
    currentUserIdx,
    progress,
    groupedStories,
    currentUser,
    stories,
    currentStory,
    user,
    isPaused,
    setIsPaused,
    handlePreviousUserOrStory,
    handleNextUserOrStory,
    handleStoryClick,
    handleDeleteStory,
    handleUserPreviewClick,
  } = useStoryViewer({
    allGroupedStories,
    currentUserIndex,
    isOpen,
    onClose,
  });

  if (!isOpen || !currentUser || stories.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="hidden min-[801px]:flex absolute left-[calc(50%-200px)] -translate-x-full top-0 bottom-0 items-center gap-10 p-10">
        {currentUserIdx > 1 && (
          <UserPreview
            user={groupedStories[currentUserIdx - 2].user}
            stories={groupedStories[currentUserIdx - 2].stories}
            position="left"
            onClick={() => handleUserPreviewClick(currentUserIdx - 2)}
          />
        )}

        {currentUserIdx > 0 && (
          <UserPreview
            user={groupedStories[currentUserIdx - 1].user}
            stories={groupedStories[currentUserIdx - 1].stories}
            position="left"
            onClick={() => handleUserPreviewClick(currentUserIdx - 1)}
          />
        )}
      </div>
      <div className="relative flex flex-col w-full h-full bg-black overflow-hidden
        min-[801px]:w-[400px]
        min-[801px]:h-[710px]
        min-[801px]:rounded-lg
        min-[801px]:bg-gray-900">

        <StoryHeader
          currentUser={currentUser.user}
          currentStory={currentStory}
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          progress={progress}
          user={user}
          onClose={onClose}
          onDeleteStory={handleDeleteStory}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
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
          disabledNext={
            currentStoryIndex === stories.length - 1 &&
            currentUserIdx === groupedStories.length - 1
          }
        />

        <StoryActions currentUser={currentUser.user} currentStory={currentStory} />
      </div>
      <div className="hidden min-[801px]:flex absolute left-[calc(50%+200px)] top-0 bottom-0 items-center gap-10 p-10">
        {currentUserIdx < groupedStories.length - 1 && (
          <UserPreview
            user={groupedStories[currentUserIdx + 1].user}
            stories={groupedStories[currentUserIdx + 1].stories}
            position="right"
            onClick={() => handleUserPreviewClick(currentUserIdx + 1)}
          />
        )}

        {currentUserIdx < groupedStories.length - 2 && (
          <UserPreview
            user={groupedStories[currentUserIdx + 2].user}
            stories={groupedStories[currentUserIdx + 2].stories}
            position="right"
            onClick={() => handleUserPreviewClick(currentUserIdx + 2)}
          />
        )}
      </div>
    </div>
  );
}