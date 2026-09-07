"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import {
  Settings,
  Monitor,
  Smartphone,
  Send,
  Mic,
  Plus,
  Layers,
  MessageSquare,
  MoreHorizontal,
  Minimize2,
  Check,
} from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatMeetingDate(dateStr: string) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

// ── Right AskFred panel ───────────────────────────────────────────────────────
function AskFredPanel() {
  const [input, setInput] = useState("");
  const suggestions = [
    "What's my day looking like?",
    "Pending tasks across all meetings",
    "List out my action items from the past week",
  ];

  return (
    <div className="w-[300px] shrink-0 border-l border-[var(--border)] flex flex-col bg-[var(--bg)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="w-6 h-6 rounded-md bg-[#6c47ff]/15 flex items-center justify-center shrink-0">
          <span className="text-[#6c47ff] text-[10px] font-bold">A</span>
        </div>
        <span className="text-sm font-medium text-[var(--text-1)] flex-1">AskFred</span>
        <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
          <MoreHorizontal size={14} />
        </button>
        <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
          <Plus size={14} />
        </button>
        <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
          <Minimize2 size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4 overflow-y-auto">
        <div className="mb-3">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 3 L20 16 L33 18 L20 20 L18 33 L16 20 L3 18 L16 16 Z" fill="#10b981" />
            <path d="M29 6 L30 11 L35 12 L30 13 L29 18 L28 13 L23 12 L28 11 Z" fill="#f59e0b" />
            <path d="M7 24 L8 28 L12 29 L8 30 L7 34 L6 30 L2 29 L6 28 Z" fill="#6c47ff" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[var(--text-1)] mb-0.5">Hi Devansh!</h3>
        <p className="text-sm text-[var(--text-2)] mb-6 text-center">Get ready for your meeting</p>
        <div className="w-full space-y-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="w-full text-left text-sm text-[var(--text-2)] px-3 py-2.5 rounded-lg hover:bg-[var(--bg-card)] hover:text-[var(--text-1)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom input */}
      <div className="border-t border-[var(--border)] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[#6c47ff]/40 transition-colors mb-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything across the meetings"
            className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none min-w-0"
          />
        </div>
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
              <Plus size={14} />
            </button>
            <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
              <Layers size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors">
              <Mic size={14} />
            </button>
            <button
              disabled={!input.trim()}
              className="w-6 h-6 rounded-md bg-[#6c47ff] disabled:bg-[var(--border-strong)] flex items-center justify-center transition-colors disabled:cursor-not-allowed"
            >
              <Send size={10} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function HomeClient() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming" | "ai-feed">("recent");

  useEffect(() => {
    getMeetings({ sort: "date_desc" })
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Main scrollable content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Gradient hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #fde8d8 0%, #f5e6ff 40%, #dde9ff 100%)",
          }}
          className="px-6 pt-5 pb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#1a1040]">
              {getGreeting()}, Devansh 🌙
            </h1>
            <button className="flex items-center gap-1.5 text-sm text-[#6b5a8a] hover:text-[#1a1040] transition-colors mt-1">
              <MessageSquare size={13} />
              Feedback
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-[#1a1040]">✦ Personal Assistant</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#6b5a8a" />
                <text x="7" y="11" textAnchor="middle" fill="#6b5a8a" fontSize="8" fontFamily="sans-serif">i</text>
              </svg>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#6b5a8a] hover:text-[#1a1040] transition-colors">
              <Settings size={12} />
              Manage
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: "📡", title: "Daily Brief", sub: "No brief yet" },
              { emoji: "📅", title: "Meeting Prep", sub: "No upcoming meetings" },
              { emoji: "✅", title: "Tasks", sub: "Last 7 Days" },
            ].map(({ emoji, title, sub }) => (
              <div key={title} className="bg-white/60 rounded-xl p-3.5 backdrop-blur-sm">
                <div className="text-xl mb-2">{emoji}</div>
                <p className="text-sm font-semibold text-[#1a1040]">{title}</p>
                <p className="text-xs text-[#6b5a8a] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Below gradient */}
        <div className="px-6 py-5">
          {/* Tabs row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {(
                [
                  { id: "recent", label: "Recent" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "ai-feed", label: "AI Feed" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === id
                      ? "bg-[var(--bg-card)] text-[var(--text-1)] border border-[var(--border)] shadow-sm"
                      : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link href="/settings" className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <Settings size={15} />
            </Link>
          </div>

          {/* Tab content */}
          {activeTab === "upcoming" ? (
            <div className="py-8 text-center text-[var(--text-3)] text-sm">No upcoming meetings</div>
          ) : activeTab === "ai-feed" ? (
            <div className="py-8 text-center text-[var(--text-3)] text-sm">AI insights will appear here</div>
          ) : loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-[var(--bg-card)] animate-pulse" />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[var(--text-3)] mb-3">No meetings yet</p>
              <Link
                href="/meetings/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-sm font-medium transition-colors"
              >
                <Plus size={14} />
                New Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {meetings.slice(0, 6).map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6c47ff]/15 flex items-center justify-center shrink-0 text-sm font-semibold text-[#6c47ff]">
                    {m.title[0]?.toUpperCase() ?? "M"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate">{m.title}</p>
                    <p className="text-xs text-[var(--text-3)]">{formatMeetingDate(m.date)}</p>
                  </div>
                </Link>
              ))}
              <p className="text-center text-sm text-[#6c47ff] py-3">All caught up!</p>
            </div>
          )}

          {/* Try More */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-[var(--text-1)] mb-4">Try More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <Monitor size={24} className="text-[var(--text-3)] mb-3" />
                <p className="text-sm font-semibold text-[var(--text-1)] mb-1">Desktop App</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Capture conversations without any bot present in your meeting.
                </p>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors">
                  ↓ Download
                </button>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <Smartphone size={24} className="text-[var(--text-3)] mb-3" />
                <p className="text-sm font-semibold text-[var(--text-1)] mb-1">Mobile App</p>
                <p className="text-xs text-[var(--text-3)] mb-3">
                  Record in-person conversations and review meetings on the go.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] text-[var(--text-3)] font-medium">
                    App Store
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] text-[10px] text-[var(--text-3)] font-medium">
                    Google Play
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right AskFred panel ── */}
      <AskFredPanel />
    </div>
  );
}
