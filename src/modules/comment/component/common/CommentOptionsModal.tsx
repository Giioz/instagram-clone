interface CommentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function CommentOptionsModal({
  isOpen,
  onClose,
  onDelete,
}: CommentOptionsModalProps) {
  if (!isOpen) return null;
  const buttonStyle = "w-full h-12 text-sm border-b border-[#363636] active:bg-[#363636] hover:bg-[#363636] transition-colors text-center";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative bg-[#202328] rounded-[24px] w-full max-w-[400px] overflow-hidden flex flex-col">
        
        <button
          onClick={onDelete}
          className={`${buttonStyle} text-[#ED4956] font-bold`}
        >
          Delete
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
