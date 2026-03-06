"use client";

import { useLoginForm } from "@/src/hooks/useLoginForm";
import Link from "next/link";

import LoginFormContent from "./LoginFormContent";
export default function LoginForm() {
  const { formData, isLoading, error, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="min-h-screen bg-[#162127] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-160">
        <div className="bg-[#162127] rounded-lg w-full p-8">
          <h2 className="text-[24px] font-bold text-white mb-6">
            Log in to Instagram
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <LoginFormContent
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
