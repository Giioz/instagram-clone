interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  text?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  isLoading,
  loadingText = "Creating account...",
  text = "Submit",
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="
        w-full h-10
        md:w-140 md:h-11
        text-[14px]
        mt-2
        bg-[rgb(0,100,224)]
        rounded-[22px]
        text-white
        font-semibold
      "
    >
      {isLoading ? loadingText : text}
    </button>
  );
}