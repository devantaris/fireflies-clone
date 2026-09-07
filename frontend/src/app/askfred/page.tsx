"use client";

import { useState } from "react";
import { Send, Mic, Plus, Layers, X, MessageSquare } from "lucide-react";

const SUGGESTIONS = [
  "Key initiatives",
  "Summarize the channel",
  "Product feedback",
  "Identify the key decisions made.",
  "Were any challenges or issues raised?",
];

export default function AskFredPage() {
  const [input, setInput] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-full flex flex-col bg-[var(--bg)]">
      {/* Connect banner */}
      {showBanner && (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)]">
          {/* Slack + Gmail icons */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-5 h-5 rounded bg-[#e01e5a] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">S</span>
            </div>
            <div className="w-5 h-5 rounded bg-[#ea4335] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">G</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-2)] flex-1 min-w-0">
            <span className="font-medium">Connect Slack and Gmail</span>
            {" — "}get answers with full context.
          </p>
          <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium shrink-0 transition-colors">
            Connect
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Greeting */}
        <div className="text-center mb-8">
          {/* Colorful sparkles icon matching reference */}
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4 L26.5 21.5 L44 24 L26.5 26.5 L24 44 L21.5 26.5 L4 24 L21.5 21.5 Z" fill="#10b981" />
              <path d="M38 8 L39 14 L45 15 L39 16 L38 22 L37 16 L31 15 L37 14 Z" fill="#f59e0b" />
              <path d="M10 32 L11 36 L15 37 L11 38 L10 42 L9 38 L5 37 L9 36 Z" fill="#6c47ff" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-1)] mb-1">
            Hi Devansh!
          </h2>
          <p className="text-base text-[var(--text-2)]">
            Get ready for your meeting
          </p>
        </div>

        {/* Suggestion chips — vertical list */}
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-2)] hover:border-[#6c47ff]/40 hover:text-[var(--text-1)] transition-all text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input area pinned to bottom */}
      <div className="border-t border-[var(--border)] px-4 pb-3 pt-2">
        {/* Context label */}
        <div className="flex items-center gap-1 mb-1.5 px-1">
          <span className="text-xs text-[var(--text-3)] font-medium"># All Meetings</span>
        </div>

        {/* Input box */}
        <div className="flex items-end gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[#6c47ff]/40 transition-colors">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            placeholder="Ask anything. Type / to run AI skills."
            rows={1}
            className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none resize-none leading-5 py-0.5"
            style={{ minHeight: "20px" }}
          />
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3">
            <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <Plus size={16} />
            </button>
            <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <Layers size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors">
              <Mic size={16} />
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
    </div>
  );
}
