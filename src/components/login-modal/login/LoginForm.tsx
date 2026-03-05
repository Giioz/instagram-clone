"use client";

import { useLoginForm } from "@/src/hooks/useLoginForm";
import Header from "../../register-modal/register/Header";
import FormContent from "./FormContent";



export default function LoginForm() {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-[#162127] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-160">
        <Header />
        <div className="bg-[#162127] rounded-lg w-full p-8">
          <h2 className="text-[24px] font-bold text-white mb-6">
            Log in to Instagram
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
            isLoading={isLoading}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:underline font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
