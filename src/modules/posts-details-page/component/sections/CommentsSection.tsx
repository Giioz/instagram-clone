import CommentItem from "@/src/modules/comment/component/common/CommentItem";

interface CommentsSectionProps {
  comments: any[];
  isLoading: boolean;
  error: string | null;
  postAuthorUsername: string;
  onDelete: (commentId: number) => void;
}

export default function CommentsSection({ 
  comments, 
  isLoading, 
  error, 
  postAuthorUsername, 
  onDelete 
}: CommentsSectionProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 flex flex-col items-center justify-center h-full">
          <p className="text-gray-500 text-[24px] font-bold">No comments yet.</p>
          <p className="text-gray-400 text-[14px] font-normal mt-1">Start the conversation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postAuthorUsername={postAuthorUsername}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
