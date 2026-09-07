"use client";

import Link from "next/link";
import { Clock, Users, FileText, Trash2, MoreHorizontal } from "lucide-react";
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
    <div className="group bg-[#1a1a1a] border border-[#252525] rounded-xl overflow-hidden hover:border-[#3a3a3a] hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Banner */}
      <Link href={`/meetings/${meeting.id}`} className="block">
        <div
          className="h-[72px] relative flex items-end px-4 pb-3"
          style={{ background: banner }}
        >
          {/* Waveform decoration */}
          <div className="flex items-end gap-[3px] opacity-30">
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

          <div className="absolute top-3 right-3">
            <span className="text-[11px] text-white/80 bg-black/25 px-2 py-0.5 rounded-full">
              {formatDuration(meeting.duration)}
            </span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Title + menu */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/meetings/${meeting.id}`}
            className="font-medium text-sm text-[#f0f0f0] hover:text-white leading-snug line-clamp-2"
          >
            {meeting.title}
          </Link>

          {/* Kebab menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen((v) => !v);
              }}
              className="p-1 rounded text-[#555] hover:text-[#f0f0f0] hover:bg-[#2e2e2e] transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-36 bg-[#222] border border-[#333] rounded-lg shadow-xl py-1">
                <Link
                  href={`/meetings/${meeting.id}/edit`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#c0c0c0] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                >
                  Edit meeting
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(meeting.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ef4444] hover:bg-[#2a2a2a] transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-[#666]">
          <span>{formatMeetingDate(meeting.date)}</span>
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatDuration(meeting.duration)}
          </span>
          {meeting.transcript_line_count > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#444]" />
              <span className="flex items-center gap-1">
                <FileText size={11} />
                {meeting.transcript_line_count} lines
              </span>
            </>
          )}
        </div>

        {/* Participants */}
        {meeting.participants.length > 0 && (
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            <div className="flex -space-x-1.5">
              {displayParticipants.map((p) => (
                <Avatar key={p.id} name={p.name} />
              ))}
              {extraCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-[10px] text-[#aaa] ring-2 ring-[#1a1a1a]">
                  +{extraCount}
                </div>
              )}
            </div>
            <span className="text-[11px] text-[#555] ml-1">
              {meeting.participants.map((p) => p.name).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 -mt-1">
        <p className="text-[11px] text-[#444]">{formatRelativeDate(meeting.date)}</p>
      </div>
    </div>
  );
}
