import React from "react";
export default function CompetitorAlert() {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-lg">
      <h3 className="font-semibold text-orange-700 mb-2">
        ⚠ Competitor Activity
      </h3>
      <p className="text-sm text-orange-800">
        IOCL engaged 3 days ago via LinkedIn connection.
      </p>

      <span className="inline-block mt-3 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
        Act within 48 hours
      </span>
    </div>
  );
}