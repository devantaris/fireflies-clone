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
} from "lucide-react";
import toast from "react-hot-toast";
import type { Summary, ActionItem, Chapter, KeyTopic } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import {
  generateSummary,
  createActionItem,
  updateActionItem,
  deleteActionItem,
} from "@/lib/api";

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "summary" | "action_items";

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
        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
          <FileText size={18} className="text-[#444]" />
        </div>
        <p className="text-xs text-[#555] mb-4">No summary available.</p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#7c5aff] transition-colors disabled:opacity-50"
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
      {/* Regenerate button */}
      <div className="flex justify-end">
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-[#888] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors border border-[#2e2e2e] disabled:opacity-50"
        >
          <RefreshCw size={11} className={regenerating ? "animate-spin" : ""} />
          {regenerating ? "Regenerating…" : "Regenerate"}
        </button>
      </div>

      {/* Overview */}
      {summary.overview && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-2">
            Overview
          </h3>
          <p className="text-sm text-[#b0b0b0] leading-relaxed">{summary.overview}</p>
        </div>
      )}

      {/* Key Topics */}
      {keyTopics.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-2">
            Key Topics
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {keyTopics.map((topic, i) => (
              <div
                key={i}
                title={topic.description}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-[#6c47ff]/10 text-[#9b7cff] border border-[#6c47ff]/20 cursor-default"
              >
                <Tag size={9} />
                {topic.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapters */}
      {chapters.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-2">
            Outline
          </h3>
          <div className="space-y-1">
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => onChapterSeek(ch.start_time)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-[#1e1e1e] transition-colors group"
              >
                <span className="text-[11px] tabular-nums text-[#6c47ff] font-medium shrink-0">
                  {formatTimestamp(ch.start_time)}
                </span>
                <span className="text-sm text-[#a0a0a0] group-hover:text-[#f0f0f0] transition-colors">
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
      {/* Progress bar */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between text-[11px] text-[#555] mb-1.5">
            <span>
              {done}/{items.length} completed
            </span>
            <span>{Math.round((done / items.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[#2a2a2a] rounded-full">
            <div
              className="h-1.5 bg-[#22c55e] rounded-full transition-all"
              style={{ width: `${(done / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !adding && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
            <ListTodo size={18} className="text-[#444]" />
          </div>
          <p className="text-xs text-[#555]">No action items yet.</p>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-1">
        {items.map((item) =>
          editingId === item.id ? (
            /* Edit form */
            <div key={item.id} className="bg-[#1a1a1a] rounded-lg p-3 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#f0f0f0] resize-none focus:outline-none focus:border-[#6c47ff] transition-colors"
                rows={2}
                autoFocus
              />
              <input
                type="text"
                value={editAssignee}
                onChange={(e) => setEditAssignee(e.target.value)}
                placeholder="Assignee (optional)"
                className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#6c47ff] transition-colors"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEdit}
                  className="px-2.5 py-1 rounded text-xs text-[#666] hover:text-[#aaa] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  disabled={savingId === item.id || !editText.trim()}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#7c5aff] transition-colors disabled:opacity-50"
                >
                  {savingId === item.id ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ) : (
            /* Display row */
            <div
              key={item.id}
              className="group flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <button
                onClick={() => handleToggle(item)}
                disabled={savingId === item.id}
                className="mt-0.5 shrink-0 text-[#444] hover:text-[#6c47ff] transition-colors disabled:opacity-50"
              >
                {item.completed ? (
                  <CheckCircle2 size={16} className="text-[#22c55e]" />
                ) : (
                  <Circle size={16} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    item.completed ? "line-through text-[#555]" : "text-[#c0c0c0]"
                  }`}
                >
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {item.assignee && (
                    <p className="text-[11px] text-[#555]">→ {item.assignee}</p>
                  )}
                  {item.due_date && (
                    <p className="text-[11px] text-[#444]">due {item.due_date}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="p-1 rounded text-[#555] hover:text-[#aaa] hover:bg-[#222] transition-colors"
                  title="Edit"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={savingId === item.id}
                  className="p-1 rounded text-[#555] hover:text-red-400 hover:bg-[#222] transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add form / Add button */}
      {adding ? (
        <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Action item text…"
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#f0f0f0] placeholder-[#444] resize-none focus:outline-none focus:border-[#6c47ff] transition-colors"
            rows={2}
            autoFocus
          />
          <input
            type="text"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            placeholder="Assignee (optional)"
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full bg-[#111] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setAdding(false);
                setNewText("");
                setNewAssignee("");
                setNewDueDate("");
              }}
              className="px-2.5 py-1 rounded text-xs text-[#666] hover:text-[#aaa] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={savingId === "new" || !newText.trim()}
              className="px-2.5 py-1 rounded-lg text-xs bg-[#6c47ff] text-white hover:bg-[#7c5aff] transition-colors disabled:opacity-50"
            >
              {savingId === "new" ? "Adding…" : "Add"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs text-[#555] hover:text-[#aaa] hover:bg-[#1a1a1a] transition-colors border border-dashed border-[#2e2e2e]"
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
}

export function RightPanel({ summary: initialSummary, actionItems: initialItems, meetingId, onChapterSeek }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
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

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "summary", label: "Summary" },
    { id: "action_items", label: "Action Items", count: items.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="shrink-0 flex border-b border-[#1e1e1e] px-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-1 py-3 mr-4 text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#6c47ff] text-[#f0f0f0] font-medium"
                : "border-transparent text-[#666] hover:text-[#aaa]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#6c47ff]/20 text-[#9b7cff]"
                    : "bg-[#222] text-[#666]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "summary" && (
          <OverviewSection
            summary={summary}
            meetingId={meetingId}
            onSummaryUpdate={setSummary}
            onChapterSeek={onChapterSeek}
          />
        )}
        {activeTab === "action_items" && (
          <ActionItemsSection
            items={items}
            onToggle={handleToggle}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
