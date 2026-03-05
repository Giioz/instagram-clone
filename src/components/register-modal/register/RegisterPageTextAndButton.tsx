interface  RegisterPageTextAndButton {
  isLoading: boolean;
}

export default function RegisterPageTextAndButton({ isLoading }: RegisterPageTextAndButton) {
  return (
    <>
      <div className="w-full flex flex-col gap-2.5 text-[15px] mb-0.75">
        <div className="text-gray-400">
          People who use our service may have uploaded your contact information
          to Instagram.{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Learn more
          </a>
        </div>

        <div className=" text-gray-400">
          By tapping Submit, you agree to create an account and to Instagram s{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms
          </a>
          , <br />
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Cookies Policy
          </a>
          .
        </div>

        <div className="text-gray-400">
          The Privacy describes the ways we can use the information we collect
          when you create an account. For example, we use this information to
          provide, personalize and improve our products, including ads.
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-140 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-[22px] transition duration-200 text-[14px]"
      >
        {isLoading ? 'Creating account...' : 'Submit'}
      </button>
    </>
  );
}
