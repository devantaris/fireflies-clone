"use client";

import { useState } from "react";
import { Check, CheckCircle } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    tagline: "For individuals starting with Fireflies",
    monthlyPrice: 0,
    annualPrice: 0,
    billing: "Free forever",
    isCurrent: true,
    features: ["Unlimited transcription*", "Limited AI summaries", "400 minutes of storage/team"],
  },
  {
    name: "Pro",
    tagline: "Best suited for individuals and small teams",
    monthlyPrice: 10,
    annualPrice: 6,
    billing: "Per seat/month billed annually",
    features: ["Unlimited transcription", "Unlimited AI summaries", "8,000 mins of storage/seat", "Capture meeting video", "Download transcripts, summaries, recordings", "Personal Assistant"],
  },
  {
    name: "Business",
    tagline: "Manage your fast growing team or business",
    monthlyPrice: 19,
    annualPrice: 14,
    billing: "Per seat/month billed annually",
    badge: "MOST POPULAR",
    features: ["Unlimited transcription", "Unlimited AI summaries", "Unlimited storage", "Multi-language mode", "Conversation intelligence", "Team analytics (For admins)"],
  },
  {
    name: "Enterprise",
    tagline: "For advanced security, control & support",
    monthlyPrice: 39,
    annualPrice: 29,
    billing: "Per seat/month billed annually",
    features: ["Unlimited transcription", "Unlimited AI summaries", "Unlimited storage", "Rules engine", "Super admin role", "Custom data retention"],
  },
];

export default function UpgradePage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <div className="min-h-full bg-[var(--bg)] px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-1)] mb-2">
            You are on the <span className="text-[#6c47ff]">Free</span> plan
          </h1>
          <p className="text-sm text-[var(--text-3)]">
            You need to upgrade your plan to perform this action.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBilling("monthly")}
            className={`text-sm font-medium transition-colors ${billing === "monthly" ? "text-[var(--text-1)]" : "text-[var(--text-3)]"}`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${billing === "annual" ? "text-[var(--text-1)]" : "text-[var(--text-3)]"}`}
          >
            ANNUAL
            <span className="text-[10px] font-bold bg-[#22c55e]/15 text-[#16a34a] px-2 py-0.5 rounded">
              40% OFF
            </span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className={`bg-[var(--bg-card)] border rounded-2xl p-6 flex flex-col ${plan.badge ? "border-[#6c47ff]/40" : "border-[var(--border)]"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-[#6c47ff]">{plan.name}</span>
                  {plan.badge && (
                    <span className="text-[9px] font-bold bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded uppercase">
                      {plan.badge}
                    </span>
                  )}
                  {plan.isCurrent && <CheckCircle size={16} className="text-[#6c47ff]" />}
                </div>
                <p className="text-xs text-[var(--text-3)] mb-4">{plan.tagline}</p>
                <p className="text-3xl font-bold text-[var(--text-1)] mb-0.5">${price}</p>
                <p className="text-xs text-[var(--text-3)] mb-5">{plan.billing}</p>
                <div className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-xs text-[var(--text-2)]">
                      <Check size={12} className="text-[var(--text-3)] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                {plan.isCurrent ? (
                  <button disabled className="w-full py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-3)] cursor-not-allowed">
                    Current
                  </button>
                ) : (
                  <button className="w-full py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-sm font-medium transition-colors">
                    Upgrade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
