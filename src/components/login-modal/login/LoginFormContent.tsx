import TextInput from "../../register-modal/shared/TextInput";

interface LoginFormContentProps {
  formData: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function LoginFormContent({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
}: LoginFormContentProps) {
  return (
    <form
      className="space-y-5 w-full flex flex-col items-center"
      onSubmit={handleSubmit}
    >
      <div className="w-full">
        <TextInput
          name="email"
          type="text"
          placeholder="Mobile number or email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="w-full">
        <TextInput
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[rgb(0,149,246)] text-white font-semibold py-3 rounded-full hover:bg-[rgb(0,119,206)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}