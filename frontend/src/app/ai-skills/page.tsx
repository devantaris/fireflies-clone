"use client";

import { useState } from "react";
import { Sparkles, Plus, Search, ToggleLeft, X } from "lucide-react";

const SKILLS = {
  Recommended: [
    { name: "Key Ideas", uses: "71.7k", color: "#f59e0b" },
    { name: "Goal Progress", uses: "78.9k", color: "#10b981" },
    { name: "Time Management", uses: "22.9k", color: "#06b6d4" },
  ],
  Popular: [
    { name: "Popular Topics", uses: "174M", color: "#f59e0b" },
    { name: "Sales Call", uses: "376k", color: "#10b981" },
    { name: "1:1", uses: "356k", color: "#a78bfa" },
    { name: "Product Feedback", uses: "89k", color: "#f472b6" },
  ],
};

export default function AISkillsPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "active" | "feed">(
    "discover"
  );
  const [selectedSkill, setSelectedSkill] = useState(
    SKILLS.Recommended[0].name
  );
  const [showBanner, setShowBanner] = useState(true);

  const allSkills = [...SKILLS.Recommended, ...SKILLS.Popular];
  const selected = allSkills.find((s) => s.name === selectedSkill);

  return (
    <div className="min-h-full flex flex-col bg-[#0e0e0e]">
      {/* Top banner */}
      {showBanner && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#6c47ff]/10 border-b border-[#6c47ff]/20">
          <Sparkles size={13} className="text-[#9b7cff] shrink-0" />
          <p className="text-xs text-[#b8a8e8] flex-1">
            <span className="font-medium">Meet AI Skills</span> — Automate
            meeting insights, follow-ups, and reports.{" "}
            <button className="text-[#9b7cff] hover:underline">
              See how it works →
            </button>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#555] hover:text-[#888]"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#1e1e1e] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[
            { id: "discover", label: "Discover" },
            { id: "active", label: "Active Skills (1)" },
            { id: "feed", label: "Feed" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? "border-[#6c47ff] text-[#f0f0f0]"
                  : "border-transparent text-[#555] hover:text-[#aaa]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-xs font-medium transition-colors">
          <Plus size={13} />
          Create Skill
        </button>
      </div>

      {activeTab !== "discover" ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#555]">
            {activeTab === "active"
              ? "Your active skills will appear here."
              : "Skill outputs and AI feed will appear here."}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          {/* Skill list */}
          <div className="w-[320px] shrink-0 border-r border-[#1e1e1e] flex flex-col">
            {/* Filter row */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[#1e1e1e]">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e1e1e] bg-[#141414] text-xs text-[#555]">
                <span className="text-[#666]">All Skills</span>
                <span className="ml-auto text-[#333]">▾</span>
              </div>
              <button className="w-7 h-7 rounded-lg border border-[#1e1e1e] bg-[#141414] flex items-center justify-center text-[#555] hover:text-[#aaa]">
                <Search size={13} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {Object.entries(SKILLS).map(([section, skills]) => (
                <div key={section} className="mb-2">
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#444]">
                    {section}
                  </p>
                  {skills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill.name)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selectedSkill === skill.name
                          ? "bg-[#6c47ff]/10"
                          : "hover:bg-[#141414]"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${skill.color}25` }}
                      >
                        <Plus
                          size={14}
                          style={{ color: skill.color }}
                          className="rotate-0"
                        />
                      </div>
                      <span
                        className={`flex-1 text-sm ${
                          selectedSkill === skill.name
                            ? "text-[#f0f0f0] font-medium"
                            : "text-[#aaa]"
                        }`}
                      >
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-1 text-[#444]">
                        <span className="text-[10px]">↑ {skill.uses}</span>
                        <ToggleLeft size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Skill detail */}
          {selected && (
            <div className="flex-1 p-6">
              <div className="max-w-sm bg-[#141414] border border-[#1e1e1e] rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${selected.color}25` }}
                  >
                    <Plus size={18} style={{ color: selected.color }} />
                  </div>
                  <button className="text-xs text-[#555] hover:text-[#aaa] transition-colors">
                    Copy Link
                  </button>
                </div>
                <h3 className="text-base font-semibold text-[#f0f0f0] mb-1">
                  {selected.name}
                </h3>
                <p className="text-xs text-[#555] mb-4">
                  Extract key ideas from audio content.
                </p>
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-4 h-4 rounded bg-[#6c47ff] flex items-center justify-center">
                    <Sparkles size={9} className="text-white" />
                  </div>
                  <span className="text-xs text-[#555]">Fireflies</span>
                  <span className="text-[#333] mx-1">·</span>
                  <span className="text-xs text-[#444]">↑ {selected.uses}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-xs font-medium transition-colors">
                    Enable
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2e2e2e] text-xs text-[#aaa] hover:text-[#f0f0f0] hover:border-[#444] transition-colors">
                    <Sparkles size={11} />
                    Try Skill
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
