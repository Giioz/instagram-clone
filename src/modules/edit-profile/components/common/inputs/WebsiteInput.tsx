"use client";

interface WebsiteInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function WebsiteInput({ value, onChange }: WebsiteInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-white text-[16px] font-bold mb-4">
        Website
      </label>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="website"
        className="w-full bg-[#262626] border border-white/10 rounded-xl h-10.5 text-[16px] text-white px-3 placeholder:font-medium placeholder:text-[#a8a8a8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      />
    </div>
  );
}
