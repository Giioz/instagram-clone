"use client";

import { useRegisterForm } from "../../../hooks/useRegisterForm";
import FormContent from "./FormContent";
import Header from "./Header";

export default function RegisterForm() {
  const {
    formData,
    usernameError,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    months,
    days,
    years,
  } = useRegisterForm();

  return (
    <div className="min-h-screen bg-[#162127] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-160">
        <Header />
        <div className="bg-[#162127] rounded-lg w-full p-8">
          <h2 className="text-[24px] font-bold text-white ">
            Get started on Instagram
          </h2>

          <p className=" text-[15px] text-gray-400 mb-1.25">
            Sign up to see photos and videos from your friends.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <FormContent
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            usernameError={usernameError}
            isLoading={isLoading}
            months={months}
            days={days}
            years={years}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:underline font-semibold"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
