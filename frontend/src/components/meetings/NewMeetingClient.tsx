"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, X, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createMeeting } from "@/lib/api";
import { parseTranscriptText } from "@/lib/utils";

interface ParticipantEntry {
  id: number;
  name: string;
  email: string;
}

const INPUT_CLS =
  "w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[#6c47ff] transition-colors";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[var(--text-2)] uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

export function NewMeetingClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [durationMins, setDurationMins] = useState("30");
  const [participants, setParticipants] = useState<ParticipantEntry[]>([
    { id: 1, name: "", email: "" },
  ]);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  function addParticipant() {
    setParticipants((p) => [...p, { id: Date.now(), name: "", email: "" }]);
  }

  function removeParticipant(id: number) {
    if (participants.length <= 1) return;
    setParticipants((p) => p.filter((x) => x.id !== id));
  }

  function updateParticipant(id: number, field: "name" | "email", val: string) {
    setParticipants((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Meeting title is required");
      return;
    }

    const validParticipants = participants
      .filter((p) => p.name.trim())
      .map(({ name, email }) => ({ name: name.trim(), email: email.trim() || undefined }));

    const transcriptLines = transcript.trim() ? parseTranscriptText(transcript) : [];
    const durationSecs = Math.max(0, parseInt(durationMins || "0", 10)) * 60;

    setLoading(true);
    try {
      const meeting = await createMeeting({
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration: durationSecs,
        participants: validParticipants,
        transcript_lines: transcriptLines,
      });
      toast.success("Meeting created");
      router.push(`/meetings/${meeting.id}`);
    } catch {
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <Link
        href="/meetings"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Back to meetings
      </Link>

      <h1 className="text-xl font-semibold text-[var(--text-1)] mb-1">New Meeting</h1>
      <p className="text-sm text-[var(--text-3)] mb-7">Add a meeting manually or paste a transcript.</p>

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
            autoFocus
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
                  onChange={(e) => updateParticipant(p.id, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[#6c47ff] transition-colors"
                />
                <input
                  type="email"
                  value={p.email}
                  onChange={(e) => updateParticipant(p.id, "email", e.target.value)}
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

        {/* Transcript */}
        <div>
          <FieldLabel>Transcript (optional)</FieldLabel>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            placeholder={"Paste transcript text here…\nSupports:\n  [0:00] Speaker: text\n  Speaker: text"}
            className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder-[var(--text-4)] font-mono focus:outline-none focus:border-[#6c47ff] transition-colors resize-y"
          />
          {transcript && (
            <p className="text-xs text-[var(--text-3)] mt-1">
              ~{parseTranscriptText(transcript).length} lines detected
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-[var(--border-strong)]">
          <Link
            href="/meetings"
            className="px-4 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border-strong)] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#6c47ff] hover:bg-[#7c5aff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Creating…" : "Create Meeting"}
          </button>
        </div>
      </form>
    </div>
  );
}
