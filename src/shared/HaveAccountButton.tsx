import Link from "next/link";

export default function HaveAccountButton() {
  return (
    <Link
      href="/login"
      className="
        w-full h-10
        md:w-140 md:h-11
        text-[14px]
        bg-transparent
        rounded-[22px]
        border border-[#445664]
        text-white
        font-semibold
        flex items-center justify-center
      "
    >
      I have already an account
    </Link>
  );
}