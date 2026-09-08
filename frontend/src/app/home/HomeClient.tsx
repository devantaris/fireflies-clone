"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";

function getMeetingPlatform(title: string, id: number) {
  const t = title.toLowerCase();
  if (t.includes("roadmap") || t.includes("q4") || t.includes("zoom") || id % 4 === 0) {
    return { name: "Zoom", icon: "/assets/logos/zoom-app.svg", bg: "bg-[#2d8cff]/10" };
  }
  if (t.includes("sprint") || t.includes("standup") || t.includes("planning") || t.includes("sync") || id % 4 === 1) {
    return { name: "Google Meet", icon: "/assets/logos/google-meet.svg", bg: "bg-[#00ac47]/10" };
  }
  if (t.includes("pipeline") || t.includes("sales") || t.includes("teams") || id % 4 === 2) {
    return { name: "Microsoft Teams", icon: "/assets/logos/ms-teams.svg", bg: "bg-[#5059c9]/10" };
  }
  if (t.includes("feedback") || t.includes("slack") || t.includes("review") || id % 4 === 3) {
    return { name: "Slack", icon: "/assets/logos/slack.svg", bg: "bg-[#e01e5a]/10" };
  }
  return { name: "Fireflies", icon: "/assets/logos/fireflies-logo.svg", bg: "bg-[#6c47ff]/10" };
}
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
import { useUser } from "@/lib/currentUser";

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", emoji: "☀️" };
  if (h < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  if (h < 21) return { text: "Good Evening", emoji: "🌆" };
  return { text: "Good Night", emoji: "🌙" };
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
  const user = useUser();
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
        <h3 className="text-base font-bold text-[var(--text-1)] mb-0.5">Hi {user.firstName}!</h3>
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
  const user = useUser();
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
        {/* ── Hero Banner Card ── */}
        <div className="p-6 pb-2">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[#6c47ff]/[0.08] via-[#8b5cf6]/[0.04] to-transparent dark:from-[#6c47ff]/[0.14] dark:via-[#3b1d7a]/[0.08] dark:to-transparent p-6 shadow-sm">
            {/* Ambient decorative glow */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#6c47ff]/10 dark:bg-[#6c47ff]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top row: Greeting + Actions */}
            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-1)]">
                  {(() => {
                    const g = getGreeting();
                    return `${g.text}, ${user.firstName} ${g.emoji}`;
                  })()}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6c47ff]/10 text-[#6c47ff] dark:bg-[#6c47ff]/25 dark:text-[#a78bfa] border border-[#6c47ff]/20">
                    ✦ Personal Assistant
                  </span>
                  <span className="text-xs text-[var(--text-3)]">Your meeting intelligence hub</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-2)] hover:text-[var(--text-1)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  <MessageSquare size={13} className="text-[#6c47ff]" />
                  Feedback
                </button>
                <Link
                  href="/settings"
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-2)] hover:text-[var(--text-1)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  <Settings size={13} />
                  Manage
                </Link>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: "📡",
                  iconBg: "bg-[#6c47ff]/10 text-[#6c47ff] dark:bg-[#6c47ff]/20 dark:text-[#a78bfa]",
                  title: "Daily Brief",
                  sub: "No brief yet · catch up on today",
                  href: "/meetings",
                },
                {
                  icon: "📅",
                  iconBg: "bg-[#0ea5e9]/10 text-[#0ea5e9] dark:bg-[#0ea5e9]/20 dark:text-[#38bdf8]",
                  title: "Meeting Prep",
                  sub: "No upcoming meetings scheduled",
                  href: "/meetings/new",
                },
                {
                  icon: "✅",
                  iconBg: "bg-[#10b981]/10 text-[#10b981] dark:bg-[#10b981]/20 dark:text-[#34d399]",
                  title: "Tasks & Action Items",
                  sub: "Last 7 Days · view your todos",
                  href: "/tasks",
                },
              ].map(({ icon, iconBg, title, sub, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex flex-col justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card)] hover:border-[#6c47ff]/40 hover:shadow-md transition-all backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-sm font-bold shadow-xs`}>
                      {icon}
                    </div>
                    <span className="text-[var(--text-4)] group-hover:text-[#6c47ff] group-hover:translate-x-0.5 transition-all text-sm font-semibold">
                      →
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-1)] group-hover:text-[#6c47ff] transition-colors">
                      {title}
                    </p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5 truncate">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
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
            <div className="space-y-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-[var(--border)] rounded animate-pulse" style={{ width: `${55 + i * 10}%` }} />
                    <div className="h-2.5 bg-[var(--bg-elevated)] rounded animate-pulse w-24" />
                  </div>
                  <div className="h-3 w-12 bg-[var(--bg-elevated)] rounded animate-pulse shrink-0" />
                </div>
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
              {meetings.slice(0, 6).map((m) => {
                const platform = getMeetingPlatform(m.title, m.id);
                return (
                  <Link
                    key={m.id}
                    href={`/meetings/${m.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${platform.bg} border border-[var(--border)] flex items-center justify-center shrink-0 p-1.5 shadow-xs transition-transform group-hover:scale-105`}>
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={20}
                        height={20}
                        className="object-contain w-5 h-5"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-1)] truncate group-hover:text-[#6c47ff] transition-colors">{m.title}</p>
                      <p className="text-xs text-[var(--text-3)]">{formatMeetingDate(m.date)}</p>
                    </div>
                  </Link>
                );
              })}
              <p className="text-center text-sm text-[#6c47ff] py-3">All caught up!</p>
            </div>
          )}

          {/* Try More */}
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-[var(--text-1)] mb-4">Try More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c47ff]/20 to-[#8b5cf6]/10 border border-[#6c47ff]/30 flex items-center justify-center p-2 mb-3 shadow-xs">
                    <Image src="/assets/logos/fireflies-logo.svg" alt="Fireflies Desktop" width={22} height={22} className="object-contain" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-1)] mb-1">Desktop App</p>
                  <p className="text-xs text-[var(--text-3)] mb-3">
                    Capture conversations without any bot present in your meeting.
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors w-fit">
                  ↓ Download
                </button>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-sub)] border border-[var(--border)] flex items-center justify-center p-2 mb-3 shadow-xs">
                    <Smartphone size={20} className="text-[#6c47ff]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-1)] mb-1">Mobile App</p>
                  <p className="text-xs text-[var(--text-3)] mb-3">
                    Record in-person conversations and review meetings on the go.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)] transition-colors group"
                  >
                    <div className="w-3.5 h-3.5 flex items-center justify-center text-[var(--text-1)]">
                      <Image src="/assets/logos/apple.svg" alt="App Store" width={13} height={13} className="object-contain dark:invert" />
                    </div>
                    <span className="text-[11px] font-medium text-[var(--text-1)]">App Store</span>
                  </a>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-card)] transition-colors group"
                  >
                    <Image src="/assets/logos/google-play.svg" alt="Google Play" width={13} height={13} className="object-contain" />
                    <span className="text-[11px] font-medium text-[var(--text-1)]">Google Play</span>
                  </a>
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
