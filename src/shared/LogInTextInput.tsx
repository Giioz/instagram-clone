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
  const newLocal =
    "w-[546px] h-[60px] bg-[rgb(68, 86, 100)] border-[1px] border-[rgb(68, 86, 100)] rounded-[16px]";
  return (
    <div>
      <input
        name={name}
        type={type}
        required={required}
        className={newLocal + " px-4 py-3 " + className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
