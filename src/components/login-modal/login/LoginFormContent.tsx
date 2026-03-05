import TextInput from '../../register-modal/shared/TextInput';

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
  isLoading
}: LoginFormContentProps) {
  return (
    <form className="space-y-5 w-full" onSubmit={handleSubmit}>
      <label className="text-[17px] font-semibold mb-1.25 block">
        Mobile number or email
      </label>
      <TextInput
        name="email"
        type="text"
        placeholder="Mobile number or email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <p className="text-[15px] font-semibold mb-3.75 ">
        You may receive notifications from us.{' '}
        <a href="#" className="text-blue-400 hover:underline">
          Learn why we ask for your contact <br /> information
        </a>
      </p>

      <label className="text-[17px] font-semibold mb-1.25 block">
        Password
      </label>
      <TextInput
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[rgb(0,149,246)] text-white font-semibold py-3 rounded-lg hover:bg-[rgb(0,119,206)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
