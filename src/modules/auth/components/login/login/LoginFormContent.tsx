
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogInTextInput from "@/src/shared/LogInTextInput";

interface LoginFormContentProps {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  fieldErrors: {
    email?: string;
    password?: string;
  };
}

export default function LoginFormContent({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  fieldErrors,
}: LoginFormContentProps) {
  return (
    <div className="w-full lg:w-143.75 mx-auto px-4">
      <div className="flex items-center mb-8">
        <button className="mr-4 p-2 ">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-[17px] font-medium text-white">Log into Instagram</h1>
      </div>
      <form className="flex flex-col space-y-5 " onSubmit={handleSubmit}>
        <LogInTextInput
          name="email"
          type="text"
          placeholder="Mobile number, username or email"
          value={formData.email}
          onChange={handleChange}
          required
          error={fieldErrors.email}
        />
        <LogInTextInput
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          error={fieldErrors.password}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1d4ed8] text-white font-medium py-3 rounded-full hover:bg-[#1e40af] disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-gray-300 text-sm text-center cursor-pointer hover:underline mt-3">
          Forgot password?
        </p>
        <Link
          href="/register"
          className="w-full border border-blue-400 text-blue-400 py-3 rounded-full hover:bg-blue-400/10 transition text-center block mt-5"
        >
          Create new account
        </Link>
      </form>
    </div>
  );
}
