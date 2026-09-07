"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronUp, ChevronDown, Maximize2 } from "lucide-react";
import { formatTimestamp, getInitials, getAvatarColor } from "@/lib/utils";
import type { TranscriptLine } from "@/lib/types";

// ── Text highlight helper ─────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-400/25 text-yellow-200 rounded-[2px]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ── Single transcript line ────────────────────────────────────────────────────

interface LineProps {
  line: TranscriptLine;
  isActive: boolean;
  isMatch: boolean;
  searchQuery: string;
  onSeek: (t: number) => void;
  activeRef?: (el: HTMLDivElement | null) => void;
}

function TranscriptLineItem({ line, isActive, isMatch, searchQuery, onSeek, activeRef }: LineProps) {
  return (
    <div
      id={`tline-${line.id}`}
      ref={activeRef}
      onClick={() => onSeek(line.start_time)}
      className={`group flex gap-3 px-4 py-3 cursor-pointer transition-colors rounded-lg mx-2 ${
        isActive
          ? "bg-[#6c47ff]/10 border-l-2 border-[#6c47ff] pl-[14px]"
          : isMatch
          ? "bg-yellow-400/5 hover:bg-[#1e1e1e]"
          : "hover:bg-[#1a1a1a]"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: getAvatarColor(line.speaker) }}
          title={line.speaker}
        >
          {getInitials(line.speaker)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-semibold ${
              isActive ? "text-[#9b7cff]" : "text-[#c0c0c0]"
            }`}
          >
            {line.speaker}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSeek(line.start_time);
            }}
            className={`text-[11px] tabular-nums transition-colors ${
              isActive
                ? "text-[#7c5aff]"
                : "text-[#444] hover:text-[#6c47ff]"
            }`}
          >
            {formatTimestamp(line.start_time)}
          </button>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            isActive ? "text-[#f0f0f0]" : "text-[#a0a0a0]"
          }`}
        >
          <Highlight text={line.text} query={searchQuery} />
        </p>
      </div>
    </div>
  );
}

// ── Main transcript panel ─────────────────────────────────────────────────────

interface Props {
  lines: TranscriptLine[];
  currentTime: number;
  onSeek: (t: number) => void;
}

export function TranscriptPanel({ lines, currentTime, onSeek }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const [followPlayback, setFollowPlayback] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeElRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  // Find active line (last line whose start_time <= currentTime)
  const activeLine = useMemo(() => {
    if (!lines.length) return null;
    let found: TranscriptLine | null = null;
    for (const line of lines) {
      if (line.start_time <= currentTime) found = line;
      else break;
    }
    return found;
  }, [lines, currentTime]);

  // Search matches
  const matchIds = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return lines
      .filter(
        (l) =>
          l.text.toLowerCase().includes(q) ||
          l.speaker.toLowerCase().includes(q)
      )
      .map((l) => l.id);
  }, [lines, searchQuery]);

  // Reset match index when query changes
  useEffect(() => {
    setMatchIndex(0);
  }, [searchQuery]);

  // Auto-scroll to active line when playing
  useEffect(() => {
    if (!followPlayback || !activeLine || userScrolledRef.current) return;
    activeElRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeLine?.id, followPlayback]);

  // Scroll to current search match
  useEffect(() => {
    if (!matchIds.length) return;
    const id = matchIds[matchIndex % matchIds.length];
    document.getElementById(`tline-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [matchIndex, matchIds]);

  // Detect user manual scroll to pause auto-scroll temporarily
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      userScrolledRef.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        userScrolledRef.current = false;
      }, 3000);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const setActiveRef = useCallback((el: HTMLDivElement | null) => {
    activeElRef.current = el;
  }, []);

  const matchSet = useMemo(() => new Set(matchIds), [matchIds]);

  function clearSearch() {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }

  if (lines.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
          <Maximize2 size={20} className="text-[#444]" />
        </div>
        <p className="text-sm font-medium text-[#c0c0c0] mb-1">No transcript</p>
        <p className="text-xs text-[#555] max-w-xs">
          Create a meeting with transcript text to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search bar */}
      <div className="shrink-0 px-4 py-2.5 border-b border-[#1e1e1e] flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript…"
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg pl-8 pr-8 py-1.5 text-xs text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Match navigation */}
        {searchQuery && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-[#666] whitespace-nowrap">
              {matchIds.length === 0
                ? "No matches"
                : `${(matchIndex % matchIds.length) + 1}/${matchIds.length}`}
            </span>
            {matchIds.length > 0 && (
              <>
                <button
                  onClick={() =>
                    setMatchIndex((i) => (i - 1 + matchIds.length) % matchIds.length)
                  }
                  className="p-1 rounded text-[#666] hover:text-[#f0f0f0] hover:bg-[#222] transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() =>
                    setMatchIndex((i) => (i + 1) % matchIds.length)
                  }
                  className="p-1 rounded text-[#666] hover:text-[#f0f0f0] hover:bg-[#222] transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Follow toggle */}
        {!searchQuery && (
          <button
            onClick={() => setFollowPlayback((f) => !f)}
            className={`shrink-0 text-[11px] px-2 py-1 rounded transition-colors ${
              followPlayback
                ? "text-[#9b7cff] bg-[#6c47ff]/10"
                : "text-[#555] hover:text-[#aaa]"
            }`}
            title="Auto-scroll to active line"
          >
            Follow
          </button>
        )}
      </div>

      {/* Lines */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-2"
      >
        {lines.map((line) => {
          const isActive = activeLine?.id === line.id;
          return (
            <TranscriptLineItem
              key={line.id}
              line={line}
              isActive={isActive}
              isMatch={matchSet.has(line.id)}
              searchQuery={searchQuery}
              onSeek={onSeek}
              activeRef={isActive ? setActiveRef : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
