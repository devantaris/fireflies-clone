"use client";

import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      <div className="flex-1 flex flex-col px-6 pt-6">
        {/* Tab row */}
        <div className="flex items-center justify-between mb-5">
          {/* Segmented control */}
          <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] p-0.5">
            {(["my", "all"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === id
                    ? "bg-[var(--bg-card)] text-[var(--text-1)] shadow-sm border border-[var(--border)]"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
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
        <div className="flex items-center gap-3 px-4 py-3 mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { bg: "#e3402a", text: "A" },
              { bg: "#f97316", text: "M" },
              { bg: "#3b82f6", text: "L" },
              { bg: "#06b6d4", text: "C" },
            ].map(({ bg, text }) => (
              <div
                key={text}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: bg }}
              >
                {text}
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-2)] flex-1 min-w-0">
            Automatically send all your tasks to your work apps.
          </p>
          <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors shrink-0">
            Connect
          </button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          {/* Stacked-lines icon matching reference */}
          <div className="mb-5 text-[var(--text-4)]">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="8" width="32" height="4" rx="2" fill="currentColor" opacity="0.4" />
              <rect x="4" y="18" width="24" height="4" rx="2" fill="currentColor" opacity="0.4" />
              <rect x="4" y="28" width="28" height="4" rx="2" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-[var(--text-1)] mb-1.5">
            All your meeting tasks in one place
          </h3>
          <p className="text-sm text-[var(--text-3)] mb-6 text-center max-w-xs">
            Manage, assign and update all your meeting tasks here.
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors">
            <Plus size={14} />
            New
          </button>
        </div>
      </div>
    </div>
  );
}
