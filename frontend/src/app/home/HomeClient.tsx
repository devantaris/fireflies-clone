"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import {
  Video,
  ChevronRight,
  Plus,
  Upload,
  Mic2,
  Calendar,
  Settings,
  Play,
  Monitor,
  Smartphone,
  Clock,
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function HomeClient() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming" | "ai-feed">("recent");

  useEffect(() => {
    getMeetings({ sort: "date_desc" })
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, []);

  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="min-h-full bg-[var(--bg)]">
      {/* Welcome card — light gradient matching reference */}
      <div
        className="mx-6 mt-6 mb-6 rounded-2xl overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, #fde8d8 0%, #f3e8ff 40%, #dde9ff 100%)",
          minHeight: 160,
        }}
      >
        <div className="px-8 py-7 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#1a1040] mb-2">
              Welcome Aboard, Devansh!
            </h1>
            <p className="text-sm text-[#5a4a7a]">
              Fireflies is now ready to automate your meetings and streamline
              your workflows.
            </p>
          </div>
          {/* Video thumbnail */}
          <div className="hidden lg:flex shrink-0">
            <div className="w-[170px] h-[108px] rounded-xl bg-[#12082c] border border-[#6c47ff]/30 flex flex-col items-center justify-center gap-2 shadow-lg overflow-hidden relative">
              <div className="absolute top-2 left-3 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#6c47ff]" />
                <span className="text-[9px] text-white/70 font-medium">
                  Fireflies | Product Demo
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-5xl">
        {/* Quick Start */}
        <div className="mb-7">
          <h2 className="text-sm font-semibold text-[var(--text-1)] mb-0.5">
            Quick Start
          </h2>
          <p className="text-xs text-[var(--text-3)] mb-4">
            Capture your first meeting or upload a recording to see Fireflies in
            action.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Schedule Meeting",
                icon: Calendar,
                href: "/meetings/new",
                color: "#f472b6",
                bg: "#fdf2f8",
              },
              {
                label: "Upload File",
                icon: Upload,
                href: "/meetings/new",
                color: "#34d399",
                bg: "#f0fdf4",
              },
              {
                label: "Capture Meeting",
                icon: Mic2,
                href: "/meetings/new",
                color: "#a78bfa",
                bg: "#faf5ff",
              },
            ].map(({ label, icon: Icon, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className="text-sm text-[var(--text-1)] font-medium">
                    {label}
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-4)] group-hover:text-[var(--text-2)] transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent / Upcoming / AI Feed tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 border-b border-[var(--border)] flex-1">
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
                  className={`px-4 pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === id
                      ? "border-[#6c47ff] text-[var(--text-1)]"
                      : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link
              href="/settings"
              className="pb-2.5 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
            >
              <Settings size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg bg-[var(--bg-card)] animate-pulse"
                />
              ))}
            </div>
          ) : activeTab === "upcoming" ? (
            <div className="py-12 text-center text-[var(--text-3)] text-sm">
              No upcoming meetings
            </div>
          ) : activeTab === "ai-feed" ? (
            <div className="py-12 text-center text-[var(--text-3)] text-sm">
              AI-generated insights from your meetings will appear here.
            </div>
          ) : recentMeetings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[var(--text-3)] text-sm mb-4">No meetings yet</p>
              <Link
                href="/meetings/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-sm font-medium transition-colors"
              >
                <Plus size={14} />
                New Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-1 mt-2">
              {recentMeetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
                >
                  {/* Fireflies-style meeting logo placeholder */}
                  <div className="w-9 h-9 rounded-lg bg-[#6c47ff]/10 flex items-center justify-center shrink-0">
                    <Video size={16} className="text-[var(--accent-text)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      {formatDate(m.date)}
                      <span className="text-[var(--text-4)]">·</span>
                      {formatDuration(m.duration)}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-[var(--text-4)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
              {meetings.length > 5 && (
                <div className="pt-2">
                  <Link
                    href="/meetings"
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[var(--accent-text)] hover:text-[var(--accent-hover)] transition-colors"
                  >
                    View all {meetings.length} meetings
                    <ChevronRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Try More section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--text-1)] mb-4">
            Try More
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                <Monitor size={18} className="text-[var(--text-3)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-1)]">
                  Download Desktop App
                </p>
                <p className="text-xs text-[var(--text-3)] mt-0.5">
                  Bot-less recording with the desktop app
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-[var(--text-3)]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-1)]">
                  Get Mobile App
                </p>
                <p className="text-xs text-[var(--text-3)] mt-0.5">
                  Record in-person meetings on mobile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
