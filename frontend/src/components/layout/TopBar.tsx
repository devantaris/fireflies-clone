"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Video, ChevronDown, X, Clock, Loader2 } from "lucide-react";
import { getMeetings } from "@/lib/api";
import type { MeetingListItem } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

const PAGE_TITLES: Array<[string, string]> = [
  ["/home", "Home"],
  ["/askfred", "AskFred"],
  ["/meetings/new", "New Meeting"],
  ["/meetings", "Meetings"],
  ["/tasks", "Tasks"],
  ["/ai-skills", "AI Skills"],
  ["/analytics", "Analytics"],
  ["/voice-agents", "Voice Agents"],
  ["/integrations", "Integrations"],
  ["/settings", "Settings"],
  ["/upgrade", "Plan"],
];

function getPageTitle(pathname: string): string {
  for (const [path, title] of PAGE_TITLES) {
    if (pathname === path || pathname.startsWith(path + "/")) return title;
  }
  return "";
}

/** Returns true for /meetings/[id] and /meetings/[id]/edit (non-"new" IDs) */
function isMeetingDetailRoute(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "meetings") return false;
  if (!parts[1] || parts[1] === "new") return false;
  return true;
}

// ── Add to Live Meeting Modal ─────────────────────────────────────────────────

function AddToLiveMeetingModal({ onClose }: { onClose: () => void }) {
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [language, setLanguage] = useState("English (Global)");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-[var(--text-1)]">
            Add to live meeting
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">
              Name your meeting (Optional)
            </label>
            <input
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              placeholder="e.g. Team standup"
              className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none focus:border-[#6c47ff]/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">
              Meeting link
            </label>
            <input
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Paste Zoom, Meet, Teams link..."
              className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none focus:border-[#6c47ff]/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-2)] mb-1.5 block">
              Meeting language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-2)] outline-none focus:border-[#6c47ff]/60 transition-colors appearance-none"
            >
              <option>English (Global)</option>
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!meetingLink.trim()}
            className="px-5 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] disabled:bg-[var(--border-strong)] disabled:text-[var(--text-4)] text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            Start Capturing
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Global Search Modal ───────────────────────────────────────────────────────

function GlobalSearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await getMeetings({ search: q.trim(), sort: "date_desc" });
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 300);
  }, []);

  useEffect(() => {
    doSearch(query);
    setSelected(0);
  }, [query, doSearch]);

  function navigate(id: number) {
    onClose();
    router.push(`/meetings/${id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].id);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--text-4)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across all meetings..."
            className="flex-1 bg-transparent text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none"
          />
          {loading && <Loader2 size={14} className="text-[var(--text-4)] animate-spin shrink-0" />}
          <kbd className="text-[10px] text-[var(--text-4)] bg-[var(--bg-elevated)] border border-[var(--border)] px-1.5 py-0.5 rounded font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-4)]">
              Type to search meetings by title or keyword
            </div>
          ) : loading ? (
            <div className="px-4 py-6 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-[var(--border)] rounded animate-pulse" style={{ width: `${50 + i * 15}%` }} />
                    <div className="h-2.5 bg-[var(--bg-elevated)] rounded animate-pulse w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 && searched ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-[var(--text-3)]">No meetings found for &ldquo;{query}&rdquo;</p>
              <button
                onClick={() => { onClose(); router.push("/meetings/new"); }}
                className="mt-3 text-xs text-[#6c47ff] hover:underline"
              >
                Create a new meeting
              </button>
            </div>
          ) : (
            <div className="py-1">
              {results.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => navigate(m.id)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    selected === i ? "bg-[var(--bg-hover)]" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#6c47ff]/15 flex items-center justify-center shrink-0 text-sm font-semibold text-[#6c47ff]">
                    {m.title[0]?.toUpperCase() ?? "M"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate">{m.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                      <span>{new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span>{formatDuration(m.duration)}</span>
                      {m.participant_count > 0 && (
                        <>
                          <span>·</span>
                          <span>{m.participant_count} participant{m.participant_count !== 1 ? "s" : ""}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Clock size={12} className="text-[var(--text-4)] shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────────────

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ctrl+K global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Don't render on meeting detail pages — they have their own header
  if (isMeetingDetailRoute(pathname)) return null;

  const pageTitle = getPageTitle(pathname);

  function openModal() {
    setCaptureOpen(false);
    setModalOpen(true);
  }

  return (
    <>
      <header className="shrink-0 h-[52px] flex items-center gap-3 px-5 border-b border-[var(--border)] bg-[var(--bg)]">
        {/* Page title */}
        {pageTitle && (
          <span className="text-sm font-medium text-[var(--text-1)] w-28 shrink-0">
            {pageTitle}
          </span>
        )}

        {/* Global search */}
        <div className="flex-1 flex items-center gap-2 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-sub)] hover:border-[var(--border-strong)] cursor-text transition-colors text-left"
          >
            <Search size={13} className="text-[var(--text-4)] shrink-0" />
            <span className="text-sm text-[var(--text-4)] flex-1 select-none">
              Search by title or keyword
            </span>
            <span className="text-[10px] text-[var(--text-4)] bg-[var(--bg-elevated)] border border-[var(--border)] px-1.5 py-0.5 rounded font-mono shrink-0">
              Ctrl + K
            </span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Free meetings badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-2)] pr-1">
            <div className="w-4 h-4 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0">
              <span className="text-white text-[8px] font-bold leading-none">3</span>
            </div>
            <span className="whitespace-nowrap">Free meetings</span>
          </div>

          {/* Upgrade button */}
          <button className="hidden sm:flex items-center px-3 py-1 rounded-lg border border-[#22c55e] text-[#16a34a] text-xs font-semibold hover:bg-[#22c55e]/10 transition-colors whitespace-nowrap">
            Upgrade
          </button>

          {/* Notification bell */}
          <button
            onClick={() => { const { default: t } = require("react-hot-toast"); t("No new notifications", { icon: "🔔", duration: 2000, style: { borderRadius: "8px", fontSize: "13px" } }); }}
            className="relative p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
          </button>

          {/* Capture split button */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center rounded-lg overflow-hidden border border-[#6c47ff] bg-[#6c47ff]">
              <button
                onClick={openModal}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
              >
                <Video size={13} />
                Capture
              </button>
              <button
                onClick={() => setCaptureOpen((v) => !v)}
                className="px-1.5 py-1.5 border-l border-white/25 text-white hover:bg-white/10 transition-colors"
                aria-label="More capture options"
              >
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Capture dropdown */}
            {captureOpen && (
              <>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCaptureOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50 overflow-hidden py-1">
                  {[
                    {
                      label: "Add to live meeting",
                      action: openModal,
                    },
                    {
                      label: "Schedule new meeting",
                      action: () => {
                        setCaptureOpen(false);
                        router.push("/meetings/new");
                      },
                    },
                    {
                      label: "Upload audio or video",
                      action: () => {
                        setCaptureOpen(false);
                        router.push("/meetings/new");
                      },
                    },
                    {
                      label: "Start recording",
                      action: () => setCaptureOpen(false),
                    },
                  ].map(({ label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {modalOpen && <AddToLiveMeetingModal onClose={() => setModalOpen(false)} />}
      {searchOpen && <GlobalSearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
