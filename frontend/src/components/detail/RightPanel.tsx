"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  FileText,
  ListTodo,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Tag,
  Sparkles,
  X,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Summary, ActionItem, Chapter, KeyTopic, TranscriptLine } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import {
  generateSummary,
  createActionItem,
  updateActionItem,
  deleteActionItem,
} from "@/lib/api";
import { TranscriptPanel } from "@/components/detail/TranscriptPanel";
import { useUser } from "@/lib/currentUser";

// ── Tab types ─────────────────────────────────────────────────────────────────
type RightTab = "askfred" | "overview" | "actions" | "transcript";

// ── AskFred Panel ─────────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  "Identify the key decisions made.",
  "Were any challenges or issues raised?",
  "Outline the next steps and deadlines.",
];

function AskFredPanel() {
  const user = useUser();
  const [input, setInput] = useState("");
  const [showSlackBanner, setShowSlackBanner] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Connect banner */}
      {showSlackBanner && (
        <div className="shrink-0 mx-3 mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#e01e5a]/15 flex items-center justify-center">
              <span className="text-[#e01e5a] text-[10px] font-bold">S</span>
            </div>
            <div className="w-5 h-5 rounded bg-[#ea4335]/15 flex items-center justify-center">
              <span className="text-[#ea4335] text-[10px] font-bold">G</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-2)] flex-1 min-w-0">
            <span className="font-medium">Connect Slack and Gmail</span>
            {" — "}get answers with full context.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button className="text-xs text-[var(--accent-text)] font-medium hover:underline">Connect</button>
            <button onClick={() => setShowSlackBanner(false)} className="text-[var(--text-4)] hover:text-[var(--text-2)]">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Greeting + suggestions */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col items-center justify-center gap-4">
        <div className="text-center mb-2">
          <div className="mb-3">
            <Sparkles size={24} className="text-[#6c47ff] mx-auto" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-1)]">Hi {user.firstName}!</h3>
          <p className="text-sm text-[var(--text-2)] mt-0.5">Ask anything about this meeting</p>
        </div>

        {/* Suggestion chips */}
        <div className="w-full space-y-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="w-full text-left px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-2)] hover:border-[var(--border-strong)] hover:text-[var(--text-1)] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 p-3 border-t border-[var(--border)]">
        <div className="flex items-end gap-2 border border-[var(--border-strong)] rounded-xl px-3 py-2 focus-within:border-[#6c47ff]/50 transition-colors bg-[var(--bg-card)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything. Type / to run AI Skills"
            className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] resize-none outline-none min-h-[20px] max-h-[120px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setInput("");
              }
            }}
          />
          <button
            className="shrink-0 w-7 h-7 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] flex items-center justify-center text-white transition-colors"
            onClick={() => setInput("")}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Overview section ──────────────────────────────────────────────────────────
function OverviewSection({
  summary,
  meetingId,
  onSummaryUpdate,
  onChapterSeek,
}: {
  summary: Summary | null;
  meetingId: number;
  onSummaryUpdate: (s: Summary) => void;
  onChapterSeek: (t: number) => void;
}) {
  const [regenerating, setRegenerating] = useState(false);

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const updated = await generateSummary(meetingId);
      onSummaryUpdate(updated);
      toast.success("Summary regenerated");
    } catch {
      toast.error("Failed to regenerate summary");
    } finally {
      setRegenerating(false);
    }
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-3">
          <FileText size={18} className="text-[var(--text-4)]" />
        </div>
        <p className="text-xs text-[var(--text-3)] mb-4">No summary available.</p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#5535ee] transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Generating…" : "Generate Summary"}
        </button>
      </div>
    );
  }

  let chapters: Chapter[] = [];
  let keyTopics: KeyTopic[] = [];
  try {
    if (summary.chapters) chapters = JSON.parse(summary.chapters);
  } catch {}
  try {
    if (summary.key_topics) keyTopics = JSON.parse(summary.key_topics);
  } catch {}

  return (
    <div className="p-4 space-y-5">
      <div className="flex justify-end">
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-strong)] disabled:opacity-50"
        >
          <RefreshCw size={11} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Regenerating…" : "Regenerate"}
        </button>
      </div>

      {summary.overview && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-3)] mb-2">Overview</h3>
          <p className="text-sm text-[var(--text-2)] leading-relaxed">{summary.overview}</p>
        </div>
      )}

      {keyTopics.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-3)] mb-2">Key Topics</h3>
          <div className="flex flex-wrap gap-1.5">
            {keyTopics.map((topic, i) => (
              <div
                key={i}
                title={topic.description}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-[#6c47ff]/10 text-[var(--accent-text)] border border-[#6c47ff]/20 cursor-default"
              >
                <Tag size={9} />
                {topic.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {chapters.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-3)] mb-2">Outline</h3>
          <div className="space-y-1">
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => onChapterSeek(ch.start_time)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <span className="text-[11px] tabular-nums text-[#6c47ff] font-medium shrink-0">
                  {formatTimestamp(ch.start_time)}
                </span>
                <span className="text-sm text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors">
                  {ch.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Action items section ──────────────────────────────────────────────────────
interface ActionItemsSectionProps {
  items: ActionItem[];
  onToggle: (item: ActionItem) => Promise<void>;
  onAdd: (text: string, assignee: string, dueDate: string) => Promise<void>;
  onEdit: (id: number, text: string, assignee: string, dueDate: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function ActionItemsSection({ items, onToggle, onAdd, onEdit, onDelete }: ActionItemsSectionProps) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const [savingId, setSavingId] = useState<number | "new" | null>(null);

  const done = items.filter((i) => i.completed).length;

  function startEdit(item: ActionItem) {
    setEditingId(item.id);
    setEditText(item.text);
    setEditAssignee(item.assignee ?? "");
    setEditDueDate(item.due_date ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleToggle(item: ActionItem) {
    setSavingId(item.id);
    try {
      await onToggle(item);
    } finally {
      setSavingId(null);
    }
  }

  async function handleAdd() {
    if (!newText.trim()) return;
    setSavingId("new");
    try {
      await onAdd(newText.trim(), newAssignee.trim(), newDueDate);
      setNewText("");
      setNewAssignee("");
      setNewDueDate("");
      setAdding(false);
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveEdit(id: number) {
    if (!editText.trim()) return;
    setSavingId(id);
    try {
      await onEdit(id, editText.trim(), editAssignee.trim(), editDueDate);
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number) {
    setSavingId(id);
    try {
      await onDelete(id);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-4 space-y-4">
      {items.length > 0 && (
        <div>
          <div className="flex justify-between text-[11px] text-[var(--text-3)] mb-1.5">
            <span>{done}/{items.length} completed</span>
            <span>{Math.round((done / items.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--border)] rounded-full">
            <div
              className="h-1.5 bg-[#22c55e] rounded-full transition-all"
              style={{ width: `${(done / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {items.length === 0 && !adding && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-3">
            <ListTodo size={18} className="text-[var(--text-4)]" />
          </div>
          <p className="text-xs text-[var(--text-3)]">No action items yet.</p>
        </div>
      )}

      <div className="space-y-1">
        {items.map((item) =>
          editingId === item.id ? (
            <div key={item.id} className="bg-[var(--bg-elevated)] rounded-lg p-3 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-xs text-[var(--text-1)] resize-none focus:outline-none focus:border-[#6c47ff] transition-colors"
                rows={2}
                autoFocus
              />
              <input
                type="text"
                value={editAssignee}
                onChange={(e) => setEditAssignee(e.target.value)}
                placeholder="Assignee (optional)"
                className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-1)] placeholder-[var(--text-4)] focus:outline-none focus:border-[#6c47ff] transition-colors"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-1)] focus:outline-none focus:border-[#6c47ff] transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button onClick={cancelEdit} className="px-2.5 py-1 rounded text-xs text-[var(--text-3)] hover:text-[var(--text-2)]">Cancel</button>
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  disabled={savingId === item.id || !editText.trim()}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#5535ee] transition-colors disabled:opacity-50"
                >
                  {savingId === item.id ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div key={item.id} className="group flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
              <button
                onClick={() => handleToggle(item)}
                disabled={savingId === item.id}
                className="mt-0.5 shrink-0 text-[var(--text-4)] hover:text-[#6c47ff] transition-colors disabled:opacity-50"
              >
                {item.completed ? <CheckCircle2 size={16} className="text-[#22c55e]" /> : <Circle size={16} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${item.completed ? "line-through text-[var(--text-3)]" : "text-[var(--text-2)]"}`}>
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {item.assignee && <p className="text-[11px] text-[var(--text-3)]">→ {item.assignee}</p>}
                  {item.due_date && <p className="text-[11px] text-[var(--text-4)]">due {item.due_date}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => startEdit(item)} className="p-1 rounded text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--border)] transition-colors">
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={savingId === item.id}
                  className="p-1 rounded text-[var(--text-3)] hover:text-red-400 hover:bg-[var(--border)] transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {adding ? (
        <div className="bg-[var(--bg-elevated)] rounded-lg p-3 space-y-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Action item text…"
            className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-xs text-[var(--text-1)] placeholder-[var(--text-4)] resize-none focus:outline-none focus:border-[#6c47ff] transition-colors"
            rows={2}
            autoFocus
          />
          <input
            type="text"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            placeholder="Assignee (optional)"
            className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-1)] placeholder-[var(--text-4)] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-1)] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setNewText(""); setNewAssignee(""); setNewDueDate(""); }} className="px-2.5 py-1 rounded text-xs text-[var(--text-3)] hover:text-[var(--text-2)]">Cancel</button>
            <button
              onClick={handleAdd}
              disabled={savingId === "new" || !newText.trim()}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#5535ee] transition-colors disabled:opacity-50"
            >
              {savingId === "new" ? "Adding…" : "Add"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)] transition-colors border border-dashed border-[var(--border-strong)]"
        >
          <Plus size={12} />
          Add action item
        </button>
      )}
    </div>
  );
}

// ── Right panel ───────────────────────────────────────────────────────────────

interface Props {
  summary: Summary | null;
  actionItems: ActionItem[];
  meetingId: number;
  onChapterSeek: (t: number) => void;
  transcriptLines: TranscriptLine[];
  currentTime: number;
  onSeek: (t: number) => void;
}

export function RightPanel({
  summary: initialSummary,
  actionItems: initialItems,
  meetingId,
  onChapterSeek,
  transcriptLines,
  currentTime,
  onSeek,
}: Props) {
  const [rightTab, setRightTab] = useState<RightTab>("askfred");
  const [summary, setSummary] = useState<Summary | null>(initialSummary);
  const [items, setItems] = useState<ActionItem[]>(initialItems);

  async function handleToggle(item: ActionItem) {
    try {
      const updated = await updateActionItem(item.id, { completed: !item.completed });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch {
      toast.error("Failed to update item");
    }
  }

  async function handleAdd(text: string, assignee: string, dueDate: string) {
    try {
      const created = await createActionItem(meetingId, {
        text,
        assignee: assignee || undefined,
        due_date: dueDate || undefined,
      });
      setItems((prev) => [...prev, created]);
      toast.success("Action item added");
    } catch {
      toast.error("Failed to add action item");
      throw new Error("add failed");
    }
  }

  async function handleEdit(id: number, text: string, assignee: string, dueDate: string) {
    try {
      const updated = await updateActionItem(id, {
        text,
        assignee: assignee || undefined,
        due_date: dueDate || undefined,
      });
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success("Action item updated");
    } catch {
      toast.error("Failed to update action item");
      throw new Error("edit failed");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteActionItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Action item deleted");
    } catch {
      toast.error("Failed to delete action item");
      throw new Error("delete failed");
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar — AskFred | Overview | Actions | Transcript */}
      <div className="shrink-0 flex items-center border-b border-[var(--border)] px-2 overflow-x-auto">
        {(
          [
            { id: "askfred", label: "AskFred", icon: <Sparkles size={12} /> },
            { id: "overview", label: "Overview", icon: <FileText size={12} /> },
            { id: "actions",  label: "Actions",  icon: <ListTodo size={12} /> },
            { id: "transcript", label: "Transcript", icon: null },
          ] as const
        ).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setRightTab(id)}
            className={`flex items-center gap-1.5 px-2 py-3 mr-1 text-sm border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              rightTab === id
                ? "border-[#6c47ff] text-[var(--text-1)] font-medium"
                : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
            }`}
          >
            {icon && <span className={rightTab === id ? "text-[#6c47ff]" : ""}>{icon}</span>}
            {label}
            {id === "actions" && items.length > 0 && (
              <span className="ml-1 text-[10px] bg-[#6c47ff]/15 text-[var(--accent-text)] px-1.5 py-0.5 rounded-full font-semibold">
                {items.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {rightTab === "askfred" && <AskFredPanel />}
        {rightTab === "overview" && (
          <div className="flex-1 overflow-y-auto">
            <OverviewSection
              summary={summary}
              meetingId={meetingId}
              onSummaryUpdate={setSummary}
              onChapterSeek={onChapterSeek}
            />
          </div>
        )}
        {rightTab === "actions" && (
          <div className="flex-1 overflow-y-auto">
            <ActionItemsSection
              items={items}
              onToggle={handleToggle}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
        {rightTab === "transcript" && (
          <TranscriptPanel
            lines={transcriptLines}
            currentTime={currentTime}
            onSeek={onSeek}
          />
        )}
      </div>
    </div>
  );
}
