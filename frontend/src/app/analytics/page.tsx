"use client";

import { useEffect, useState } from "react";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import { Video, Clock, Users, TrendingUp, Star } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[var(--text-3)] font-medium">{label}</span>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <span style={{ color }}>
            <Icon size={14} />
          </span>
        </div>
      </div>
      <p className="text-3xl font-bold text-[var(--text-1)] mb-1">{value}</p>
      {sub && <p className="text-xs text-[var(--text-4)]">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMeetings().then(setMeetings).finally(() => setLoading(false));
  }, []);

  const totalMins = meetings.reduce((s, m) => s + m.duration, 0);
  const totalHours = (totalMins / 60).toFixed(1);
  const avgDuration =
    meetings.length > 0 ? Math.round(totalMins / meetings.length) : 0;
  const totalParticipants = meetings.reduce((s, m) => s + m.participant_count, 0);
  const withTranscript = meetings.filter((m) => m.transcript_line_count > 0).length;
  const thisMonth = meetings.filter((m) => {
    const d = new Date(m.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="relative min-h-full flex flex-col bg-[var(--bg)]">
      {/* Analytics content — shown blurred behind paywall */}
      <div className="blur-sm pointer-events-none select-none px-6 py-6 max-w-5xl">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-[var(--bg-card)] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Meetings"
                value={meetings.length}
                sub={`${thisMonth} this month`}
                icon={Video}
                color="#6c47ff"
              />
              <StatCard
                label="Hours Recorded"
                value={totalHours}
                sub={`${avgDuration}m avg duration`}
                icon={Clock}
                color="#0ea5e9"
              />
              <StatCard
                label="Total Participants"
                value={totalParticipants}
                sub={
                  meetings.length > 0
                    ? `${(totalParticipants / meetings.length).toFixed(1)} avg per meeting`
                    : undefined
                }
                icon={Users}
                color="#10b981"
              />
              <StatCard
                label="Transcribed"
                value={`${withTranscript}`}
                sub={
                  meetings.length > 0
                    ? `${Math.round((withTranscript / meetings.length) * 100)}% of meetings`
                    : undefined
                }
                icon={TrendingUp}
                color="#f59e0b"
              />
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[var(--text-1)] mb-4">
                Meetings by Month
              </h2>
              <div className="space-y-3">
                {["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026"].map((month, i) => {
                  const pcts = [80, 55, 100, 40];
                  return (
                    <div key={month} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-3)] w-20 shrink-0">{month}</span>
                      <div className="flex-1 h-2 rounded-full bg-[var(--border)]">
                        <div className="h-2 rounded-full bg-[#6c47ff]" style={{ width: `${pcts[i]}%` }} />
                      </div>
                      <span className="text-xs text-[var(--text-3)] w-6 text-right">{i + 3}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upgrade paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full mx-6 text-center shadow-xl">
          {/* Star icon */}
          <div className="w-14 h-14 rounded-full bg-[#f59e0b] flex items-center justify-center mx-auto mb-5">
            <Star size={26} className="text-white fill-white" />
          </div>

          <h2 className="text-lg font-bold text-[var(--text-1)] mb-2">
            Upgrade your account to view analytics
          </h2>
          <p className="text-sm text-[var(--text-3)] mb-7 leading-relaxed">
            You are on the free plan. To view your analytics please upgrade to
            business plan
          </p>

          <div className="flex items-center gap-3 justify-center">
            <button className="px-5 py-2.5 rounded-lg border border-[#10b981] text-[#10b981] text-sm font-medium hover:bg-[#10b981]/10 transition-colors">
              Request free trial
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors">
              Upgrade account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
