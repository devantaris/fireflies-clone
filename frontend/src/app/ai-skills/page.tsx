"use client";

import { useState } from "react";
import { Sparkles, Plus, Search, X, MessageSquare } from "lucide-react";

const SKILLS = {
  Recommended: [
    { name: "Key Ideas", uses: "71.7k", color: "#f59e0b", enabled: false },
    { name: "Goal Progress", uses: "78.9k", color: "#10b981", enabled: false },
    { name: "Time Management", uses: "22.9k", color: "#06b6d4", enabled: false },
  ],
  Popular: [
    { name: "Popular Topics", uses: "174M", color: "#f59e0b", enabled: false },
    { name: "Sales Call", uses: "376k", color: "#10b981", enabled: false },
    { name: "1:1", uses: "356k", color: "#a78bfa", enabled: false },
    { name: "Product Feedback", uses: "89k", color: "#f472b6", enabled: false },
  ],
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className="relative shrink-0 rounded-full transition-colors"
      style={{ width: 36, height: 20, background: checked ? "#6c47ff" : "var(--border-strong)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export default function AISkillsPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "active" | "feed">("discover");
  const [selectedSkill, setSelectedSkill] = useState(SKILLS.Recommended[0].name);
  const [showBanner, setShowBanner] = useState(true);
  const [skills, setSkills] = useState(SKILLS);

  const allSkills = [...skills.Recommended, ...skills.Popular];
  const selected = allSkills.find((s) => s.name === selectedSkill);

  function toggleSkill(name: string) {
    setSkills((prev) => ({
      Recommended: prev.Recommended.map((s) => s.name === name ? { ...s, enabled: !s.enabled } : s),
      Popular: prev.Popular.map((s) => s.name === name ? { ...s, enabled: !s.enabled } : s),
    }));
  }

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Top banner */}
      {showBanner && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#6c47ff]/10 border-b border-[#6c47ff]/20">
          <Sparkles size={13} className="text-[var(--accent-text)] shrink-0" />
          <p className="text-xs text-[#7c5aff] flex-1">
            <span className="font-medium">Meet AI Skills</span>
            {" — "}Automate meeting insights, follow-ups, and reports.{" "}
            <button className="text-[var(--accent-text)] hover:underline">See how it works →</button>
          </p>
          <button onClick={() => setShowBanner(false)} className="text-[var(--text-3)] hover:text-[var(--text-2)]">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Header tabs */}
      <div className="border-b border-[var(--border)] px-6 py-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "discover", label: "Discover" },
            { id: "active", label: "Active Skills (1)" },
            { id: "feed", label: "Feed" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? "border-[#6c47ff] text-[var(--text-1)]"
                  : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors">
          <Sparkles size={12} />
          Create Skill
        </button>
      </div>

      {activeTab !== "discover" ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[var(--text-3)]">
            {activeTab === "active" ? "Your active skills will appear here." : "Skill outputs and AI feed will appear here."}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          {/* Skill list */}
          <div className="w-[320px] shrink-0 border-r border-[var(--border)] flex flex-col">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--text-2)] cursor-pointer hover:border-[var(--border-strong)]">
                <span className="text-[var(--text-3)]">All Skills</span>
                <span className="ml-auto text-[var(--text-4)]">▾</span>
              </div>
              <button className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-2)]">
                <Search size={13} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {Object.entries(skills).map(([section, sectionSkills]) => (
                <div key={section} className="mb-2">
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
                    {section}
                  </p>
                  {sectionSkills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill.name)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-2 ${
                        selectedSkill === skill.name
                          ? "bg-[#6c47ff]/[0.08] border-[#6c47ff]"
                          : "border-transparent hover:bg-[var(--bg-card)]"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${skill.color}25` }}
                      >
                        <Plus size={13} style={{ color: skill.color }} />
                      </div>
                      <span className={`flex-1 text-sm ${selectedSkill === skill.name ? "text-[var(--text-1)] font-medium" : "text-[var(--text-2)]"}`}>
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-4)] mr-2">↑ {skill.uses}</span>
                      <Toggle checked={skill.enabled} onChange={() => toggleSkill(skill.name)} />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Skill detail */}
          {selected && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-sm">
                {/* Detail card */}
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${selected.color}25` }}
                    >
                      <Plus size={18} style={{ color: selected.color }} />
                    </div>
                    <button className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors flex items-center gap-1">
                      🔗 Copy Link
                    </button>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-1)] mb-1">{selected.name}</h3>
                  <p className="text-xs text-[var(--text-3)] mb-4">Extract key ideas from audio content.</p>
                  <div className="flex items-center gap-1.5 mb-5">
                    <div className="w-4 h-4 rounded bg-[#6c47ff] flex items-center justify-center">
                      <Sparkles size={9} className="text-white" />
                    </div>
                    <span className="text-xs text-[var(--text-3)]">Fireflies</span>
                    <span className="text-[var(--text-4)] mx-1">·</span>
                    <span className="text-xs text-[var(--text-4)]">↑ {selected.uses}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors">
                      Enable
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-strong)] text-xs text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">
                      <Sparkles size={11} />
                      Try Skill
                    </button>
                    <button className="ml-auto text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                      Edit
                    </button>
                  </div>
                </div>

                {/* Share Feedback */}
                <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] mb-4 transition-colors">
                  <MessageSquare size={12} />
                  Share Feedback
                </button>

                {/* Slack upsell */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                  <div className="w-7 h-7 rounded-lg bg-[#e01e5a]/15 flex items-center justify-center shrink-0">
                    <span className="text-[#e01e5a] text-xs font-bold">S</span>
                  </div>
                  <p className="text-xs text-[var(--text-2)] flex-1 min-w-0">
                    <span className="font-medium">Get insights on Slack</span>
                    {" — "}Receive skills output to your Slack channel.
                  </p>
                  <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium shrink-0 transition-colors">
                    Connect →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
