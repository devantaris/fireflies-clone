"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Link2,
  Mic,
  Send,
  Layers,
  Check,
  AlignJustify,
  Scissors,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/currentUser";

const SUGGESTIONS = [
  { icon: Check, text: "List my action items & todos for this week" },
  { icon: AlignJustify, text: "Summarize my last meeting" },
  { icon: Scissors, text: "Prepare me for the upcoming meeting" },
  { icon: Layers, text: "Connect Gmail, Notion, and 30+ sources for richer insights." },
  { icon: Calendar, text: "Prepare weekly digest, based on my meetings" },
];

export default function AskFredPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex h-full overflow-hidden bg-[var(--bg)]">
      {/* Left sub-panel */}
      <div className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-sub)] flex flex-col py-3 px-2 overflow-y-auto">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)] transition-colors mb-1">
          <Plus size={15} className="text-[var(--text-3)]" />
          New Chat
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)] transition-colors mb-1">
          <Search size={15} className="text-[var(--text-3)]" />
          Search
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)] transition-colors mb-3">
          <Link2 size={15} className="text-[var(--text-3)]" />
          Connectors
        </button>

        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-4)] mb-1">
          Recents
        </p>
        <p className="px-3 text-xs text-[var(--text-4)] mb-1">Today</p>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-3)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-2)] transition-colors">
          Start a Meeting
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col items-center justify-center px-8 py-8">
        <h1 className="text-xl font-semibold text-[var(--text-1)] mb-6 text-center">
          Hi {CURRENT_USER.firstName}, how can I help today?
        </h1>

        {/* Large input box */}
        <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 focus-within:border-[#6c47ff]/50 transition-colors mb-3">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            placeholder="Ask anything, @ for context and / for skills"
            rows={2}
            className="w-full bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none resize-none leading-5 mb-3"
            style={{ minHeight: "40px" }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                <Plus size={16} />
              </button>
              <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                <Layers size={15} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors border border-[var(--border)] rounded-md px-2 py-1">
                Auto <ChevronDown size={11} />
              </button>
              <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
                <Mic size={15} />
              </button>
              <button
                disabled={!input.trim()}
                className="w-7 h-7 rounded-lg bg-[#6c47ff] disabled:bg-[var(--border-strong)] flex items-center justify-center transition-colors disabled:cursor-not-allowed"
              >
                <Send size={12} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* MCP context row */}
        <div className="w-full max-w-2xl flex items-center gap-2 mb-8 px-1">
          <div className="flex items-center gap-1 shrink-0">
            {[["S", "#e01e5a"], ["F", "#f472b6"], ["N", "#3b82f6"]].map(([l, c]) => (
              <div key={l} className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: c }}>
                <span className="text-white text-[8px] font-bold">{l}</span>
              </div>
            ))}
          </div>
          <span className="text-xs text-[var(--text-3)] flex-1">
            Bring context from 100+ apps with custom MCP
          </span>
          <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors shrink-0">
            + Add
          </button>
        </div>

        {/* Suggestion items */}
        <div className="w-full max-w-2xl space-y-1">
          {SUGGESTIONS.map(({ icon: Icon, text }) => (
            <button
              key={text}
              onClick={() => setInput(text)}
              className="w-full flex items-center gap-3 py-2.5 px-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors rounded-lg hover:bg-[var(--bg-card)]"
            >
              <Icon size={15} className="text-[var(--text-4)] shrink-0" />
              <span className="text-left">{text}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--text-4)] mt-8">Consumes AI credits</p>
      </div>
    </div>
  );
}
