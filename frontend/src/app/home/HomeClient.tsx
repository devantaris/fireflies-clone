"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import {
  Video,
  Clock,
  ChevronRight,
  Plus,
  Upload,
  Mic2,
  Calendar,
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
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");

  useEffect(() => {
    getMeetings({ sort: "date_desc" })
      .then(setMeetings)
      .finally(() => setLoading(false));
  }, []);

  const totalHours =
    Math.round((meetings.reduce((s, m) => s + m.duration, 0) / 60) * 10) / 10;
  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="min-h-full bg-[var(--bg)]">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden px-8 pt-10 pb-8"
        style={{
          background:
            "linear-gradient(135deg, #1a103a 0%, #2d1b69 45%, #1a2a4a 100%)",
        }}
      >
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#9b7cff] mb-2">
            Welcome back
          </p>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome Aboard, Devansh!
          </h1>
          <p className="text-sm text-[#b8a8e8]">
            Fireflies is ready to automate your meetings and streamline your
            workflows.
          </p>
        </div>

        {/* Decorative card */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex">
          <div className="w-[160px] h-[100px] rounded-xl bg-[#12082c] border border-[#6c47ff]/30 flex items-center justify-center shadow-2xl">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center">
                <Video size={18} className="text-white" />
              </div>
              <span className="text-[10px] text-[#7c5aff] font-medium">
                Product Demo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#6c47ff]/15 flex items-center justify-center">
                <Video size={14} className="text-[var(--accent-text)]" />
              </div>
              <span className="text-xs text-[var(--text-3)] font-medium">
                Total Meetings
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-1)]">
              {loading ? "–" : meetings.length}
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#0ea5e9]/10 flex items-center justify-center">
                <Clock size={14} className="text-[#0ea5e9]" />
              </div>
              <span className="text-xs text-[var(--text-3)] font-medium">
                Hours Recorded
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-1)]">
              {loading ? "–" : totalHours}
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#10b981]/10 flex items-center justify-center">
                <Calendar size={14} className="text-[#10b981]" />
              </div>
              <span className="text-xs text-[var(--text-3)] font-medium">
                Meetings This Month
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-1)]">
              {loading
                ? "–"
                : meetings.filter((m) => {
                    const d = new Date(m.date);
                    const now = new Date();
                    return (
                      d.getMonth() === now.getMonth() &&
                      d.getFullYear() === now.getFullYear()
                    );
                  }).length}
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mb-8">
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
                bg: "#f472b620",
              },
              {
                label: "Upload File",
                icon: Upload,
                href: "/meetings/new",
                color: "#34d399",
                bg: "#34d39920",
              },
              {
                label: "Capture Meeting",
                icon: Mic2,
                href: "/meetings/new",
                color: "#a78bfa",
                bg: "#a78bfa20",
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

        {/* Recent / Upcoming tabs */}
        <div>
          <div className="flex items-center gap-1 mb-4 border-b border-[var(--border)]">
            {(["recent", "upcoming"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? "border-[#6c47ff] text-[var(--text-1)]"
                    : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                {tab === "recent" ? "Recent" : "Upcoming"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-2">
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
          ) : recentMeetings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[var(--text-3)] text-sm mb-4">No meetings yet</p>
              <Link
                href="/meetings/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
              >
                <Plus size={14} />
                New Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentMeetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meetings/${m.id}`}
                  className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#6c47ff]/10 flex items-center justify-center shrink-0">
                    <Video size={16} className="text-[var(--accent-text)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate transition-colors">
                      {m.title}
                    </p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">
                      {formatDate(m.date)} &middot; {formatDuration(m.duration)}
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
      </div>
    </div>
  );
}
