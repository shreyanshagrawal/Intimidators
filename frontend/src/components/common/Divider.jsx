import React from "react";
export default function Divider({ text }) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-grow h-px bg-gray-200" />
      <span className="px-3 text-xs text-gray-400">{text}</span>
      <div className="flex-grow h-px bg-gray-200" />
    </div>
  );
}