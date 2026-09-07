"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, X, Check, ChevronDown, User } from "lucide-react";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import { CURRENT_USER } from "@/lib/currentUser";

type TaskStatus = "open" | "done";

interface Task {
  id: string;
  title: string;
  assignee: string;
  assigneeInitial: string;
  assigneeColor: string;
  dueDate: string;
  meetingTitle: string;
  status: TaskStatus;
}

const AVATAR_COLORS: Record<string, string> = {
  [CURRENT_USER.firstName]: "#f59e0b",
  Janice: "#6c47ff",
  Keith: "#10b981",
  Ayush: "#0ea5e9",
  Sarah: "#f472b6",
};

function avatarColor(name: string) {
  return AVATAR_COLORS[name] ?? "#9999b0";
}

const SEED_TASKS: Task[] = [
  { id: "1", title: "Ensure Accessibility and Inclusivity Compliance", assignee: "Janice", assigneeInitial: "J", assigneeColor: "#6c47ff", dueDate: "2026-09-15", meetingTitle: "Product Sync", status: "open" },
  { id: "2", title: "Check with PMs about pipeline options for HubSpot", assignee: "Keith", assigneeInitial: "K", assigneeColor: "#10b981", dueDate: "2026-09-12", meetingTitle: "Product Sync", status: "open" },
  { id: "3", title: "Share documents around data processing agreement", assignee: "Keith", assigneeInitial: "K", assigneeColor: "#10b981", dueDate: "2026-09-10", meetingTitle: "Product Sync", status: "done" },
  { id: "4", title: "Schedule follow-up call with the design team", assignee: CURRENT_USER.firstName, assigneeInitial: CURRENT_USER.initials, assigneeColor: "#f59e0b", dueDate: "2026-09-20", meetingTitle: "Design Review", status: "open" },
  { id: "5", title: "Review Q3 roadmap and update priority list", assignee: CURRENT_USER.firstName, assigneeInitial: CURRENT_USER.initials, assigneeColor: "#f59e0b", dueDate: "2026-09-14", meetingTitle: "Quarterly Planning", status: "open" },
  { id: "6", title: "Send onboarding materials to new team members", assignee: CURRENT_USER.firstName, assigneeInitial: CURRENT_USER.initials, assigneeColor: "#f59e0b", dueDate: "2026-09-08", meetingTitle: "Team Standup", status: "done" },
  { id: "7", title: "Prepare demo environment for client presentation", assignee: "Ayush", assigneeInitial: "A", assigneeColor: "#0ea5e9", dueDate: "2026-09-18", meetingTitle: "Sales Strategy Call", status: "open" },
];

function formatDue(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Create Task Modal ─────────────────────────────────────────────────────────
function CreateTaskModal({ onClose, onSave, meetings }: { onClose: () => void; onSave: (t: Task) => void; meetings: MeetingListItem[] }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<string>(CURRENT_USER.firstName);
  const [dueDate, setDueDate] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("open");

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      id: Date.now().toString(),
      title: title.trim(),
      assignee,
      assigneeInitial: assignee[0]?.toUpperCase() ?? "?",
      assigneeColor: avatarColor(assignee),
      dueDate,
      meetingTitle: meetingTitle || "General",
      status,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--text-1)]">New Task</h2>
          <button onClick={onClose} className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">Task title</label>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && title.trim() && handleSave()} placeholder="What needs to be done?" className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none focus:border-[#6c47ff]/60 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">Assignee</label>
            <div className="relative">
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg pl-3 pr-8 py-2.5 text-sm text-[var(--text-2)] outline-none focus:border-[#6c47ff]/60 transition-colors appearance-none">
                {[CURRENT_USER.firstName, "Janice", "Keith", "Ayush", "Sarah"].map((n) => <option key={n}>{n}</option>)}
              </select>
              <User size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-2)] outline-none focus:border-[#6c47ff]/60 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">Related meeting (optional)</label>
            <div className="relative">
              <select value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg pl-3 pr-8 py-2.5 text-sm text-[var(--text-2)] outline-none focus:border-[#6c47ff]/60 transition-colors appearance-none">
                <option value="">None</option>
                {meetings.map((m) => <option key={m.id} value={m.title}>{m.title}</option>)}
                {["Product Sync", "Design Review", "Quarterly Planning", "Team Standup", "Sales Strategy Call"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">Status</label>
            <div className="flex items-center gap-2">
              {(["open", "done"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${status === s ? "border-[#6c47ff] bg-[#6c47ff]/10 text-[var(--accent-text)]" : "border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-strong)]"}`}>
                  {s === "open" ? "Open" : "Done"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="px-5 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] disabled:bg-[var(--border-strong)] disabled:text-[var(--text-4)] text-white text-sm font-medium transition-colors disabled:cursor-not-allowed">Create Task</button>
        </div>
      </div>
    </div>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors group">
      <button
        onClick={onToggle}
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${task.status === "done" ? "bg-[#6c47ff] border-[#6c47ff]" : "border-[var(--border-strong)] hover:border-[#6c47ff]"}`}
      >
        {task.status === "done" && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>
      <span className={`flex-1 text-sm min-w-0 ${task.status === "done" ? "line-through text-[var(--text-3)]" : "text-[var(--text-1)]"}`}>
        {task.title}
      </span>
      {task.dueDate && (
        <span className="text-[10px] text-[var(--text-4)] shrink-0 hidden sm:block">{formatDue(task.dueDate)}</span>
      )}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
        style={{ background: task.assigneeColor }}
        title={task.assignee}
      >
        {task.assigneeInitial}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);

  useEffect(() => {
    getMeetings().then(setMeetings).catch(() => {});
  }, []);

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "open" : "done" } : t));
  }

  function addTask(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  const filtered = activeTab === "my" ? tasks.filter((t) => t.assignee === CURRENT_USER.firstName) : tasks;

  // Group by meeting title
  const groups = new Map<string, Task[]>();
  for (const t of filtered) {
    if (!groups.has(t.meetingTitle)) groups.set(t.meetingTitle, []);
    groups.get(t.meetingTitle)!.push(t);
  }

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      <div className="flex-1 flex flex-col px-6 pt-6">
        {/* Tab row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] p-0.5">
            {(["my", "all"] as const).map((id) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === id ? "bg-[var(--bg-card)] text-[var(--text-1)] shadow-sm border border-[var(--border)]" : "text-[var(--text-3)] hover:text-[var(--text-2)]"}`}>
                {id === "my" ? "My Tasks" : "All Tasks"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
            <MessageSquare size={12} />
            Share Feedback
          </button>
        </div>

        {/* Integration banner */}
        <div className="flex items-center gap-3 px-4 py-3 mb-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-1.5 shrink-0">
            {[{ bg: "#e3402a", text: "A" }, { bg: "#f97316", text: "M" }, { bg: "#3b82f6", text: "L" }, { bg: "#06b6d4", text: "C" }].map(({ bg, text }) => (
              <div key={text} className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: bg }}>{text}</div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-2)] flex-1 min-w-0">Automatically send all your tasks to your work apps.</p>
          <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors shrink-0">Connect</button>
        </div>

        {/* New button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-sm font-medium transition-colors"
          >
            <Plus size={14} />
            New
          </button>
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="mb-4 text-[var(--text-4)]">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="4" rx="2" fill="currentColor" opacity="0.4" />
                <rect x="4" y="18" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
                <rect x="4" y="28" width="28" height="4" rx="2" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <p className="text-sm text-[var(--text-3)]">No tasks yet. Click <strong>+ New</strong> to create one.</p>
          </div>
        ) : (
          <div className="space-y-5 pb-8">
            {Array.from(groups.entries()).map(([meeting, mtasks]) => (
              <div key={meeting}>
                <div className="flex items-center gap-2 mb-2 px-3">
                  <div className="w-5 h-5 rounded bg-[#6c47ff]/15 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-[var(--accent-text)]">M</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-2)]">{meeting}</span>
                  <span className="text-[10px] text-[var(--text-4)] ml-1">{mtasks.length} task{mtasks.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-card)] divide-y divide-[var(--border)] overflow-hidden">
                  {mtasks.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateTaskModal onClose={() => setShowModal(false)} onSave={addTask} meetings={meetings} />}
    </div>
  );
}
