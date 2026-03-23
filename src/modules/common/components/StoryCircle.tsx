import React from "react";

interface StoryCircleProps {
  children: React.ReactNode;
  className?: string;
}

export default function StoryCircle({ children, className = "" }: StoryCircleProps) {
  return (
    <div 
      className={`w-[89px] h-[89px] rounded-full p-[3.5px] ${className}`}
      style={{
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
      }}
    >
      {children}
    </div>
  );
}
