"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getMeeting, updateMeeting } from "@/lib/api";
import type { MeetingDetail } from "@/lib/types";

interface ParticipantEntry {
  id: number;
  name: string;
  email: string;
}

interface Props {
  meetingId: number;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--text-2)] uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

const INPUT_CLS =
  "w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[#6c47ff] transition-colors";

export function EditMeetingClient({ meetingId }: Props) {
  const router = useRouter();

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [durationMins, setDurationMins] = useState("0");
  const [participants, setParticipants] = useState<ParticipantEntry[]>([
    { id: 1, name: "", email: "" },
  ]);

  useEffect(() => {
    getMeeting(meetingId)
      .then((m) => {
        setMeeting(m);
        setTitle(m.title);
        // Convert ISO date to YYYY-MM-DDTHH:MM for datetime-local input
        setDate(new Date(m.date).toISOString().slice(0, 16));
        setDurationMins(m.duration > 0 ? String(Math.round(m.duration / 60)) : "0");
        setParticipants(
          m.participants.length > 0
            ? m.participants.map((p, i) => ({
                id: i + 1,
                name: p.name,
                email: p.email ?? "",
              }))
            : [{ id: 1, name: "", email: "" }]
        );
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [meetingId]);

  function addParticipant() {
    setParticipants((prev) => [...prev, { id: Date.now(), name: "", email: "" }]);
  }

  function removeParticipant(id: number) {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  function updateParticipantField(id: number, field: "name" | "email", value: string) {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Meeting title is required");
      return;
    }

    const validParticipants = participants
      .filter((p) => p.name.trim())
      .map(({ name, email }) => ({
        name: name.trim(),
        email: email.trim() || undefined,
      }));

    const durationSecs = Math.max(0, parseInt(durationMins || "0", 10)) * 60;

    setSaving(true);
    try {
      await updateMeeting(meetingId, {
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration: durationSecs,
        participants: validParticipants,
      });
      toast.success("Meeting updated");
      router.push(`/meetings/${meetingId}`);
    } catch {
      toast.error("Failed to update meeting");
    } finally {
      setSaving(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-8 animate-pulse space-y-4">
        <div className="h-3 w-28 bg-[var(--border)] rounded" />
        <div className="h-6 w-40 bg-[var(--border)] rounded mt-4" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-[var(--border)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (fetchError || !meeting) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-[var(--text-2)]">Could not load meeting.</p>
        <Link href="/meetings" className="text-xs text-[#6c47ff] hover:underline">
          ← Back to meetings
        </Link>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Back link */}
      <Link
        href={`/meetings/${meetingId}`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Back to meeting
      </Link>

      <h1 className="text-xl font-semibold text-[var(--text-1)] mb-1">Edit Meeting</h1>
      <p className="text-sm text-[var(--text-3)] mb-7">{meeting.title}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <FieldLabel>Meeting Title *</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Product Roadmap Planning"
            className={INPUT_CLS}
          />
        </div>

        {/* Date + Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Date &amp; Time</FieldLabel>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT_CLS + " [color-scheme:dark]"}
            />
          </div>
          <div>
            <FieldLabel>Duration (minutes)</FieldLabel>
            <input
              type="number"
              min="0"
              value={durationMins}
              onChange={(e) => setDurationMins(e.target.value)}
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* Participants */}
        <div>
          <FieldLabel>Participants</FieldLabel>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updateParticipantField(p.id, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[#6c47ff] transition-colors"
                />
                <input
                  type="email"
                  value={p.email}
                  onChange={(e) => updateParticipantField(p.id, "email", e.target.value)}
                  placeholder="Email (optional)"
                  className="flex-1 bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[#6c47ff] transition-colors"
                />
                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(p.id)}
                    className="p-1.5 rounded text-[var(--text-3)] hover:text-[#ef4444] hover:bg-[var(--border-strong)] transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParticipant}
            className="flex items-center gap-1.5 text-xs text-[#6c47ff] hover:text-[var(--accent-text)] transition-colors mt-2"
          >
            <Plus size={13} />
            Add participant
          </button>
        </div>

        {/* Info note */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-xs text-[var(--text-3)] leading-relaxed">
          Transcript, summary, and action items can be managed from the meeting detail page.
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border-strong)]">
          <Link
            href={`/meetings/${meetingId}`}
            className="px-4 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border-strong)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#6c47ff] hover:bg-[#7c5aff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
