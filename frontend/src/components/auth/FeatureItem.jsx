import React from "react";
export default function FeatureItem({ title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
        🎯
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-white/70 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}