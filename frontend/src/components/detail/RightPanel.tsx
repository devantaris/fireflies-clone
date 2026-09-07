"use client";

import { useState } from "react";
import { CheckCircle2, Circle, FileText, ListTodo } from "lucide-react";
import type { Summary, ActionItem, Chapter } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

// ── Tab types ─────────────────────────────────────────────────────────────────
type Tab = "summary" | "action_items";

// ── Overview section ──────────────────────────────────────────────────────────
function OverviewSection({ summary, onChapterSeek }: { summary: Summary | null; onChapterSeek: (t: number) => void }) {
  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
          <FileText size={18} className="text-[#444]" />
        </div>
        <p className="text-xs text-[#555]">No summary available.</p>
      </div>
    );
  }

  let chapters: Chapter[] = [];
  try {
    if (summary.chapters) chapters = JSON.parse(summary.chapters);
  } catch {}

  return (
    <div className="p-4 space-y-5">
      {/* Overview */}
      {summary.overview && (
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#555] mb-2">
            Overview
          </h3>
          <p className="text-sm text-[#b0b0b0] leading-relaxed">{summary.overview}</p>
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
function ActionItemsSection({ items }: { items: ActionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-3">
          <ListTodo size={18} className="text-[#444]" />
        </div>
        <p className="text-xs text-[#555]">No action items yet.</p>
      </div>
    );
  }

  const done = items.filter((i) => i.completed).length;

  return (
    <div className="p-4 space-y-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-[11px] text-[#555] mb-1.5">
          <span>{done}/{items.length} completed</span>
          <span>{Math.round((done / items.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-[#2a2a2a] rounded-full">
          <div
            className="h-1.5 bg-[#22c55e] rounded-full transition-all"
            style={{ width: `${(done / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 px-2 py-2 rounded-lg"
          >
            {item.completed ? (
              <CheckCircle2 size={16} className="text-[#22c55e] shrink-0 mt-0.5" />
            ) : (
              <Circle size={16} className="text-[#444] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-snug ${
                  item.completed
                    ? "line-through text-[#555]"
                    : "text-[#c0c0c0]"
                }`}
              >
                {item.text}
              </p>
              {item.assignee && (
                <p className="text-[11px] text-[#555] mt-0.5">→ {item.assignee}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Right panel ───────────────────────────────────────────────────────────────

interface Props {
  summary: Summary | null;
  actionItems: ActionItem[];
  onChapterSeek: (t: number) => void;
}

export function RightPanel({ summary, actionItems, onChapterSeek }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("summary");

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "summary", label: "Summary" },
    { id: "action_items", label: "Action Items", count: actionItems.length },
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
          <OverviewSection summary={summary} onChapterSeek={onChapterSeek} />
        )}
        {activeTab === "action_items" && (
          <ActionItemsSection items={actionItems} />
        )}
      </div>
    </div>
  );
}
