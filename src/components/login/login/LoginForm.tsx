"use client";

import { useLoginForm } from "@/src/hooks/useLoginForm";

import LoginFormContent from "./LoginFormContent";
import LoginLeftSide from "./LoginLeftSide";

export default function LoginForm() {
  const { formData, isLoading, error, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="flex h-[91vh]  ">
      <div className="w-194.5 border-r-2 border-gray-300 bg-[#0B1014]">
        <LoginLeftSide />
      </div>
      <div className="w-185 m-auto bg-white ">
        <div className="w-full max-w-md px-8">
          <h2 className="text-[24px] font-bold text-gray-800 mb-6 text-center">
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
      </div>
    </div>
  );
}
