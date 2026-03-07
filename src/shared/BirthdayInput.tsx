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
      className={`w-43.75 h-15 bg-[rgb(68, 86, 100)] border border-[rgb(68, 86, 100)] rounded-2xl px-4 py-3`}
      value={value}
      onChange={onChange}
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
