import React from "react";
import FeatureItem from "../auth/FeatureItem";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-[#0A2A5A] to-[#0E3A8A] text-white p-12 flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              🔥
            </div>
            <h1 className="text-lg font-semibold">
              HPCL Lead Intelligence Agent
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold leading-snug mb-10">
            Turning public signals into
            <br />
            actionable B2B sales
            <br />
            intelligence.
          </h2>

          {/* Features */}
          <div className="space-y-8">
            <FeatureItem
              title="AI-Powered Discovery"
              desc="Automatically detect new industrial projects and fuel requirements before competitors."
            />
            <FeatureItem
              title="Intent Scoring"
              desc="Prioritize leads based on operational signals, creditworthiness, and urgency."
            />
            <FeatureItem
              title="Smart Routing"
              desc="Instant alerts sent to field officers mapped by DSRO territories."
            />
          </div>
        </div>

        <p className="text-xs text-white/50">
          ©️ 2025 Hindustan Petroleum Corporation Limited. All rights reserved.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10">
        {children}
      </div>
    </div>
  );
}