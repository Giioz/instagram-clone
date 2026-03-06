"use client";

import { useRegisterForm } from "@/src/hooks/useRegisterForm";
import Link from "next/link";
import FormContent from "./FormContent";

export default function RegisterForm() {
  const {
    formData,
    isLoading,
    error,
    usernameError,
    handleChange,
    handleSubmit,
    months,
    days,
    years,
  } = useRegisterForm();

  return (
    <div className="min-h-screen bg-[#162127] text-[white] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-160">
        <div className="bg-[#162127] rounded-lg w-full p-8">
          <h2 className="text-[24px] font-bold text-white mb-6">
            Sign up to Instagram
          </h2>

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
            <Link
              href="/login"
              className="text-blue-400 hover:underline font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
