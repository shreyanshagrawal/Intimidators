import React from "react";
import { ThumbsUp, CheckCircle, XCircle, RefreshCcw, Pencil } from "lucide-react";

export default function OfficerNotes() {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border flex items-center justify-center text-[#0b2a4a]">
            <Pencil className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-[#0b2a4a]">
            Lead Feedback Loop
          </h2>
        </div>

        <p className="text-sm text-gray-500 text-left sm:text-right">
          Uttarakhand Roadways Dept.<br className="hidden sm:block" />
          b7 Dehradun
        </p>
      </div>

      <hr className="my-5" />

      {/* Interaction Outcome */}
      <p className="text-xs tracking-widest text-gray-500 mb-4">
        INTERACTION OUTCOME
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Outcome
          icon={<ThumbsUp />}
          label="Ongoing"
          active
        />
        <Outcome
          icon={<CheckCircle />}
          label="Converted"
          success
        />
        <Outcome
          icon={<XCircle />}
          label="Rejected"
          danger
        />
      </div>

      <hr className="my-5" />

      {/* Meta Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-500">
        <span>Feedback captured from last interaction.</span>
        <span>Updated just now</span>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 border rounded-md py-2 text-sm font-medium hover:bg-gray-50">
          <RefreshCcw className="w-4 h-4" />
          Update outcome
        </button>

        <button className="flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium bg-blue-50 text-[#0b2a4a] hover:bg-blue-100">
          <Pencil className="w-4 h-4" />
          Add note
        </button>
      </div>
    </div>
  );
}

/* ---------------- Sub Components ---------------- */

const Outcome = ({ icon, label, active, success, danger }) => {
  let base =
    "flex flex-col items-center justify-center border rounded-xl p-5 text-center cursor-pointer transition";

  if (active) {
    base += " border-[#0b2a4a] bg-blue-50";
  } else if (success) {
    base += " hover:border-green-500";
  } else if (danger) {
    base += " hover:border-red-400";
  }

  return (
    <div className={base}>
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full mb-2
        ${
          active
            ? "text-[#0b2a4a]"
            : success
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {icon}
      </div>
      <p className="font-medium text-[#0b2a4a]">{label}</p>
    </div>
  );
};