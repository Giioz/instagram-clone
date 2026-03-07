import LogInTextInput from "../../../shared/LogInTextInput";
import Link from "next/link";

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
    <div className="w-full ml-12 ">
      <form className="space-y-5 w-136.5 flex flex-col" onSubmit={handleSubmit}>
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
          className="w-full bg-[#1d4ed8] text-white font-medium py-3 rounded-full hover:bg-[#1e40af] disabled:opacity-50 transition"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-gray-300 text-sm text-center cursor-pointer hover:underline mt-3 ">
          Forgot password?
        </p>

        <Link
          href="/register"
          className="w-136.5 border mt-5 border-blue-400 text-blue-400 py-3 rounded-full hover:bg-blue-400/10 transition text-center block"
        >
          Create new account
        </Link>
      </form>
    </div>
  );
}
