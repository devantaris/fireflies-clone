"use client";

import { useEffect, useState } from "react";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import { Video, Clock, Users, TrendingUp, BarChart2 } from "lucide-react";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[var(--text-3)] font-medium">{label}</span>
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}><Icon size={14} /></span>
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-1)] mb-1">{value}</p>
      {sub && <p className="text-xs text-[var(--text-4)]">{sub}</p>}
    </div>
  );
}

// ── Horizontal bar row ───────────────────────────────────────────────────────
function BarRow({ label, count, max, color = "#6c47ff" }: { label: string; count: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-3)] w-20 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-[var(--text-3)] w-5 text-right shrink-0">{count}</span>
    </div>
  );
}

// ── Duration bucket bar ───────────────────────────────────────────────────────
function DurationBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
        <div
          className="w-full max-w-[40px] rounded-t-md bg-[#6c47ff] transition-all duration-500"
          style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        />
      </div>
      <span className="text-[10px] text-[var(--text-4)] text-center leading-tight">{label}</span>
      <span className="text-[10px] font-medium text-[var(--text-3)]">{count}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeetings().then(setMeetings).finally(() => setLoading(false));
  }, []);

  // Derived stats
  const totalMins = meetings.reduce((s, m) => s + m.duration, 0);
  const totalHours = meetings.length > 0 ? (totalMins / 60).toFixed(1) : "0";
  const avgDuration = meetings.length > 0 ? Math.round(totalMins / meetings.length) : 0;
  const totalParticipants = meetings.reduce((s, m) => s + m.participant_count, 0);
  const withTranscript = meetings.filter((m) => m.transcript_line_count > 0).length;
  const thisMonth = meetings.filter((m) => {
    const d = new Date(m.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Meetings by month (last 6 months with data)
  const byMonth: Record<string, number> = {};
  for (const m of meetings) {
    const key = new Date(m.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    byMonth[key] = (byMonth[key] ?? 0) + 1;
  }
  const monthEntries = Object.entries(byMonth).slice(0, 6);
  const monthMax = Math.max(...monthEntries.map(([, c]) => c), 1);

  // Duration buckets
  const buckets = { "< 15m": 0, "15–30m": 0, "30–60m": 0, "1–2h": 0, "> 2h": 0 };
  for (const m of meetings) {
    if (m.duration < 15) buckets["< 15m"]++;
    else if (m.duration < 30) buckets["15–30m"]++;
    else if (m.duration < 60) buckets["30–60m"]++;
    else if (m.duration < 120) buckets["1–2h"]++;
    else buckets["> 2h"]++;
  }
  const bucketMax = Math.max(...Object.values(buckets), 1);

  // Day-of-week breakdown
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const byDay: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));
  for (const m of meetings) {
    const d = days[new Date(m.date).getDay()];
    byDay[d]++;
  }
  const dayMax = Math.max(...Object.values(byDay), 1);

  if (loading) {
    return (
      <div className="min-h-full bg-[var(--bg)] px-6 py-6 max-w-5xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-[var(--bg-card)] animate-pulse" />
          ))}
        </div>
        <div className="h-48 rounded-xl bg-[var(--bg-card)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--bg)] px-6 py-6 max-w-5xl">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Meetings" value={meetings.length} sub={`${thisMonth} this month`} icon={Video} color="#6c47ff" />
        <StatCard label="Hours Recorded" value={totalHours} sub={`${avgDuration}m avg duration`} icon={Clock} color="#0ea5e9" />
        <StatCard label="Total Participants" value={totalParticipants} sub={meetings.length > 0 ? `${(totalParticipants / meetings.length).toFixed(1)} avg per meeting` : undefined} icon={Users} color="#10b981" />
        <StatCard label="Transcribed" value={withTranscript} sub={meetings.length > 0 ? `${Math.round((withTranscript / meetings.length) * 100)}% of meetings` : undefined} icon={TrendingUp} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Meetings by month */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[var(--accent-text)]" />
            <h2 className="text-sm font-semibold text-[var(--text-1)]">Meetings by Month</h2>
          </div>
          {monthEntries.length === 0 ? (
            <p className="text-sm text-[var(--text-3)] py-6 text-center">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {monthEntries.map(([month, count]) => (
                <BarRow key={month} label={month} count={count} max={monthMax} />
              ))}
            </div>
          )}
        </div>

        {/* Day of week */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[#0ea5e9]" />
            <h2 className="text-sm font-semibold text-[var(--text-1)]">Meetings by Day</h2>
          </div>
          {meetings.length === 0 ? (
            <p className="text-sm text-[var(--text-3)] py-6 text-center">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {days.map((d) => (
                <BarRow key={d} label={d} count={byDay[d]} max={dayMax} color="#0ea5e9" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duration distribution */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={14} className="text-[#10b981]" />
          <h2 className="text-sm font-semibold text-[var(--text-1)]">Meeting Duration Distribution</h2>
        </div>
        {meetings.length === 0 ? (
          <p className="text-sm text-[var(--text-3)] py-6 text-center">No data yet.</p>
        ) : (
          <div className="flex items-end gap-3 px-4">
            {Object.entries(buckets).map(([label, count]) => (
              <DurationBar key={label} label={label} count={count} max={bucketMax} />
            ))}
          </div>
        )}
      </div>

      {/* Recent meetings table */}
      {meetings.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-semibold text-[var(--text-1)]">Recent Meetings</h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {meetings.slice(0, 8).map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-[#6c47ff]/10 flex items-center justify-center shrink-0">
                  <Video size={14} className="text-[var(--accent-text)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-1)] truncate">{m.title}</p>
                  <p className="text-xs text-[var(--text-3)]">
                    {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-[var(--text-3)]">
                  <span>{m.duration}m</span>
                  <span>{m.participant_count} participants</span>
                  {m.transcript_line_count > 0 && <span className="text-[#10b981] font-medium">Transcribed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
