"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Video, ChevronDown, X } from "lucide-react";

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

// ── TopBar ────────────────────────────────────────────────────────────────────

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            onClick={() => router.push("/meetings?focus=search")}
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
          <button className="relative p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors">
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
    </>
  );
}
