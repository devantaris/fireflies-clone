import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDuration(seconds: number): string {
  if (!seconds) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

export function formatMeetingDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatMeetingTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "h:mm a");
  } catch {
    return "";
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_PALETTE = [
  "#6c47ff", "#0891b2", "#059669", "#d97706",
  "#dc2626", "#7c3aed", "#0e7490", "#047857",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

const CARD_BANNERS = [
  "linear-gradient(135deg, #6c47ff 0%, #9b7cff 100%)",
  "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
  "linear-gradient(135deg, #059669 0%, #34d399 100%)",
  "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
  "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
  "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
];

export function getCardBanner(id: number): string {
  return CARD_BANNERS[id % CARD_BANNERS.length];
}

/**
 * Parse pasted transcript text into structured lines.
 * Supports:
 *   [0:00] Speaker: text
 *   Speaker [0:00]: text
 *   Speaker: text         (no timestamp)
 *   plain paragraph       (assigned to "Unknown")
 */
export function parseTranscriptText(
  raw: string
): Array<{ speaker: string; text: string; start_time: number; end_time: number; sequence: number }> {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const result: Array<{
    speaker: string;
    text: string;
    start_time: number;
    end_time: number;
    sequence: number;
  }> = [];

  let seq = 0;
  let prevEnd = 0;

  for (const line of lines) {
    // Pattern: [MM:SS] Speaker: text
    const m1 = line.match(/^\[(\d+):(\d+)\]\s+(.+?):\s+(.+)$/);
    if (m1) {
      const start = parseInt(m1[1]) * 60 + parseInt(m1[2]);
      const end = start + 5;
      result.push({ speaker: m1[3].trim(), text: m1[4].trim(), start_time: start, end_time: end, sequence: seq++ });
      prevEnd = end;
      continue;
    }
    // Pattern: Speaker [MM:SS]: text
    const m2 = line.match(/^(.+?)\s+\[(\d+):(\d+)\]:\s+(.+)$/);
    if (m2) {
      const start = parseInt(m2[2]) * 60 + parseInt(m2[3]);
      const end = start + 5;
      result.push({ speaker: m2[1].trim(), text: m2[4].trim(), start_time: start, end_time: end, sequence: seq++ });
      prevEnd = end;
      continue;
    }
    // Pattern: Speaker: text
    const m3 = line.match(/^([A-Za-z][A-Za-z\s]{1,30}):\s+(.+)$/);
    if (m3) {
      const start = prevEnd;
      const end = start + Math.ceil(m3[2].length / 10);
      result.push({ speaker: m3[1].trim(), text: m3[2].trim(), start_time: start, end_time: end, sequence: seq++ });
      prevEnd = end;
      continue;
    }
    // Fallback: plain text, speaker = "Speaker"
    const start = prevEnd;
    const end = start + Math.ceil(line.length / 10);
    result.push({ speaker: "Speaker", text: line, start_time: start, end_time: end, sequence: seq++ });
    prevEnd = end;
  }

  return result;
}
