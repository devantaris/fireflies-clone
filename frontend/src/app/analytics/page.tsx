"use client";

import { useEffect, useState } from "react";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import { BarChart2, Video, Clock, Users, TrendingUp } from "lucide-react";

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
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#555] font-medium">{label}</span>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <span style={{ color }}>
            <Icon size={14} />
          </span>
        </div>
      </div>
      <p className="text-3xl font-bold text-[#f0f0f0] mb-1">{value}</p>
      {sub && <p className="text-xs text-[#444]">{sub}</p>}
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
    meetings.length > 0
      ? Math.round(totalMins / meetings.length)
      : 0;
  const totalParticipants = meetings.reduce(
    (s, m) => s + m.participant_count,
    0
  );
  const withTranscript = meetings.filter(
    (m) => m.transcript_line_count > 0
  ).length;

  const thisMonth = meetings.filter((m) => {
    const d = new Date(m.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="min-h-full flex flex-col bg-[#0e0e0e]">
      {/* Header */}
      <div className="border-b border-[#1e1e1e] px-6 py-4 flex items-center gap-3">
        <BarChart2 size={18} className="text-[#9b7cff]" />
        <h1 className="text-xl font-semibold text-[#f0f0f0]">Analytics</h1>
      </div>

      <div className="px-6 py-6 max-w-5xl">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-[#141414] animate-pulse"
              />
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

            {/* Recent activity */}
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#f0f0f0] mb-4">
                Meetings by Month
              </h2>
              {meetings.length === 0 ? (
                <p className="text-sm text-[#555] py-8 text-center">
                  No data yet — record your first meeting to see analytics.
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    meetings.reduce<Record<string, number>>((acc, m) => {
                      const key = new Date(m.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });
                      acc[key] = (acc[key] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .slice(0, 6)
                    .map(([month, count]) => {
                      const max = Math.max(
                        ...Object.values(
                          meetings.reduce<Record<string, number>>((a, m) => {
                            const k = new Date(m.date).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            );
                            a[k] = (a[k] || 0) + 1;
                            return a;
                          }, {})
                        )
                      );
                      const pct = Math.round((count / max) * 100);
                      return (
                        <div key={month} className="flex items-center gap-3">
                          <span className="text-xs text-[#555] w-20 shrink-0">
                            {month}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-[#1e1e1e]">
                            <div
                              className="h-2 rounded-full bg-[#6c47ff]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#666] w-6 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
