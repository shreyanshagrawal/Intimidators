import React from "react";
export default function DetectedSignals() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-4">📡 Detected Signals (Evidence)</h2>

      <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded">
        <div className="flex justify-between text-sm mb-2">
          <p className="font-medium">Public Tender Notification</p>
          <p className="text-gray-500">Source: TenderTiger • High Trust</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm font-mono">
          "... supply of <span className="bg-yellow-200 px-1">Furnace Oil (FO)</span>  
          Requirement: approx <span className="bg-yellow-200 px-1">50 KL/month</span> ..."
        </div>

        <div className="flex justify-between text-xs mt-3">
          <span className="text-gray-500">Detected 2 days ago</span>
          <span className="text-orange-600 font-medium">Action Required</span>
        </div>
      </div>
    </div>
  );
}