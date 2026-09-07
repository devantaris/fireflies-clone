"use client";

import { useCallback, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import type { PlayerControls } from "@/hooks/usePlayer";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface Props {
  player: PlayerControls;
  hasDuration: boolean;
}

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const getTime = useCallback(
    (clientX: number) => {
      if (!barRef.current || duration === 0) return 0;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
      return ratio * duration;
    },
    [duration]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      onSeek(getTime(e.clientX));
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [getTime, onSeek]);

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={barRef}
      onMouseDown={(e) => {
        dragging.current = true;
        onSeek(getTime(e.clientX));
      }}
      className="group relative h-2 bg-[var(--border)] rounded-full cursor-pointer select-none"
    >
      {/* Filled track */}
      <div
        className="absolute inset-y-0 left-0 bg-[#6c47ff] rounded-full transition-none"
        style={{ width: `${pct}%` }}
      />
      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

// Static waveform bars for visual effect
const WAVEFORM = [
  12, 20, 35, 18, 42, 28, 50, 38, 24, 45, 32, 55, 40, 22, 48,
  36, 60, 44, 26, 52, 30, 58, 46, 34, 62, 20, 38, 50, 28, 42,
];

export function MediaPlayer({ player, hasDuration }: Props) {
  const { currentTime, duration, isPlaying, speed, seek, togglePlay, setSpeed, skipForward, skipBackward } = player;
  const pct = duration > 0 ? currentTime / duration : 0;
  const activeBars = Math.floor(pct * WAVEFORM.length);

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4 space-y-3">
      {/* Waveform visualization */}
      <div className="flex items-center gap-[2px] h-8 px-1">
        {WAVEFORM.map((h, i) => (
          <button
            key={i}
            onClick={() => seek((i / WAVEFORM.length) * duration)}
            className="flex-1 rounded-sm transition-all duration-150"
            style={{
              height: `${h}%`,
              background: i < activeBars
                ? "#6c47ff"
                : i === activeBars
                ? "#9b7cff"
                : "var(--border)",
            }}
          />
        ))}
      </div>

      {/* Progress bar + timestamps */}
      <div className="space-y-1.5">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
        <div className="flex justify-between text-[11px] text-[var(--text-3)]">
          <span>{formatTimestamp(currentTime)}</span>
          <span>{formatTimestamp(duration)}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Transport */}
        <div className="flex items-center gap-1">
          <button
            onClick={skipBackward}
            disabled={!hasDuration}
            className="p-2 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--border)] transition-colors disabled:opacity-30"
            title="Back 10s"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlay}
            disabled={!hasDuration}
            className="w-10 h-10 rounded-full bg-[#6c47ff] hover:bg-[#7c5aff] flex items-center justify-center text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
          </button>

          <button
            onClick={skipForward}
            disabled={!hasDuration}
            className="p-2 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--border)] transition-colors disabled:opacity-30"
            title="Forward 10s"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                speed === s
                  ? "bg-[#6c47ff]/20 text-[var(--accent-text)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-2)]"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {!hasDuration && (
        <p className="text-center text-[11px] text-[var(--text-4)]">
          No transcript — add one to enable playback
        </p>
      )}
    </div>
  );
}
