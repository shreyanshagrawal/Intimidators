import React from "react";
export default function AIRecommendations() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border w-full">
      {/* Header */}
      <h2 className="flex items-center gap-2 font-semibold text-base sm:text-lg mb-3 sm:mb-4">
        ✨ AI Product Recommendations
      </h2>
      <hr className="mb-4 sm:mb-6" />

      {/* Product 1 */}
      <Product
        name="Furnace Oil (FO)"
        match={92}
        desc="Industrial Fuel • Viscosity Grade 180"
        barColor="bg-green-500"
        badgeColor="bg-green-100 text-green-700"
        points={[
          "Tender explicitly mentions FO requirement",
          "Industry match: Steel Re-rolling (High Consumption)",
        ]}
      />

      {/* Product 2 */}
      <Product
        name="LSHS (Low Sulphur Heavy Stock)"
        match={65}
        desc="Industrial Fuel • Low Emission"
        barColor="bg-orange-500"
        badgeColor="bg-blue-100 text-blue-700"
        outlined
        info
        points={[
          "Alternative if emission norms are strict in Roorkee",
        ]}
      />
    </div>
  );
}

const Product = ({
  name,
  match,
  desc,
  barColor,
  badgeColor,
  points,
  outlined = false,
  info = false,
}) => (
  <div
    className={`rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 last:mb-0 ${
      outlined ? "border-2 border-blue-700" : "border"
    }`}
  >
    {/* Title + badge */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
      <p className="font-semibold text-sm sm:text-base">{name}</p>

      <span
        className={`self-start sm:self-auto text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${badgeColor}`}
      >
        {match}% Match
      </span>
    </div>

    {/* Description */}
    <p className="text-xs sm:text-sm text-gray-500 mb-3">
      {desc}
    </p>

    {/* Progress bar */}
    <div className="h-2 bg-gray-200 rounded mb-4">
      <div
        className={`h-full ${barColor} rounded transition-all`}
        style={{ width: `${match}%` }}
      />
    </div>

    {/* Bullet points */}
    <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
      {points.map((point, idx) => (
        <li
          key={idx}
          className="flex items-start gap-2 leading-relaxed"
        >
          <span className={info ? "text-orange-500" : "text-green-500"}>
            {info ? "ℹ️" : "✔️"}
          </span>
          <span className="break-words">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);