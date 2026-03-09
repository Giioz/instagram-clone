import React from "react";

interface SelectInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function SelectInput({
  name,
  value,
  onChange,
  options,
  placeholder = "",
  required = false,
}: SelectInputProps) {
  return (
    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="
        w-full h-12
        md:w-43.75 md:h-15
        border border-[#445664]
        rounded-2xl
        px-4 py-3
      "
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}