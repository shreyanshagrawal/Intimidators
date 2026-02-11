import React from "react";
export default function Select({ label }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-700"
      >
        <option>Select your state</option>
        <option>Uttar Pradesh</option>
        <option>Delhi</option>
        <option>Maharashtra</option>
      </select>
    </div>
  );
}