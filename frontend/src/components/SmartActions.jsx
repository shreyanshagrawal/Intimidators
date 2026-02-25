import React from "react";
export default function SmartActions() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-4">⚡ Smart Actions</h2>

      <button className="w-full bg-[#0b2a4a] text-white py-2 rounded mb-3">
        Generate Outreach Email
      </button>

      <button className="w-full border py-2 rounded mb-3">
        View Competitor Report
      </button>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Action label="Call" />
        <Action label="WhatsApp" />
        <Action label="Meeting" />
        <Action label="More" />
      </div>
    </div>
  );
}

const Action = ({ label }) => (
  <button className="border py-2 rounded hover:bg-gray-50">
    {label}
  </button>
);