import React from "react";
export default function CompanySnapshot() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-semibold mb-4">🏭 Company Snapshot</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <Item label="Scale" value="Medium Enterprise" />
        <Item label="Est. Consumption" value="~120 KL / Month" />
        <Item label="Facilities" value="2 Plants detected" />
        <Item label="Known Ops" value="Boiler / Furnace" />
      </div>
    </div>
  );
}

const Item = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);