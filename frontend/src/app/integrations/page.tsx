"use client";

import { useState } from "react";
import Image from "next/image";
import { Puzzle, Search, X, MessageSquare } from "lucide-react";

const CATEGORIES = ["All", "Audio recording", "Applicant tracking system", "CRM", "MCP", "More"];

const INTEGRATIONS = [
  { name: "ActiveCampaign", category: "CRM", desc: "Sync Fireflies meeting notes to ActiveCampaign CRM and keep your contacts and companies automatically updated.", logo: "/assets/logos/activecampaign.png" },
  { name: "Activepieces", category: "MCP", desc: "Activepieces offers a no-code integration with Fireflies.ai, enabling users to automate workflows involving meeting data.", logo: "/assets/logos/activepieces.svg" },
  { name: "Affinity", category: "CRM", desc: "Automatically sync meeting data and tasks to the relevant people and companies in Affinity, streamlining your pipeline.", logo: "/assets/logos/affinity.png" },
  { name: "Aircall", category: "Audio recording", desc: "Automatically capture, transcribe, and summarize all your Aircall calls with Fireflies.", logo: "/assets/logos/aircall.svg" },
  { name: "Airtable", category: "MCP", desc: "Automatically push meeting notes and tasks to your Airtable base after every call.", logo: "/assets/logos/airtable.svg" },
  { name: "Allo", category: "Audio recording", desc: "Automatically capture, transcribe, and analyze your Allo video meetings.", logo: "/assets/logos/allo.png" },
  { name: "Slack", category: "CRM", desc: "Send meeting summaries and action items directly to Slack channels.", logo: "/assets/logos/slack.svg" },
  { name: "Notion", category: "CRM", desc: "Sync meeting notes and transcripts to your Notion workspace.", logo: "/assets/logos/notion.svg" },
  { name: "HubSpot", category: "CRM", desc: "Log meeting activity and insights into your HubSpot CRM automatically.", logo: "/assets/logos/hubspot.svg" },
  { name: "Salesforce", category: "CRM", desc: "Push meeting data, notes, and action items into Salesforce records.", logo: "/assets/logos/salesforce.svg" },
  { name: "Zapier", category: "MCP", desc: "Connect Fireflies to 5,000+ apps with automated Zap workflows.", logo: "/assets/logos/zapier.svg" },
  { name: "Google Drive", category: "Audio recording", desc: "Save meeting recordings and transcripts directly to Google Drive.", logo: "/assets/logos/googledrive.svg" },
  { name: "Zoom", category: "Audio recording", desc: "Automatically join and transcribe all your Zoom meetings.", logo: "/assets/logos/zoom-app.svg" },
  { name: "Microsoft Teams", category: "Audio recording", desc: "Record and transcribe Microsoft Teams meetings automatically.", logo: "/assets/logos/ms-teams.svg" },
  { name: "Greenhouse", category: "Applicant tracking system", desc: "Automatically log interview insights into Greenhouse ATS.", logo: "/assets/logos/greenhouse.svg" },
  { name: "Lever", category: "Applicant tracking system", desc: "Sync candidate interview notes and recordings to Lever automatically.", logo: "/assets/logos/lever.svg" },
  { name: "Asana", category: "CRM", desc: "Create and assign action items directly into your Asana projects.", logo: "/assets/logos/asana.svg" },
  { name: "Trello", category: "MCP", desc: "Automatically generate cards and tasks on Trello boards.", logo: "/assets/logos/trello.svg" },
  { name: "Google Docs", category: "Audio recording", desc: "Export formatted meeting notes and transcripts to Google Docs.", logo: "/assets/logos/google-docs.svg" },
  { name: "Google Meet", category: "Audio recording", desc: "Automatically transcribe and capture insights from Google Meet calls.", logo: "/assets/logos/google-meet.svg" },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "connected">("discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showHero, setShowHero] = useState(true);
  const [connectedSet, setConnectedSet] = useState<Set<string>>(new Set());
  const [flashName, setFlashName] = useState<string | null>(null);

  function handleConnect(name: string) {
    setConnectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
    setFlashName(name);
    setTimeout(() => setFlashName(null), 2000);
  }

  const filtered = INTEGRATIONS.filter((i) => {
    const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Toast notification */}
      {flashName && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg text-sm text-[var(--text-1)]">
          <span className="text-[#22c55e]">✓</span>
          <span>
            {connectedSet.has(flashName)
              ? `${flashName} connected`
              : `${flashName} disconnected`}
          </span>
        </div>
      )}

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
            <h3 className="text-base font-medium text-[var(--text-1)] mb-1">No integrations connected</h3>
            <p className="text-sm text-[var(--text-3)]">Connect apps to automatically sync your meeting data.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Featured banner */}
          {showHero && (
            <div className="relative mx-6 mt-6 rounded-2xl overflow-hidden border border-[var(--border-strong)] mb-6"
              style={{ background: "linear-gradient(135deg, #e8f4fe 0%, #f0e8ff 100%)" }}>
              <button
                onClick={() => setShowHero(false)}
                className="absolute top-3 right-3 text-[var(--text-3)] hover:text-[var(--text-2)] z-10"
              >
                <X size={14} />
              </button>
              <div className="flex items-center">
                {/* Left side */}
                <div className="flex-1 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 p-1.5 border border-[#24A1DE]/20">
                      <Image
                        src="/assets/logos/telegram.svg"
                        alt="Telegram"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-[var(--text-1)]">Telegram</h2>
                        <span className="text-[10px] font-medium bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded">NEW</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-2)] mb-4 max-w-xs">
                    Automatically log meeting insights from Fireflies into Telegram for easy tracking.
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-sm font-medium transition-colors">
                    + Connect
                  </button>
                </div>
                {/* Right side — phone mockup placeholder */}
                <div className="w-52 shrink-0 p-6 hidden lg:block">
                  <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <div className="text-[10px] font-medium text-gray-700 mb-2">Product Sync</div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300" />
                      <span className="text-[10px] text-gray-500">Sarah Watts</span>
                    </div>
                    <div className="text-[10px] text-gray-600 mb-1">Summary</div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[#10b981] text-[10px]">✓</span>
                      <span className="text-[10px] text-gray-600">Tasks</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded mb-1" />
                    <div className="h-1.5 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              </div>
              {/* Carousel dots */}
              <div className="flex items-center justify-center gap-1.5 pb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c47ff]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
              </div>
            </div>
          )}

          {/* Category pills + search */}
          <div className="px-6 flex items-center gap-2 mb-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeCategory === cat
                    ? "border-[#6c47ff] bg-[#6c47ff]/10 text-[var(--accent-text)]"
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

          {/* Share Feedback */}
          <div className="px-6 mb-4">
            <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <MessageSquare size={12} />
              Share Feedback
            </button>
          </div>

          {/* Integration grid */}
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((integration) => (
              <div
                key={integration.name}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-strong)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-800 border border-[var(--border)] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <Image
                      src={integration.logo}
                      alt={integration.name}
                      width={28}
                      height={28}
                      className="object-contain w-7 h-7"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-1)]">{integration.name}</p>
                    <p className="text-[10px] text-[var(--text-4)]">Fireflies</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-3)] mb-4 line-clamp-2">{integration.desc}</p>
                <button
                  onClick={() => handleConnect(integration.name)}
                  className={`text-xs font-medium transition-colors ${
                    connectedSet.has(integration.name)
                      ? "text-[#22c55e] hover:text-[#16a34a]"
                      : "text-[var(--accent-text)] hover:text-[var(--accent-hover)]"
                  }`}
                >
                  {connectedSet.has(integration.name) ? "✓ Connected" : "+ Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
