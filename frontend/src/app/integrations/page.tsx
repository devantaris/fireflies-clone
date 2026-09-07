"use client";

import { useState } from "react";
import { Puzzle, Search, X } from "lucide-react";

const CATEGORIES = [
  "All",
  "Audio recording",
  "Applicant tracking",
  "CRM",
  "MCP",
  "More",
];

const INTEGRATIONS = [
  {
    name: "Slack",
    category: "CRM",
    desc: "Send meeting summaries and action items directly to Slack channels.",
    color: "#e01e5a",
    letter: "S",
  },
  {
    name: "Notion",
    category: "CRM",
    desc: "Sync meeting notes and transcripts to your Notion workspace.",
    color: "#000000",
    letter: "N",
  },
  {
    name: "HubSpot",
    category: "CRM",
    desc: "Log meeting activity and insights into your HubSpot CRM automatically.",
    color: "#ff7a59",
    letter: "H",
  },
  {
    name: "Salesforce",
    category: "CRM",
    desc: "Push meeting data, notes, and action items into Salesforce records.",
    color: "#00a1e0",
    letter: "SF",
  },
  {
    name: "Zapier",
    category: "MCP",
    desc: "Connect Fireflies to 5,000+ apps with automated Zap workflows.",
    color: "#ff4a00",
    letter: "Z",
  },
  {
    name: "Google Drive",
    category: "Audio recording",
    desc: "Save meeting recordings and transcripts directly to Google Drive.",
    color: "#34a853",
    letter: "G",
  },
  {
    name: "Zoom",
    category: "Audio recording",
    desc: "Automatically join and transcribe all your Zoom meetings.",
    color: "#2d8cff",
    letter: "Zm",
  },
  {
    name: "Microsoft Teams",
    category: "Audio recording",
    desc: "Record and transcribe Microsoft Teams meetings automatically.",
    color: "#5059c9",
    letter: "MT",
  },
  {
    name: "Greenhouse",
    category: "Applicant tracking",
    desc: "Automatically log interview insights into Greenhouse ATS.",
    color: "#24a47f",
    letter: "G",
  },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "connected">(
    "discover"
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showHero, setShowHero] = useState(true);

  const filtered = INTEGRATIONS.filter((i) => {
    const matchesSearch =
      !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Tabs header */}
      <div className="border-b border-[var(--border)] px-6 flex items-center gap-1">
        {(["discover", "connected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-[#6c47ff] text-[var(--text-1)]"
                : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
            }`}
          >
            {tab === "discover" ? "Discover" : "Connected"}
          </button>
        ))}
      </div>

      {activeTab === "connected" ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4 mx-auto">
              <Puzzle size={24} className="text-[var(--text-4)]" />
            </div>
            <h3 className="text-base font-medium text-[var(--text-1)] mb-1">
              No integrations connected
            </h3>
            <p className="text-sm text-[var(--text-3)]">
              Connect apps to automatically sync your meeting data.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Featured banner */}
          {showHero && (
            <div className="relative mx-6 mt-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1a103a] to-[#1a2a4a] border border-[var(--border-strong)] p-8 mb-6">
              <button
                onClick={() => setShowHero(false)}
                className="absolute top-3 right-3 text-[var(--text-3)] hover:text-[var(--text-2)]"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#2196f3]/20 flex items-center justify-center">
                  <span className="text-[#2196f3] font-bold text-lg">T</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      Telegram
                    </h2>
                    <span className="text-[10px] font-medium bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-2)]">Featured integration</p>
                </div>
              </div>
              <p className="text-sm text-[#b8a8e8] mb-4 max-w-sm">
                Automatically log meeting insights from Fireflies into Telegram
                for easy tracking.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors">
                + Connect
              </button>
            </div>
          )}

          {/* Category pills + search */}
          <div className="px-6 flex items-center gap-2 mb-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat
                    ? "border-[#6c47ff] bg-[#6c47ff]/15 text-[var(--accent-text)]"
                    : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-3)] hover:border-[var(--border-strong)] hover:text-[var(--text-2)]"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-1.5">
              <Search size={12} className="text-[var(--text-4)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none w-28"
              />
            </div>
          </div>

          {/* Integration grid */}
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((integration) => (
              <div
                key={integration.name}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-strong)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: integration.color }}
                  >
                    {integration.letter}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-1)]">
                      {integration.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-4)]">Fireflies</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-3)] mb-4 line-clamp-2">
                  {integration.desc}
                </p>
                <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors">
                  + Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
