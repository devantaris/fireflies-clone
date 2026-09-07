"use client";

import { useState } from "react";
import { Mic, Play, X, Plus, MessageSquare } from "lucide-react";

const AGENTS = [
  {
    name: "Screening Interview Agent",
    desc: "Hire faster with automatic screening calls that assess candidate skills and qualifications before human review.",
    bg: "linear-gradient(135deg, #ffe4e6, #fecdd3)",
    iconBg: "#f43f5e",
    icon: "FF",
  },
  {
    name: "Discovery Call Agent",
    desc: "Qualify prospects with targeted discovery calls that uncover buying signals and surface the right opportunities.",
    bg: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
    iconBg: "#0d9488",
    icon: "FF",
  },
  {
    name: "Progress Check-In Agent",
    desc: "Keep teams aligned with quick automated check-ins that surface blockers, risks, and next steps.",
    bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    iconBg: "#7c3aed",
    icon: "FF",
  },
];

export default function VoiceAgentsPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "mine">("discover");
  const [showVoiceBanner, setShowVoiceBanner] = useState(true);

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Tabs */}
      <div className="border-b border-[var(--border)] px-6 flex items-center gap-1">
        <button
          onClick={() => setActiveTab("discover")}
          className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "discover"
              ? "border-[#6c47ff] text-[var(--text-1)]"
              : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab("mine")}
          className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === "mine"
              ? "border-[#6c47ff] text-[var(--text-1)]"
              : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
          }`}
        >
          My Voice Agents
        </button>
      </div>

      {activeTab === "mine" ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4 mx-auto">
              <Mic size={24} className="text-[var(--text-4)]" />
            </div>
            <h3 className="text-base font-medium text-[var(--text-1)] mb-1">No voice agents yet</h3>
            <p className="text-sm text-[var(--text-3)]">Set up your first agent from the Discover tab.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Hero card */}
          <div className="mx-6 mt-6 mb-6 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #3b1fa3 0%, #6c47ff 50%, #9c6dff 100%)" }}>
            <div className="p-8 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  + 50 free AI credits
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 max-w-sm">
                Experience Voice Agents
              </h2>
              <p className="text-white/70 text-sm mb-6 max-w-xs">
                Voice Agents handle your calls, ask the right questions, and deliver clear insights — automatically.
              </p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#6c47ff] text-sm font-semibold hover:bg-white/90 transition-colors">
                  <Mic size={14} />
                  Try It Live
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm font-medium hover:border-white/60 hover:bg-white/10 transition-colors">
                  <Play size={13} className="fill-white" />
                  Watch Demo
                </button>
              </div>
              {/* Carousel dots */}
              <div className="flex items-center gap-1.5 mt-6">
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            </div>
            {/* Decorative bg circles */}
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          </div>

          {/* Voice cloning banner */}
          {showVoiceBanner && (
            <div className="mx-6 mb-6 flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0d9488, #06b6d4)" }}>
                <Mic size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-1)]">
                  <span className="font-semibold">Try Voice Cloning</span>
                  {" — "}Make your agent sound exactly like you in 30 seconds.
                </p>
                <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium mt-0.5 transition-colors">
                  Create Voice Agent
                </button>
              </div>
              <button
                onClick={() => setShowVoiceBanner(false)}
                className="text-[var(--text-4)] hover:text-[var(--text-2)] shrink-0 transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Agent setup section */}
          <div className="px-6 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-1)]">Set up your Voice Agent in 2 minutes</h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                <MessageSquare size={12} />
                Share Feedback
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors">
                <Plus size={12} />
                Custom Agent
              </button>
            </div>
          </div>

          {/* Agent cards */}
          <div className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col"
              >
                {/* Colored top section */}
                <div className="p-5 pb-4" style={{ background: agent.bg }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-3"
                    style={{ background: agent.iconBg }}
                  >
                    {agent.icon}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{agent.name}</h4>
                </div>
                {/* Bottom section */}
                <div className="flex-1 p-5 bg-[var(--bg-card)]">
                  <p className="text-xs text-[var(--text-3)] mb-4">{agent.desc}</p>
                  <button className="w-full py-2 rounded-lg border border-[var(--border-strong)] text-xs font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[#6c47ff]/50 hover:bg-[#6c47ff]/5 transition-colors">
                    Set-Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
