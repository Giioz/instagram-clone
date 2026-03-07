import React from "react";

interface TextInputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function TextInput({
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = "",
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-136.5 h-15 px-4 py-3 rounded-2xl border border-[#445664] text-[#F1F4F7] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
