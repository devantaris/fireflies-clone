"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Summarize my last meeting",
  "What action items are pending?",
  "Find meetings with John",
  "Key decisions from this week",
  "Topics discussed last month",
];

export default function AskFredPage() {
  const [input, setInput] = useState("");

  return (
    <div className="min-h-full flex flex-col bg-[#0e0e0e]">
      {/* Header */}
      <div className="border-b border-[#1e1e1e] px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#6c47ff]/15 flex items-center justify-center">
          <Bot size={16} className="text-[#9b7cff]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#f0f0f0]">AskFred</h1>
          <p className="text-xs text-[#555]">AI assistant for your meetings</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Greeting */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c47ff] to-[#9b7cff] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#6c47ff]/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-1">
            Hi Devansh!
          </h2>
          <p className="text-sm text-[#666]">
            Ask anything about your meetings
          </p>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 max-w-lg">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="px-3.5 py-2 rounded-full border border-[#2e2e2e] bg-[#141414] text-xs text-[#aaa] hover:border-[#6c47ff]/50 hover:text-[#d0d0d0] hover:bg-[#1a1040]/30 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar pinned to bottom */}
      <div className="border-t border-[#1e1e1e] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3 bg-[#141414] border border-[#2e2e2e] rounded-xl px-4 py-3 focus-within:border-[#6c47ff]/50 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything. Type / to run AI skills."
            className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#444] outline-none"
          />
          <button
            disabled={!input.trim()}
            className="w-7 h-7 rounded-lg bg-[#6c47ff] disabled:bg-[#333] flex items-center justify-center transition-colors disabled:cursor-not-allowed"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
