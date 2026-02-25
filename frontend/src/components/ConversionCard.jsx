import React from "react";
export default function ConversionCard() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="relative w-32 h-32 mx-auto rounded-full border-[10px] border-orange-500 flex items-center justify-center">
        <span className="text-2xl font-bold">78%</span>
      </div>

      <p className="mt-3 font-medium">High Probability</p>

      <div className="mt-4 text-sm space-y-1">
        <p>Industry Pattern: <span className="text-green-600">High Match</span></p>
        <p>Signal Freshness: <span className="text-green-600">&lt; 48 hrs</span></p>
        <p>Location Fit: <span className="text-orange-600">Medium</span></p>
      </div>
    </div>
  );
}