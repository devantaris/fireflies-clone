"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Search,
  X,
  MessageSquare,
  Zap,
  Link2,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/lib/currentUser";
import { getAvatarImage } from "@/lib/utils";

interface SkillItem {
  id: string;
  name: string;
  uses: string;
  color: string;
  enabled: boolean;
  description: string;
  author: string;
  category: string;
}

const INITIAL_SKILLS: SkillItem[] = [
  {
    id: "popular-topics",
    name: "Popular Topics",
    uses: "174M",
    color: "#f59e0b",
    enabled: false,
    description: "Most popular topics across your meetings",
    author: "Devansh Kumar",
    category: "Popular",
  },
  {
    id: "sales-call",
    name: "Sales Call",
    uses: "377k",
    color: "#38bdf8",
    enabled: false,
    description: "Extract key pain points, buyer qualification, customer objections, and actionable next steps from sales conversations.",
    author: "Fireflies",
    category: "Popular",
  },
  {
    id: "one-on-one",
    name: "1:1",
    uses: "356k",
    color: "#2dd4bf",
    enabled: false,
    description: "Track career goals, peer feedback, personal check-ins, and mutually agreed growth items.",
    author: "Fireflies",
    category: "Popular",
  },
  {
    id: "idea-generator",
    name: "Idea Generator",
    uses: "313k",
    color: "#34d399",
    enabled: false,
    description: "Surface innovative brainstorming ideas, creative proposals, and strategic concepts discussed in the meeting.",
    author: "Fireflies",
    category: "Popular",
  },
  {
    id: "bant",
    name: "BANT",
    uses: "294k",
    color: "#a78bfa",
    enabled: false,
    description: "Qualify high-value opportunities by identifying Budget, Authority, Need, and Timeline constraints.",
    author: "Fireflies",
    category: "Popular",
  },
  {
    id: "daily-standups",
    name: "Daily Standups",
    uses: "207k",
    color: "#818cf8",
    enabled: false,
    description: "Identify yesterday's accomplishments, today's focus, and flagged blockers for agile sprint execution.",
    author: "Fireflies",
    category: "Popular",
  },
  {
    id: "board-summaries",
    name: "Board Summaries",
    uses: "181k",
    color: "#f59e0b",
    enabled: false,
    description: "High-level executive briefing covering strategic decisions, key performance metrics, and governance.",
    author: "Fireflies",
    category: "Popular",
  },
];

const CATEGORIES = ["All Skills", "Popular", "Sales", "Engineering", "Executive", "Product"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#6c47ff]" : "bg-[var(--border-strong)]"
      }`}
      aria-label={checked ? "Disable" : "Enable"}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function AISkillsPage() {
  const user = useUser();
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(INITIAL_SKILLS[0]);
  const [activeTab, setActiveTab] = useState<"discover" | "active" | "feed">("discover");
  const [showBanner, setShowBanner] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Skills");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const activeCount = skills.filter((s) => s.enabled).length;

  function toggleSkill(id: string) {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.enabled;
          toast.success(`${s.name} is now ${next ? "enabled" : "disabled"}.`, {
            duration: 2500,
            style: { borderRadius: "8px", fontSize: "13px" },
          });
          return { ...s, enabled: next };
        }
        return s;
      })
    );
    if (selectedSkill.id === id) {
      setSelectedSkill((prev) => ({ ...prev, enabled: !prev.enabled }));
    }
  }

  function copySkillLink() {
    navigator.clipboard.writeText(`${window.location.origin}/ai-skills?skill=${selectedSkill.id}`);
    toast.success("Skill link copied to clipboard!");
  }

  const displayedSkills = skills.filter((s) => {
    if (searchKeyword.trim() && !s.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "All Skills" && s.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text-1)] relative transition-colors duration-150">
      {/* ── Top Banner (Supports Light Mode Soft Pink & Dark Mode Deep Wine) ── */}
      {showBanner && (
        <div className="flex items-center justify-between px-8 py-2.5 bg-[#fdf2f8] dark:bg-[#1a1118] border-b border-[#fce7f3] dark:border-[#2e1824] text-xs transition-colors">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="text-pink-500 font-bold text-sm">✦</span>
            <span className="text-[var(--text-1)] font-semibold">Meet AI Skills</span>
            <span className="text-[var(--text-4)]">—</span>
            <span className="text-[var(--text-2)]">
              Automate meeting insights, follow-ups, and reports.
            </span>
            <button
              onClick={() => toast("AI Skills documentation opened", { icon: "✨" })}
              className="text-[#6c47ff] hover:underline font-medium ml-1 cursor-pointer"
            >
              See how it works →
            </button>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors p-1 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Header Tabs Row ── */}
      <div className="border-b border-[var(--border)] px-8 flex items-center justify-between bg-[var(--bg)] transition-colors">
        <div className="flex items-center gap-6">
          {[
            { id: "discover", label: "Discover" },
            { id: "active", label: `Active Skills (${activeCount})` },
            { id: "feed", label: "Feed" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`py-3.5 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === id
                  ? "border-[#6c47ff] text-[#6c47ff] font-semibold"
                  : "border-transparent text-[var(--text-3)] hover:text-[var(--text-1)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => toast.success("Create Custom Skill modal coming soon!")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5833e6] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          Create Skill
        </button>
      </div>

      {/* ── Main Tab Content ── */}
      {activeTab === "feed" ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[var(--bg)]">
          <div className="w-12 h-12 rounded-2xl bg-[#6c47ff]/10 flex items-center justify-center mb-3">
            <Sparkles size={20} className="text-[#6c47ff]" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-1)] mb-1">AI Feed is Empty</h3>
          <p className="text-xs text-[var(--text-3)] max-w-sm">
            Enable skills on your meetings to see automated summaries, action items, and insights stream in here.
          </p>
        </div>
      ) : activeTab === "active" ? (
        <div className="flex-1 overflow-y-auto px-8 py-7 bg-[var(--bg)]">
          {activeCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-[var(--text-4)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-1)] mb-1">No active skills yet</p>
              <p className="text-xs text-[var(--text-3)] mb-4">Browse and enable skills from the Discover catalog.</p>
              <button
                onClick={() => setActiveTab("discover")}
                className="px-4 py-2 rounded-lg bg-[#6c47ff] text-white text-xs font-semibold hover:bg-[#5833e6] transition-colors cursor-pointer"
              >
                Browse Skills
              </button>
            </div>
          ) : (
            <div className="max-w-2xl space-y-3">
              <p className="text-xs text-[var(--text-3)] mb-3 font-medium">
                {activeCount} skill{activeCount !== 1 ? "s" : ""} currently active across all your meetings
              </p>
              {skills.filter((s) => s.enabled).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xs"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ background: skill.color }}
                  >
                    <Plus size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-1)]">{skill.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)] mt-0.5">
                      <span>Enabled</span>
                      <span>·</span>
                      <div className="flex items-center gap-0.5">
                        <Zap size={11} className="text-[var(--text-4)]" />
                        <span>{skill.uses} uses</span>
                      </div>
                    </div>
                  </div>
                  <Toggle checked={true} onChange={() => toggleSkill(skill.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Discover Tab (Adaptive Light & Dark Mode) ── */
        <div className="flex-1 overflow-y-auto px-8 py-7 bg-[var(--bg)] transition-colors">
          <div className="max-w-[1240px] flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">
            {/* Left Column: Skills List */}
            <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0">
              {/* Dropdown and search button */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)] transition-colors shadow-2xs cursor-pointer"
                  >
                    <LayoutGrid size={13} className="text-[var(--text-3)]" />
                    <span className="font-medium">{selectedCategory}</span>
                    <ChevronDown size={13} className="text-[var(--text-4)] ml-1" />
                  </button>
                  {filterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl z-20 py-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                            selectedCategory === cat
                              ? "text-[#6c47ff] font-semibold bg-[#6c47ff]/10"
                              : "text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1">
                  {searchActive ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#6c47ff] bg-[var(--bg-card)]">
                      <Search size={13} className="text-[var(--text-4)]" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Search skills..."
                        autoFocus
                        className="w-full text-xs bg-transparent outline-none text-[var(--text-1)] placeholder:text-[var(--text-4)]"
                      />
                      <button
                        onClick={() => {
                          setSearchActive(false);
                          setSearchKeyword("");
                        }}
                        className="cursor-pointer text-[var(--text-4)] hover:text-[var(--text-2)]"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchActive(true)}
                      className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)] transition-colors shadow-2xs cursor-pointer"
                      title="Search skills"
                    >
                      <Search size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Section title */}
              <p className="text-xs font-semibold text-[var(--text-3)] mb-2.5 select-none">Popular</p>

              {/* List of skills */}
              <div className="space-y-1.5">
                {displayedSkills.map((skill) => {
                  const isSelected = selectedSkill.id === skill.id;
                  return (
                    <div
                      key={skill.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedSkill(skill)}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedSkill(skill)}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-2 border-[#8b5cf6] bg-[#8b5cf6]/[0.08] shadow-xs"
                          : "border-2 border-transparent hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      {/* Plus Icon Box */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{ background: skill.color }}
                      >
                        <Plus size={16} className="text-white" strokeWidth={2.5} />
                      </div>

                      {/* Name */}
                      <span className="flex-1 text-sm font-semibold text-[var(--text-1)] truncate">
                        {skill.name}
                      </span>

                      {/* Zap Uses */}
                      <div className="flex items-center gap-1 text-xs text-[var(--text-3)] font-medium mr-1 shrink-0">
                        <Zap size={12} className="text-[var(--text-4)]" />
                        <span>{skill.uses}</span>
                      </div>

                      {/* Toggle */}
                      <Toggle
                        checked={skill.enabled}
                        onChange={() => toggleSkill(skill.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detail Card & Integrations (Adaptive Light & Dark Mode) */}
            <div className="flex-1 min-w-0 max-w-[620px] w-full">
              {/* Detail Card: Soft warm ivory in light mode, sleek dark card in dark mode */}
              <div className="bg-[#FEFCF6] dark:bg-[var(--bg-card)] border border-[#EFE9DC] dark:border-[var(--border-strong)] rounded-2xl p-7 shadow-xs transition-colors">
                {/* Top icon and Copy link */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ background: selectedSkill.color }}
                  >
                    <Plus size={22} className="text-white" strokeWidth={2.5} />
                  </div>

                  <button
                    onClick={copySkillLink}
                    className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-1)] font-medium transition-colors cursor-pointer"
                  >
                    <Link2 size={13} />
                    <span>Copy Link</span>
                  </button>
                </div>

                {/* Title & Description */}
                <h2 className="text-xl font-bold text-[var(--text-1)] mt-5 mb-1.5">
                  {selectedSkill.name}
                </h2>
                <p className="text-sm text-[var(--text-2)] mb-5 leading-relaxed">
                  {selectedSkill.description}
                </p>

                {/* Author row */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-5 h-5 rounded-full overflow-hidden relative border border-black/10 dark:border-white/10 shrink-0">
                    <Image
                      src={getAvatarImage(selectedSkill.author || user.name)}
                      alt={selectedSkill.author || user.name}
                      fill
                      className="object-cover"
                      sizes="20px"
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-1)]">
                    {selectedSkill.author || user.name}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-3)] ml-1 font-medium">
                    <Zap size={11} className="text-[var(--text-4)]" />
                    <span>{selectedSkill.uses}</span>
                  </div>
                </div>

                {/* Action buttons row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleSkill(selectedSkill.id)}
                      className={`px-5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                        selectedSkill.enabled
                          ? "bg-[var(--bg-elevated)] text-[var(--text-2)] hover:bg-[var(--bg-hover)]"
                          : "bg-[#6c47ff] hover:bg-[#5833e6] text-white"
                      }`}
                    >
                      {selectedSkill.enabled ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => toast("Running skill on your latest meeting...", { icon: "✨" })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6c47ff]/10 hover:bg-[#6c47ff]/20 text-[#6c47ff] dark:text-[#a78bfa] border border-[#6c47ff]/20 dark:border-[#6c47ff]/30 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Sparkles size={12} />
                      <span>Try Skill</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toast("Editing skill prompts and output schema...")}
                    className="px-4 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-xs font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors shadow-2xs cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Share Feedback */}
              <button
                onClick={() => toast("Thank you for your feedback!", { icon: "💬" })}
                className="flex items-center gap-2 text-xs text-[var(--text-3)] hover:text-[var(--text-1)] my-5 transition-colors cursor-pointer font-medium"
              >
                <MessageSquare size={13} className="text-[var(--text-4)]" />
                <span>Share Feedback</span>
              </button>

              {/* Slack integration banner */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between shadow-xs transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Image
                    src="/assets/logos/slack.svg"
                    alt="Slack"
                    width={18}
                    height={18}
                    className="shrink-0 object-contain"
                  />
                  <p className="text-xs text-[var(--text-2)] leading-relaxed">
                    <span className="font-semibold text-[var(--text-1)]">Get insights on Slack</span>
                    {" — "}Receive skills output to your Slack channel.
                  </p>
                </div>
                <Link
                  href="/integrations"
                  className="text-xs font-semibold text-[#6c47ff] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  Connect →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Help Button ── */}
      <button
        onClick={() => toast("Need help with AI Skills? Contact support or check documentation.", { icon: "💡" })}
        className="fixed bottom-5 right-5 w-8 h-8 rounded-full bg-[#6c47ff] hover:bg-[#5833e6] text-white flex items-center justify-center font-bold text-sm shadow-lg cursor-pointer transition-transform hover:scale-105 z-30"
        title="Help"
        aria-label="Help"
      >
        ?
      </button>
    </div>
  );
}
