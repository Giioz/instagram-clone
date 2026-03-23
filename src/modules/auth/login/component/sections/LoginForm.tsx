"use client";

import { useLoginForm } from "@/src/modules/auth/login/hooks/useLoginForm";

import LoginFormContent from "./LoginFormContent";
import LoginLeftSide from "./LoginLeftSide";

export default function LoginForm() {
  const {
    formData,
    isLoading,
    error,
    fieldErrors,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex flex-col md:flex-row h-[91vh] border-b-1 border-[#3D4F5C] overflow-hidden">
      <div className="w-full md:w-194.5 border-r-2 border-[#3D4F5C] overflow-y-auto">
        <LoginLeftSide />
      </div>
      <div className="w-full md:w-185 m-auto overflow-y-auto">
        <div className="w-full px-8 py-4">
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
            fieldErrors={fieldErrors}
          />
        </div>
      </div>
    </div>
  );
}
