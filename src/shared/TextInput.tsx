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
  const inputStyle =
    "w-full h-12 md:w-[560px] md:h-[60px]  border border-[#445664] rounded-[16px]";

  return (
    <div className="w-full">
      <input
        name={name}
        type={type}
        required={required}
        className={inputStyle + " px-4 py-3 " + className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}