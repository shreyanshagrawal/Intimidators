import React from "react";
import {
  Flame,
  Target,
  Package,
  Mail,
  ClipboardList,
  FileText,
} from "lucide-react";

export default function DashboardOverview({ stats, state }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value) return '₹0';
    return '₹' + (value / 10000000).toFixed(1) + ' Cr';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      {/* Sales Intelligence */}
      <div className="xl:col-span-8 bg-white rounded-xl border p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#0b2a4a]">
          Sales Intelligence Overview
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {state ? `${state} State` : 'All States'} · HPCL Direct Sales – Bulk Fuels & Specialities
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Stat
            title="Total Leads"
            value={stats.totalLeads || 0}
            meta={`${stats.tenderCount || 0} tenders, ${stats.websiteCount || 0} companies`}
            metaColor="text-gray-600"
          />
          <Stat
            title="High Priority"
            value={stats.highPriorityLeads || 0}
            valueColor="text-orange-500"
            meta="Urgent action required"
            metaColor="text-orange-600"
            icon={<Flame className="w-4 h-4 text-orange-500" />}
          />
          <Stat
            title="Est. Total Value"
            value={formatCurrency(stats.totalValue)}
            meta="From tenders"
            icon={<Target className="w-4 h-4 text-gray-400" />}
          />
          <Stat
            title="Your State"
            value={state || 'All'}
            meta="Filtered view"
            icon={<Package className="w-4 h-4 text-gray-400" />}
          />
        </div>

        <hr className="my-6" />

        {/* Pipeline */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
            <h3 className="text-sm font-semibold text-[#0b2a4a]">
              Lead Conversion Pipeline
            </h3>
            <span className="text-sm text-gray-500">
              Last 30 days
            </span>
          </div>

          <Pipeline label="Detected" value={stats.totalLeads} percent={100} />
          <Pipeline label="Qualified" value={Math.floor(stats.totalLeads * 0.65)} percent={65} />
          <Pipeline label="Contacted" value={Math.floor(stats.totalLeads * 0.42)} percent={42} dark />
          <Pipeline label="Quotation" value={Math.floor(stats.totalLeads * 0.28)} percent={28} dark />
          <Pipeline label="Converted" value={Math.floor(stats.totalLeads * 0.15)} percent={15} success />
        </div>
      </div>

      {/* Field Actions */}
      <div className="xl:col-span-4 bg-white rounded-xl border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-6">
          <h3 className="text-lg font-semibold text-[#0b2a4a]">
            Today's Field Actions
          </h3>
          <span className="text-sm text-gray-500">
            Hot & time-sensitive
          </span>
        </div>

        <Action
          icon={<Mail className="w-5 h-5" />}
          title="Generate outreach email"
          tag="Hot tenders"
        />
        <Action
          icon={<ClipboardList className="w-5 h-5" />}
          title="Log plant visit"
          tag="3 pending"
        />
        <Action
          icon={<FileText className="w-5 h-5" />}
          title="Prepare quotation"
          tag="FO / Bitumen"
        />

        <div className="mt-8">
          <p className="text-xs tracking-widest text-gray-500 mb-4">
            LEAD SUMMARY
          </p>
          <Summary label="High priority leads" value={stats.highPriorityLeads} highlight />
          <Summary label="Total opportunities" value={stats.totalLeads} />
          <Summary label="Est. total value" value={formatCurrency(stats.totalValue)} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

const Stat = ({
  title,
  value,
  meta,
  icon,
  valueColor = "text-[#0b2a4a]",
  metaColor = "text-gray-500",
}) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {icon}
      {title}
    </div>
    <div className={`text-2xl sm:text-3xl font-semibold mt-2 ${valueColor}`}>
      {value}
    </div>
    <div className={`text-sm mt-1 ${metaColor}`}>{meta}</div>
  </div>
);

const Pipeline = ({ label, value, percent, dark, success }) => (
  <div className="flex items-center gap-3 sm:gap-4 mb-3">
    <div className="w-24 sm:w-28 text-sm text-gray-500 truncate">
      {label}
    </div>
    <div className="flex-1 h-3 bg-gray-100 rounded-full">
      <div
        className={`h-3 rounded-full ${
          success
            ? "bg-green-500"
            : dark
            ? "bg-[#0b2a4a]"
            : "bg-gray-400"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
    <div className="w-10 sm:w-12 text-right text-sm font-medium text-[#0b2a4a]">
      {value}
    </div>
  </div>
);

const Action = ({ icon, title, tag }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 border rounded-lg mb-4">
    <div className="flex items-center gap-3 text-[#0b2a4a]">
      {icon}
      <span className="font-medium">{title}</span>
    </div>
    <span className="text-sm text-gray-500">{tag}</span>
  </div>
);

const Summary = ({ label, value, highlight }) => (
  <div className="flex justify-between text-sm mb-2">
    <span className="text-gray-600">{label}</span>
    <span
      className={`font-semibold ${
        highlight ? "text-orange-500" : "text-[#0b2a4a]"
      }`}
    >
      {value}
    </span>
  </div>
);
