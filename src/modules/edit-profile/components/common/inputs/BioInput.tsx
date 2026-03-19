"use client";

interface BioInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export default function BioInput({ value, onChange, maxLength }: BioInputProps) {
  return (
    <div className=" mb-6">
      <label className="block text-white text-[16px] font-bold mb-4">
        Bio
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="Bio"
          maxLength={maxLength}
          className="w-full h-15.5 bg-[#0B1014] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          rows={4}
        />
        <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
