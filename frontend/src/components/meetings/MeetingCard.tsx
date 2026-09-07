"use client";

import Link from "next/link";
import {
  Clock,
  FileText,
  Trash2,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  formatDuration,
  formatMeetingDate,
  formatRelativeDate,
  getInitials,
  getAvatarColor,
  getCardBanner,
} from "@/lib/utils";
import type { MeetingListItem } from "@/lib/types";

interface Props {
  meeting: MeetingListItem;
  onDelete: (id: number) => void;
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      title={name}
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#1a1a1a] shrink-0"
      style={{ background: getAvatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

export function MeetingCard({ meeting, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const banner = getCardBanner(meeting.id);
  const displayParticipants = meeting.participants.slice(0, 4);
  const extraCount = meeting.participants.length - 4;

  return (
    <div className="group bg-[#1a1a1a] border border-[#252525] rounded-xl overflow-hidden hover:border-[#363636] hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col">
      {/* Banner */}
      <Link href={`/meetings/${meeting.id}`} className="block shrink-0">
        <div
          className="h-[72px] relative flex items-end px-4 pb-3"
          style={{ background: banner }}
        >
          {/* Waveform decoration */}
          <div className="flex items-end gap-[3px] opacity-25">
            {[20, 35, 28, 45, 32, 50, 38, 42, 30, 48, 36, 44, 26, 40].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-white"
                  style={{ height: `${h}%`, maxHeight: "40px" }}
                />
              )
            )}
          </div>
          {meeting.duration > 0 && (
            <div className="absolute top-3 right-3">
              <span className="text-[11px] text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                {formatDuration(meeting.duration)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-3 min-h-0">
        {/* Title + kebab */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/meetings/${meeting.id}`}
            className="font-medium text-sm text-[#e8e8e8] hover:text-white leading-snug line-clamp-2 flex-1 min-w-0"
          >
            {meeting.title}
          </Link>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen((v) => !v);
              }}
              className="p-1 rounded text-[#555] hover:text-[#f0f0f0] hover:bg-[#2e2e2e] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="More options"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-40 bg-[#242424] border border-[#333] rounded-xl shadow-xl py-1 overflow-hidden">
                <Link
                  href={`/meetings/${meeting.id}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#c0c0c0] hover:text-white hover:bg-[#2e2e2e] transition-colors"
                >
                  <Pencil size={12} className="shrink-0" />
                  Edit meeting
                </Link>
                <div className="h-px bg-[#333] mx-2 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(meeting.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#ef4444] hover:bg-[#2e2e2e] transition-colors"
                >
                  <Trash2 size={12} className="shrink-0" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-[11px] text-[#555] flex-wrap">
          <span>{formatMeetingDate(meeting.date)}</span>
          {meeting.duration > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3a] shrink-0" />
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatDuration(meeting.duration)}
              </span>
            </>
          )}
          {meeting.transcript_line_count > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#3a3a3a] shrink-0" />
              <span className="flex items-center gap-1">
                <FileText size={10} />
                {meeting.transcript_line_count} lines
              </span>
            </>
          )}
        </div>

        {/* Participants */}
        {meeting.participants.length > 0 && (
          <div className="flex items-center gap-2 mt-auto pt-1 min-w-0">
            <div className="flex -space-x-1.5 shrink-0">
              {displayParticipants.map((p) => (
                <Avatar key={p.id} name={p.name} />
              ))}
              {extraCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-[10px] text-[#aaa] ring-2 ring-[#1a1a1a]">
                  +{extraCount}
                </div>
              )}
            </div>
            <span className="text-[11px] text-[#555] truncate min-w-0">
              {meeting.participants
                .slice(0, 3)
                .map((p) => p.name)
                .join(", ")}
              {meeting.participants.length > 3
                ? ` +${meeting.participants.length - 3} more`
                : ""}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 border-t border-[#222] pt-2.5 mt-0">
        <p className="text-[11px] text-[#3d3d3d]">{formatRelativeDate(meeting.date)}</p>
      </div>
    </div>
  );
}
