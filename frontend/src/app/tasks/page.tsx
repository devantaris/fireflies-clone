"use client";

import { useState } from "react";
import { ListTodo, Plus, ExternalLink } from "lucide-react";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h1 className="text-xl font-semibold text-[var(--text-1)]">Tasks</h1>
      </div>

      {/* Tabs + content */}
      <div className="flex-1 flex flex-col px-6 pt-4">
        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-[var(--border)] mb-6">
          {[
            { id: "my", label: "My Tasks" },
            { id: "all", label: "All Tasks" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as "my" | "all")}
              className={`px-4 pb-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === id
                  ? "border-[#6c47ff] text-[var(--text-1)]"
                  : "border-transparent text-[var(--text-3)] hover:text-[var(--text-2)]"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="ml-auto pb-2.5">
            <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <ExternalLink size={12} />
              Share Feedback
            </button>
          </div>
        </div>

        {/* Integration banner */}
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-1.5">
            {["#ef4444", "#f59e0b", "#3b82f6", "#06b6d4"].map((c) => (
              <div
                key={c}
                className="w-5 h-5 rounded-md"
                style={{ background: c }}
              />
            ))}
          </div>
          <p className="text-sm text-[var(--text-2)] flex-1">
            Automatically send all your tasks to your work apps.
          </p>
          <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors">
            Connect
          </button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4">
            <ListTodo size={24} className="text-[var(--text-4)]" />
          </div>
          <h3 className="text-base font-medium text-[var(--text-1)] mb-1">
            All your meeting tasks in one place
          </h3>
          <p className="text-sm text-[var(--text-3)] mb-6">
            Manage, assign and update all your meeting tasks here.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors">
            <Plus size={14} />
            New
          </button>
        </div>
      </div>
    </div>
  );
}
