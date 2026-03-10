import Link from "next/link";

import SubmitButton from "@/src/shared/SubmitButton";
import HaveAccountButton from "@/src/shared/HaveAccountButton";

interface RegisterPageTextAndButton {
  isLoading: boolean;
}

export default function RegisterPageTextAndButton({
  isLoading,
}: RegisterPageTextAndButton) {
  return (
    <>
      <div className="w-full md:w-[560px] flex flex-col gap-2.5 text-[15px]">
        <div className="text-white">
          People who use our service may have uploaded your contact information
          to Instagram.{" "}
          <Link href="#" className="font-semibold text-[#4CA9FE] hover:underline">
            Learn more
          </Link>
        </div>

        <div className="text-white">
          By tapping Submit, you agree to create an account and to Instagram's{" "}
          <Link href="#" className="font-semibold text-[#4CA9FE] hover:underline">
            Terms
          </Link>
          ,{" "}
          <Link href="#" className="font-semibold text-[#4CA9FE] hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-semibold text-[#4CA9FE] hover:underline">
            Cookies Policy
          </Link>
          .
        </div>

        <div className="text-white">
          The{" "}
          <Link href="#" className="font-semibold text-[#4CA9FE] hover:underline">
            Privacy Policy
          </Link>{" "}
          describes the ways we can use the information we collect when you
          create an account. For example, we use this information to provide,
          personalize and improve our products, including ads.
        </div>
      </div>

      <div className="w-full md:w-[560px] flex flex-col gap-3">
        <SubmitButton isLoading={isLoading} />
        <HaveAccountButton />
      </div>
    </>
  );
}