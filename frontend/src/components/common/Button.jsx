import React from "react";
export default function Button({ text }) {
  return (
    <button
      type="submit"
      className="w-full bg-[#0A2A5A] hover:bg-[#0E3A8A]
                 text-white py-3 rounded-lg font-medium transition"
    >
      {text}
    </button>
  );
}