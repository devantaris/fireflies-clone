import axios from "axios";
import type {
  MeetingListItem,
  MeetingDetail,
  TranscriptLine,
  ActionItem,
  Summary,
  MeetingFilters,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Meetings ──────────────────────────────────────────────────────────────────

export async function getMeetings(filters: Partial<MeetingFilters> & { hosted?: boolean } = {}): Promise<MeetingListItem[]> {
  const { hosted, ...rest } = filters;
  const params: Record<string, unknown> = Object.fromEntries(
    Object.entries(rest).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
  );
  if (hosted !== undefined) params.hosted = hosted;
  const { data } = await api.get<MeetingListItem[]>("/meetings", { params });
  return data;
}

export async function getMeeting(id: number): Promise<MeetingDetail> {
  const { data } = await api.get<MeetingDetail>(`/meetings/${id}`);
  return data;
}

export async function createMeeting(payload: {
  title: string;
  date: string;
  duration?: number;
  participants?: { name: string; email?: string }[];
  transcript_lines?: Omit<TranscriptLine, "id" | "meeting_id">[];
}): Promise<MeetingDetail> {
  const { data } = await api.post<MeetingDetail>("/meetings", payload);
  return data;
}

export async function updateMeeting(
  id: number,
  payload: {
    title?: string;
    date?: string;
    duration?: number;
    participants?: { name: string; email?: string }[];
  }
): Promise<MeetingDetail> {
  const { data } = await api.put<MeetingDetail>(`/meetings/${id}`, payload);
  return data;
}

export async function deleteMeeting(id: number): Promise<void> {
  await api.delete(`/meetings/${id}`);
}

// ── Transcript ────────────────────────────────────────────────────────────────

export async function getTranscript(meetingId: number): Promise<TranscriptLine[]> {
  const { data } = await api.get<TranscriptLine[]>(`/meetings/${meetingId}/transcript`);
  return data;
}

export async function replaceTranscript(
  meetingId: number,
  lines: Omit<TranscriptLine, "id" | "meeting_id">[]
): Promise<TranscriptLine[]> {
  const { data } = await api.put<TranscriptLine[]>(`/meetings/${meetingId}/transcript`, lines);
  return data;
}

// ── Summary ───────────────────────────────────────────────────────────────────

export async function getSummary(meetingId: number): Promise<Summary> {
  const { data } = await api.get<Summary>(`/meetings/${meetingId}/summary`);
  return data;
}

export async function generateSummary(meetingId: number): Promise<Summary> {
  const { data } = await api.post<Summary>(`/meetings/${meetingId}/summary/generate`);
  return data;
}

// ── Action Items ──────────────────────────────────────────────────────────────

export async function getActionItems(meetingId: number): Promise<ActionItem[]> {
  const { data } = await api.get<ActionItem[]>(`/meetings/${meetingId}/action-items`);
  return data;
}

export async function createActionItem(
  meetingId: number,
  payload: { text: string; assignee?: string; due_date?: string }
): Promise<ActionItem> {
  const { data } = await api.post<ActionItem>(`/meetings/${meetingId}/action-items`, payload);
  return data;
}

export async function updateActionItem(
  itemId: number,
  payload: { text?: string; assignee?: string; due_date?: string; completed?: boolean }
): Promise<ActionItem> {
  const { data } = await api.patch<ActionItem>(`/action-items/${itemId}`, payload);
  return data;
}

export async function deleteActionItem(itemId: number): Promise<void> {
  await api.delete(`/action-items/${itemId}`);
}

// ── AskFred ──────────────────────────────────────────────────────────────────

export async function askFred(question: string): Promise<{ answer: string; sources: string[] }> {
  const { data } = await api.post<{ answer: string; sources: string[] }>("/ask", { question });
  return data;
}
