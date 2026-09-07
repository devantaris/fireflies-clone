"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Pencil,
  Loader2,
  ChevronDown,
  ChevronRight,
  Plus,
  Video,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { getMeeting } from "@/lib/api";
import type { MeetingDetail } from "@/lib/types";
import { usePlayer } from "@/hooks/usePlayer";
import { MediaPlayer } from "@/components/detail/MediaPlayer";
import { TranscriptPanel } from "@/components/detail/TranscriptPanel";
import { RightPanel } from "@/components/detail/RightPanel";
import {
  formatMeetingDate,
  formatDuration,
  getInitials,
  getAvatarColor,
} from "@/lib/utils";
import { CURRENT_USER } from "@/lib/currentUser";

interface Props {
  meetingId: number;
}

function LoadingState() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--border)] rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-[var(--border)] rounded w-48 animate-pulse" />
            <div className="h-3 bg-[var(--bg-elevated)] rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={22} className="text-[var(--border-strong)] animate-spin" />
      </div>
    </div>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <p className="text-sm text-[var(--text-2)]">Meeting not found.</p>
      <button
        onClick={onBack}
        className="text-xs text-[#6c47ff] hover:underline"
      >
        ← Back to meetings
      </button>
    </div>
  );
}

// ── Smart Search Left Panel ───────────────────────────────────────────────────

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  onAdd,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
      >
        <span>{title}</span>
        <div className="flex items-center gap-1">
          {onAdd && (
            <span
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="p-0.5 hover:text-[var(--text-1)] text-[var(--text-4)]"
            >
              <Plus size={12} />
            </span>
          )}
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function useSpeakerStats(transcriptLines: import("@/lib/types").TranscriptLine[]) {
  return useMemo(() => {
    if (!transcriptLines.length) return [];

    // Aggregate talktime and word count per speaker
    const stats: Record<string, { talktime: number; words: number }> = {};
    for (const line of transcriptLines) {
      const dur = Math.max(0, line.end_time - line.start_time);
      const wc = line.text.trim().split(/\s+/).filter(Boolean).length;
      if (!stats[line.speaker]) stats[line.speaker] = { talktime: 0, words: 0 };
      stats[line.speaker].talktime += dur;
      stats[line.speaker].words += wc;
    }

    const totalTime = Object.values(stats).reduce((s, v) => s + v.talktime, 0) || 1;

    return Object.entries(stats)
      .map(([name, { talktime, words }]) => ({
        name,
        color: getAvatarColor(name),
        initials: getInitials(name),
        wpm: talktime > 0 ? Math.round(words / (talktime / 60)) : 0,
        talktime: Math.round((talktime / totalTime) * 100),
      }))
      .sort((a, b) => b.talktime - a.talktime);
  }, [transcriptLines]);
}

function SmartSearchPanel({
  onSeek,
  transcriptLines,
}: {
  onSeek: (t: number) => void;
  transcriptLines: import("@/lib/types").TranscriptLine[];
}) {
  const speakers = useSpeakerStats(transcriptLines);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 px-4 py-3 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-1)]">Smart Search</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* AI Filters */}
        <CollapsibleSection title="AI Filters">
          <div className="px-4">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-[var(--text-2)]">Metrics</span>
              <span className="text-xs font-medium bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full text-[var(--text-3)]">4</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Sentiments */}
        <CollapsibleSection title="Sentiments">
          <div className="px-4">
            <div className="flex items-center gap-2 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--text-4)]" />
              <span className="text-xs text-[var(--text-2)] flex-1">Neutral</span>
              <span className="text-xs text-[var(--text-3)]">100%</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Speaker Talktime */}
        <CollapsibleSection title="Speaker Talktime">
          <div className="px-4">
            {speakers.length === 0 ? (
              <p className="text-xs text-[var(--text-4)] py-2">No transcript data.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1 mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-4)]">
                  <span>Speakers</span>
                  <span className="text-center">WPM</span>
                  <span className="text-right">Talktime</span>
                </div>
                {speakers.map((sp) => (
                  <div key={sp.name} className="grid grid-cols-3 gap-1 items-center py-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: sp.color }}
                      >
                        {sp.initials}
                      </div>
                      <span className="text-xs text-[var(--text-2)] truncate">{sp.name.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: sp.color }} />
                      <span className="text-xs text-[var(--text-2)]">{sp.wpm}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="relative w-6 h-6 shrink-0">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 -rotate-90">
                          <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                          <circle
                            cx="12" cy="12" r="9"
                            fill="none"
                            stroke={sp.color}
                            strokeWidth="2.5"
                            strokeDasharray={`${2 * Math.PI * 9 * sp.talktime / 100} ${2 * Math.PI * 9}`}
                          />
                        </svg>
                      </div>
                      <span className="text-xs text-[var(--text-2)]">{sp.talktime}%</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* Topic Trackers */}
        <CollapsibleSection title="Topic Trackers" onAdd={() => {}}>
          <div className="px-4 flex flex-col items-center py-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center mb-2 text-[var(--text-4)]">
              #
            </div>
            <p className="text-xs font-medium text-[var(--text-2)] mb-0.5">No topic tracker</p>
            <p className="text-[10px] text-[var(--text-4)] leading-snug">
              This meeting is not transcribed yet to show keywords mentioned in the meeting.
            </p>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ── Center notes panel ────────────────────────────────────────────────────────

function CenterPanel({
  meeting,
  meetingId,
  duration,
}: {
  meeting: MeetingDetail;
  meetingId: number;
  duration: number;
}) {
  const [activeTab, setActiveTab] = useState<"notes" | "aiskills">("notes");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-1">
          {[
            { id: "notes", label: "Notes" },
            { id: "aiskills", label: "AI Skills · 0" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`px-3 py-3 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? "border-[#6c47ff] text-[var(--text-1)] font-medium"
                  : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="p-1.5 rounded text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--bg-hover)] transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1h5v5H1zM8 1h5v5H8zM1 8h5v5H1zM8 8h5v5H8z" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--text-1)] mb-3">{meeting.title}</h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 text-sm text-[var(--text-3)]">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: getAvatarColor(CURRENT_USER.name) }}
            >
              {getInitials(CURRENT_USER.name)}
            </div>
            <span className="text-[var(--accent-text)] text-xs font-medium hover:underline cursor-pointer">
              {CURRENT_USER.name}
            </span>
          </div>
          <span className="text-[var(--text-4)]">·</span>
          <span className="text-xs">{formatMeetingDate(meeting.date)}</span>
          {duration > 0 && (
            <>
              <span className="text-[var(--text-4)]">·</span>
              <span className="text-xs">{formatDuration(duration)}</span>
            </>
          )}
          <span className="text-[var(--text-4)]">·</span>
          <span className="text-xs flex items-center gap-1">
            English (Global)
            <ChevronDown size={11} />
          </span>
        </div>

        {/* Video button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)] transition-colors mb-8">
          <Video size={13} />
          Video
        </button>

        {/* Summary content or empty state */}
        {activeTab === "notes" && (
          meeting.summary ? (
            <div className="space-y-4">
              {meeting.summary.overview && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-3)] mb-2">Overview</h3>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">{meeting.summary.overview}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 text-[var(--text-4)]">
                <Sparkles size={28} className="mx-auto mb-3 opacity-40" />
              </div>
              <p className="text-sm font-medium text-[var(--text-2)] mb-1.5">No meeting summary available</p>
              <p className="text-xs text-[var(--text-4)] max-w-xs leading-relaxed">
                Meeting does not have enough transcript to generate a summary.
              </p>
            </div>
          )
        )}

        {activeTab === "aiskills" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles size={24} className="text-[var(--text-4)] mb-3" />
            <p className="text-sm text-[var(--text-3)]">No AI skills applied to this meeting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MeetingDetailClient({ meetingId }: Props) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"notes" | "transcript">("notes");

  useEffect(() => {
    getMeeting(meetingId)
      .then(setMeeting)
      .catch(() => {
        setError(true);
        toast.error("Failed to load meeting");
      })
      .finally(() => setLoading(false));
  }, [meetingId]);

  const duration = useMemo(() => {
    if (!meeting) return 0;
    if (meeting.duration > 0) return meeting.duration;
    const lines = meeting.transcript_lines;
    if (!lines.length) return 0;
    return Math.ceil(lines[lines.length - 1].end_time);
  }, [meeting]);

  const player = usePlayer(duration);

  if (loading) return <LoadingState />;
  if (error || !meeting) return <ErrorState onBack={() => router.push("/meetings")} />;

  const displayParticipants = meeting.participants.slice(0, 5);
  const extraCount = meeting.participants.length - 5;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-[var(--border)] px-5 py-3 flex items-center justify-between gap-4 bg-[var(--bg)]/80 backdrop-blur-sm">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 text-sm">
          <Link
            href="/meetings"
            className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors shrink-0"
          >
            #All Meetings
          </Link>
          <span className="text-[var(--text-4)]">/</span>
          <span className="text-[var(--text-1)] font-medium truncate">{meeting.title}</span>
          <button className="text-[var(--text-4)] hover:text-[var(--text-2)] shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="3" r="0.8" fill="currentColor" />
              <circle cx="7" cy="7" r="0.8" fill="currentColor" />
              <circle cx="7" cy="11" r="0.8" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Right: avatars + edit */}
        <div className="flex items-center gap-3 shrink-0">
          {displayParticipants.length > 0 && (
            <div className="hidden sm:flex -space-x-1.5 items-center">
              {displayParticipants.map((p) => (
                <div
                  key={p.id}
                  title={p.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[var(--bg)] shrink-0"
                  style={{ background: getAvatarColor(p.name) }}
                >
                  {getInitials(p.name)}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-7 h-7 rounded-full bg-[var(--border)] flex items-center justify-center text-[10px] text-[var(--text-2)] ring-2 ring-[var(--bg)]">
                  +{extraCount}
                </div>
              )}
            </div>
          )}

          <Link
            href={`/meetings/${meetingId}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border)] hover:border-[var(--border-strong)]"
          >
            <Pencil size={11} />
            Edit
          </Link>
        </div>
      </header>

      {/* Mobile panel tabs */}
      <div className="flex lg:hidden shrink-0 border-b border-[var(--border)]">
        {(["notes", "transcript"] as const).map((panel) => (
          <button
            key={panel}
            onClick={() => setMobilePanel(panel)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              mobilePanel === panel
                ? "text-[var(--text-1)] border-[#6c47ff]"
                : "text-[var(--text-3)] border-transparent hover:text-[var(--text-2)]"
            }`}
          >
            {panel === "notes" ? "Notes & Summary" : "Transcript"}
          </button>
        ))}
      </div>

      {/* ── 3-column body ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Smart Search + Media Player */}
        <div className="hidden lg:flex flex-col w-[280px] shrink-0 border-r border-[var(--border)] overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <SmartSearchPanel onSeek={player.seek} transcriptLines={meeting.transcript_lines} />
          </div>
          {/* Media player pinned at bottom of left col */}
          <div className="shrink-0 p-3 border-t border-[var(--border)] bg-[var(--bg)]">
            <MediaPlayer player={player} hasDuration={duration > 0} />
          </div>
        </div>

        {/* CENTER: Notes/Summary */}
        <div
          className={`flex flex-col overflow-hidden border-r border-[var(--border)] ${
            mobilePanel === "notes" ? "flex-1" : "hidden lg:flex lg:flex-1"
          }`}
        >
          <CenterPanel meeting={meeting} meetingId={meetingId} duration={duration} />
        </div>

        {/* RIGHT: AskFred/Transcript */}
        <div
          className={`flex flex-col overflow-hidden ${
            mobilePanel === "transcript" ? "flex-1" : "hidden lg:flex lg:w-[380px] lg:shrink-0"
          }`}
        >
          <RightPanel
            summary={meeting.summary}
            actionItems={meeting.action_items}
            meetingId={meetingId}
            onChapterSeek={player.seek}
            transcriptLines={meeting.transcript_lines}
            currentTime={player.currentTime}
            onSeek={player.seek}
          />
        </div>
      </div>
    </div>
  );
}
