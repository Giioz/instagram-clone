import TextInput from '../shared/TextInput';
import BirthdayInput from '../shared/BirthdayInput';
import LegalTextAndButton from './LegalTextAndButton';

interface FormContentProps {
  formData: {
    email: string;
    password: string;
    name: string;
    username: string;
    month: string;
    day: string;
    year: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  usernameError: string;
  isLoading: boolean;
  months: { value: string; label: string }[];
  days: { value: string; label: string }[];
  years: { value: string; label: string }[];
}

export default function FormContent({
  formData,
  handleChange,
  handleSubmit,
  usernameError,
  isLoading,
  months,
  days,
  years
}: FormContentProps) {
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

      {/* Birthday */}
      <div>
        <label className="text-[17px] font-semibold mb-1.25 block">
          Birthday
        </label>

        <div className="flex gap-4 w-full">
          <BirthdayInput
            name="month"
            value={formData.month}
            onChange={handleChange}
            options={months}
            placeholder="Month"
            required
            className="flex-1"
          />

          <BirthdayInput
            name="day"
            value={formData.day}
            onChange={handleChange}
            options={days}
            placeholder="Day"
            required
            className="flex-1"
          />

          <BirthdayInput
            name="year"
            value={formData.year}
            onChange={handleChange}
            options={years}
            placeholder="Year"
            required
            className="flex-1"
          />
        </div>
      </div>

      <label className="text-[17px] font-semibold mb-1.25 block">
        Name
      </label>
      <TextInput
        name="name"
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label className="text-[17px] font-semibold mb-1.25 block">
        Username
      </label>
      <TextInput
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        error={usernameError}
      />

      <LegalTextAndButton isLoading={isLoading} />
    </form>
  );
}