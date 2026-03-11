import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  disabledPrevious: boolean;
  disabledNext: boolean;
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  disabledPrevious,
  disabledNext,
}: NavigationButtonsProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        disabled={disabledPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={onNext}
        disabled={disabledNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
}
