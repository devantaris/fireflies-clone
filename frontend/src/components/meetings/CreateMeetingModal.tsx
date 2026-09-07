"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { createMeeting } from "@/lib/api";
import { parseTranscriptText } from "@/lib/utils";
import type { MeetingDetail } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (m: MeetingDetail) => void;
}

interface ParticipantEntry {
  id: number;
  name: string;
  email: string;
}

export function CreateMeetingModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState("30");
  const [participants, setParticipants] = useState<ParticipantEntry[]>([
    { id: 1, name: "", email: "" },
  ]);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  function addParticipant() {
    setParticipants((p) => [
      ...p,
      { id: Date.now(), name: "", email: "" },
    ]);
  }

  function removeParticipant(id: number) {
    setParticipants((p) => p.filter((x) => x.id !== id));
  }

  function updateParticipant(id: number, field: "name" | "email", val: string) {
    setParticipants((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: val } : x))
    );
  }

  function reset() {
    setTitle("");
    setDate(new Date().toISOString().slice(0, 16));
    setDuration("30");
    setParticipants([{ id: 1, name: "", email: "" }]);
    setTranscript("");
  }

  function handleClose() {
    reset();
    onClose();
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

    const transcriptLines = transcript.trim()
      ? parseTranscriptText(transcript)
      : [];

    const durationSecs = parseInt(duration || "0") * 60;

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
      onCreated(meeting);
      handleClose();
    } catch {
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="New Meeting" width="max-w-xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wide">
            Meeting Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q4 Product Roadmap Planning"
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
        </div>

        {/* Date + Duration row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wide">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors [color-scheme:dark]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wide">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors"
            />
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wide">
            Participants
          </label>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updateParticipant(p.id, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6c47ff] transition-colors"
                />
                <input
                  type="email"
                  value={p.email}
                  onChange={(e) => updateParticipant(p.id, "email", e.target.value)}
                  placeholder="Email (optional)"
                  className="flex-1 bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6c47ff] transition-colors"
                />
                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(p.id)}
                    className="p-1.5 rounded text-[#555] hover:text-[#ef4444] hover:bg-[#2e2e2e] transition-colors"
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
            className="flex items-center gap-1.5 text-xs text-[#6c47ff] hover:text-[#9b7cff] transition-colors"
          >
            <Plus size={13} />
            Add participant
          </button>
        </div>

        {/* Transcript */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wide">
            Transcript (optional)
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            placeholder={"Paste transcript text here…\nSupports formats:\n  [0:00] Speaker: text\n  Speaker: text"}
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder-[#444] font-mono focus:outline-none focus:border-[#6c47ff] transition-colors resize-y"
          />
          {transcript && (
            <p className="text-xs text-[#6a6a6a]">
              ~{parseTranscriptText(transcript).length} lines detected
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1 border-t border-[#2e2e2e]">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-[#f0f0f0] hover:bg-[#2e2e2e] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#6c47ff] hover:bg-[#7c5aff] transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Creating…" : "Create Meeting"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
