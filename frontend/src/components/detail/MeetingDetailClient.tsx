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

interface Props {
  meetingId: number;
}

function LoadingState() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-[#1e1e1e] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1e1e1e] rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-[#1e1e1e] rounded w-48 animate-pulse" />
            <div className="h-3 bg-[#1a1a1a] rounded w-32 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={22} className="text-[#3a3a3a] animate-spin" />
      </div>
    </div>
  );
}

function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <p className="text-sm text-[#c0c0c0]">Meeting not found.</p>
      <button
        onClick={onBack}
        className="text-xs text-[#6c47ff] hover:underline"
      >
        ← Back to meetings
      </button>
    </div>
  );
}

export function MeetingDetailClient({ meetingId }: Props) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMeeting(meetingId)
      .then(setMeeting)
      .catch(() => {
        setError(true);
        toast.error("Failed to load meeting");
      })
      .finally(() => setLoading(false));
  }, [meetingId]);

  // Derive duration from transcript when meeting.duration === 0
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
      <header className="shrink-0 border-b border-[#1e1e1e] px-5 py-3 flex items-center justify-between gap-4 bg-[#0f0f0f]/80 backdrop-blur-sm">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/meetings"
            className="p-1.5 rounded-lg text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-colors shrink-0"
            title="Back to meetings"
          >
            <ArrowLeft size={15} />
          </Link>

          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold text-[#f0f0f0] truncate leading-tight">
              {meeting.title}
            </h1>
            <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#555]">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {formatMeetingDate(meeting.date)}
              </span>
              {duration > 0 && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-[#3a3a3a]" />
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatDuration(duration)}
                  </span>
                </>
              )}
              {meeting.participants.length > 0 && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-[#3a3a3a]" />
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {meeting.participants.length}{" "}
                    {meeting.participants.length === 1 ? "participant" : "participants"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: avatars + edit */}
        <div className="flex items-center gap-3 shrink-0">
          {displayParticipants.length > 0 && (
            <div className="hidden sm:flex -space-x-1.5 items-center">
              {displayParticipants.map((p) => (
                <div
                  key={p.id}
                  title={p.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#0f0f0f] shrink-0"
                  style={{ background: getAvatarColor(p.name) }}
                >
                  {getInitials(p.name)}
                </div>
              ))}
              {extraCount > 0 && (
                <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[10px] text-[#888] ring-2 ring-[#0f0f0f]">
                  +{extraCount}
                </div>
              )}
            </div>
          )}

          <Link
            href={`/meetings/${meetingId}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#888] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors border border-[#2a2a2a] hover:border-[#3a3a3a]"
          >
            <Pencil size={11} />
            Edit
          </Link>
        </div>
      </header>

      {/* ── Body — two-panel split ───────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: player + transcript */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-[#1e1e1e]">
          <div className="shrink-0 p-4 border-b border-[#1e1e1e]">
            <MediaPlayer player={player} hasDuration={duration > 0} />
          </div>

          <TranscriptPanel
            lines={meeting.transcript_lines}
            currentTime={player.currentTime}
            onSeek={player.seek}
          />
        </div>

        {/* Right: summary + action items */}
        <div className="w-[340px] shrink-0 flex flex-col overflow-hidden">
          <RightPanel
            summary={meeting.summary}
            actionItems={meeting.action_items}
            meetingId={meetingId}
            onChapterSeek={player.seek}
          />
        </div>
      </div>
    </div>
  );
}
