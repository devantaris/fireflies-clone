"use client";

import { useState, useRef, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useUser } from "@/lib/currentUser";
import { askFred } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

const SUGGESTIONS = [
  { icon: Check, text: "List my action items & todos for this week" },
  { icon: AlignJustify, text: "Summarize my last meeting" },
  { icon: Scissors, text: "What were the key decisions made recently?" },
  { icon: Layers, text: "What topics were discussed about performance?" },
  { icon: Calendar, text: "What action items are still open?" },
];

export default function AskFredPage() {
  const user = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await askFred(q);
      setMessages((prev) => [...prev, { role: "assistant", text: res.answer, sources: res.sources }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't reach the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const hasChat = messages.length > 0;

  return (
    <div className="flex h-full overflow-hidden bg-[var(--bg)]">
      {/* Left sub-panel */}
      <div className="w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-sub)] flex flex-col py-3 px-2 overflow-y-auto">
        <button
          onClick={() => setMessages([])}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-1)] transition-colors mb-1"
        >
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
      <div className="flex-1 min-w-0 flex flex-col">
        {!hasChat ? (
          /* Empty state — greeting + suggestions */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-8">
            <h1 className="text-xl font-semibold text-[var(--text-1)] mb-6 text-center">
              Hi {user.firstName}, how can I help today?
            </h1>

            {/* Input box */}
            <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 focus-within:border-[#6c47ff]/50 transition-colors mb-3">
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything about your meetings..."
                rows={2}
                className="w-full bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none resize-none leading-5 mb-3"
                style={{ minHeight: "40px" }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"><Plus size={16} /></button>
                  <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"><Layers size={15} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors border border-[var(--border)] rounded-md px-2 py-1">
                    Auto <ChevronDown size={11} />
                  </button>
                  <button className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"><Mic size={15} /></button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="w-7 h-7 rounded-lg bg-[#6c47ff] disabled:bg-[var(--border-strong)] flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  >
                    <Send size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* MCP row */}
            <div className="w-full max-w-2xl flex items-center gap-2 mb-8 px-1">
              <div className="flex items-center gap-1 shrink-0">
                {[["S", "#e01e5a"], ["F", "#f472b6"], ["N", "#3b82f6"]].map(([l, c]) => (
                  <div key={l} className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: c }}>
                    <span className="text-white text-[8px] font-bold">{l}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-[var(--text-3)] flex-1">Bring context from 100+ apps with custom MCP</span>
              <button className="text-xs text-[var(--accent-text)] hover:text-[var(--accent-hover)] font-medium transition-colors shrink-0">+ Add</button>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-2xl space-y-1">
              {SUGGESTIONS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => handleSend(text)}
                  className="w-full flex items-center gap-3 py-2.5 px-2 text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors rounded-lg hover:bg-[var(--bg-card)]"
                >
                  <Icon size={15} className="text-[var(--text-4)] shrink-0" />
                  <span className="text-left">{text}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-4)] mt-8">Consumes AI credits</p>
          </div>
        ) : (
          /* Chat view */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#6c47ff] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">F</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#6c47ff] text-white rounded-br-md"
                      : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-1)] rounded-bl-md"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="space-y-2">
                        {msg.text.split("\n\n").map((block, j) => (
                          <p key={j} className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: block
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                .replace(/^- /gm, '&bull; ')
                            }}
                          />
                        ))}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[var(--border)]">
                            <span className="text-[10px] text-[var(--text-4)]">Sources:</span>
                            {msg.sources.map((s) => (
                              <span key={s} className="text-[10px] bg-[#6c47ff]/10 text-[var(--accent-text)] px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white" style={{ background: user.color }}>
                      {user.initials}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6c47ff] flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">F</span>
                  </div>
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 size={16} className="animate-spin text-[var(--text-3)]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Bottom input */}
            <div className="shrink-0 border-t border-[var(--border)] px-6 py-3">
              <div className="max-w-3xl mx-auto flex items-end gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 focus-within:border-[#6c47ff]/50 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask anything about your meetings..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none resize-none leading-5"
                  style={{ minHeight: "20px" }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-[#6c47ff] disabled:bg-[var(--border-strong)] flex items-center justify-center transition-colors disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={12} className="text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
