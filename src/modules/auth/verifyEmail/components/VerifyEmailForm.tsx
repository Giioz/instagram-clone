"use client";

import { useVerifyEmailForm } from "@/src/modules/auth/verifyEmail/hooks/useVerifyEmailForm";
import FormInputs from "@/src/modules/auth/components/FormInputs";

export default function VerifyEmailForm() {
  const { code, isLoading, error, handleChange, handleSubmit } =
    useVerifyEmailForm();

  return (
    <div className="min-h-screen bg-[#162127] text-[white] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-157">
        <div className="bg-[#162127] rounded-lg w-full p-8">
          <h2 className="text-[24px] font-semibold text-white mb-4">
            Verify your email
          </h2>
          <p className="text-[15px] font-normal text-white mb-6">
            We ve sent a verification code to your email. Please enter it below.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            <label className="text-[17px] font-medium mb-1.25 block leading-5.5">
              Verification code
            </label>
            <FormInputs
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleChange}
              required
              maxLength={6}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0095F6] hover:bg-[#1877F2] disabled:bg-[#0095F6]/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
