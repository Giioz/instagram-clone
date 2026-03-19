"use client";

import { ChevronDown } from "lucide-react";
import { Gender } from "../../../types/types";

interface GenderSelectProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <div className="mb-6">
      <label className="block text-white text-[16px] font-bold mb-4">
        Gender
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as Gender)}
          className="w-full h-12.5 bg-[#0B1014] border border-white/10 rounded-xl px-3 text-[16px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="PREFER_NOT_TO_SAY" className="bg-[#1A1F24]">
            Prefer not to say
          </option>
          <option value="MALE" className="bg-[#1A1F24]">
            Male
          </option>
          <option value="FEMALE" className="bg-[#1A1F24]">
            Female
          </option>
          <option value="CUSTOM" className="bg-[#1A1F24]">
            Custom
          </option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>
      <p className="text-gray-400 text-xs mt-2">
        This won t be part of your public profile.
      </p>
    </div>
  );
}
