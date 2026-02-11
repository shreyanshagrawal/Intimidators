import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value ?? ""}          // ✅ prevents uncontrolled → controlled bug
        onChange={onChange}          // ✅ CRITICAL
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full px-3 py-2
          border border-gray-300
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          disabled:bg-gray-100
          disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

