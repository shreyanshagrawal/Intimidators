import React from "react";
import { useState } from "react";
import {
  LayoutGrid,
  Inbox,
  Box,
  Users,
  BarChart3,
  PieChart,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

/* ---------------- Item ---------------- */

const Item = ({ icon: Icon, label, sub, active }) => (
  <div
    className={`flex gap-3 px-5 py-3 cursor-pointer transition ${
      active
        ? "bg-[#12365f] border-l-4 border-orange-500"
        : "hover:bg-[#0f2e4f]"
    }`}
  >
    <Icon className="w-5 h-5 text-gray-300 mt-1" />
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  </div>
);

/* ---------------- Section ---------------- */

const Section = ({ title, children }) => (
  <div className="mt-6">
    <p className="px-5 mb-2 text-xs tracking-widest text-gray-400">
      {title}
    </p>
    {children}
  </div>
);

/* ---------------- Sidebar Content ---------------- */

const SidebarContent = () => (
  <>
    <div>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          🔥
        </div>
        <span className="text-lg font-semibold">HPCL Intel</span>
      </div>

      <Section title="TODAY'S VIEW">
        <Item
          icon={LayoutGrid}
          label="Dashboard"
          sub="Signal intelligence overview"
          active
        />
        <Item
          icon={Inbox}
          label="Lead Inbox"
          sub="Hot, warm & cold leads"
        />
      </Section>

      <Section title="WORKFLOWS">
        <Item
          icon={Box}
          label="Product Catalog"
          sub="Bulk fuels & specialties"
        />
        <Item
          icon={Users}
          label="Team Leaderboard"
          sub="Officer-wise performance"
        />
      </Section>

      <Section title="ANALYTICS">
        <Item
          icon={BarChart3}
          label="My Performance"
          sub="Response & conversion"
        />
        <Item
          icon={PieChart}
          label="Market Insights"
          sub="Sector & region trends"
        />
      </Section>

      <Section title="SYSTEM">
        <Item
          icon={Bell}
          label="Notifications"
          sub="Tenders & reminders"
        />
        <Item
          icon={Settings}
          label="Settings"
          sub="Preferences & alerts"
        />
        <Item
          icon={HelpCircle}
          label="Help & FAQ"
          sub="Usage & compliance"
        />
      </Section>
    </div>

    {/* User */}
    <div className="px-5 py-4 border-t border-white/10 flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/40"
        className="w-10 h-10 rounded-full"
      />
      <div>
        <p className="text-sm font-medium">Rajesh Kumar</p>
        <p className="text-xs text-gray-400">Sr. Sales Officer</p>
      </div>
    </div>
  </>
);

/* ---------------- Main Sidebar ---------------- */

export default function Sidebar1() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0b2a4a] text-white p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-gradient-to-b from-[#0b2a4a] to-[#071f36] text-white flex-col justify-between">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#0b2a4a] to-[#071f36]
        text-white flex flex-col justify-between z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <X size={20} />
        </button>

        <SidebarContent />
      </aside>
    </>
  );
}