"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Video,
  Bell,
  Plus,
  MessageSquare,
  ChevronRight,
  SlidersHorizontal,
  UploadCloud,
  Inbox,
  Sparkles,
  Layers,
  Mic,
  ArrowUp,
  X,
  Trash2,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@/lib/currentUser";
import { getMeetings, deleteMeeting } from "@/lib/api";
import type { MeetingListItem, MeetingDetail } from "@/lib/types";
import { CreateMeetingModal } from "@/components/meetings/CreateMeetingModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getAvatarImage } from "@/lib/utils";
import { NotificationPanel } from "@/components/layout/TopBar";

const FALLBACK_MEETINGS: MeetingListItem[] = [
  {
    id: 1,
    title: "Test Meet",
    date: new Date(Date.now() - 3600000).toISOString(),
    duration: 420, // 7 min
    is_hosted: true,
    participant_count: 1,
    participants: [{ id: 1, meeting_id: 1, name: "Devansh", email: "devansh@company.com" }],
    transcript_line_count: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Q4 Product Roadmap Planning",
    date: new Date(Date.now() - 86400000).toISOString(),
    duration: 3240, // 54 min
    is_hosted: true,
    participant_count: 3,
    participants: [
      { id: 2, meeting_id: 2, name: "Sarah Chen", email: "sarah@company.com" },
      { id: 3, meeting_id: 2, name: "Marcus Webb", email: "marcus@company.com" },
    ],
    transcript_line_count: 38,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Customer Feedback Review — October",
    date: new Date(Date.now() - 172800000).toISOString(),
    duration: 2700, // 45 min
    is_hosted: false,
    participant_count: 2,
    participants: [{ id: 4, meeting_id: 3, name: "Emma Torres", email: "emma@company.com" }],
    transcript_line_count: 24,
    created_at: new Date().toISOString(),
  },
];

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDateHeader(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MeetingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();

  // Channels state
  const [activeChannel, setActiveChannel] = useState<"my-meetings" | "all-meetings" | "voice-agents" | "uploads">("my-meetings");
  const [channelSearch, setChannelSearch] = useState("");

  // Search & Filter state
  // Default is "all", meaning both hosted and shared are shown
  const [ownerFilter, setOwnerFilter] = useState<"all" | "hosted" | "shared">("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFiltersBar, setShowFiltersBar] = useState(false);
  const [sortOrder, setSortOrder] = useState<"date_desc" | "date_asc">("date_desc");
  const [notifOpen, setNotifOpen] = useState(false);

  // Data state
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // AskFred side panel state
  const [showConnectBanner, setShowConnectBanner] = useState(true);
  const [chatInput, setChatInput] = useState("");

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMeetings({
        search: searchQuery || undefined,
        sort: sortOrder,
        hosted: ownerFilter === "all" ? undefined : ownerFilter === "hosted",
      });
      if (!data || data.length === 0) {
        // Apply local filter to fallback mock data if backend returned empty
        const filteredFallback = FALLBACK_MEETINGS.filter((m) => {
          if (ownerFilter === "hosted" && !m.is_hosted) return false;
          if (ownerFilter === "shared" && m.is_hosted) return false;
          if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          return true;
        });
        setMeetings(filteredFallback);
      } else {
        setMeetings(data);
      }
    } catch {
      // Offline fallback
      const filteredFallback = FALLBACK_MEETINGS.filter((m) => {
        if (ownerFilter === "hosted" && !m.is_hosted) return false;
        if (ownerFilter === "shared" && m.is_hosted) return false;
        if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
      setMeetings(filteredFallback);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortOrder, ownerFilter]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Toggle handlers for the two options
  // In default, both kinds of meetings are shown on the screen ("all")
  function handleToggleHosted() {
    setOwnerFilter((prev) => (prev === "hosted" ? "all" : "hosted"));
  }

  function handleToggleShared() {
    setOwnerFilter((prev) => (prev === "shared" ? "all" : "shared"));
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMeeting(deleteId);
      setMeetings((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Meeting deleted");
    } catch {
      // Local removal for mock data
      setMeetings((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Meeting deleted");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function handleCreated(meeting: MeetingDetail) {
    router.push(`/meetings/${meeting.id}`);
  }

  // Group meetings by Date
  const groupedMeetings = useMemo(() => {
    const groups: { [key: string]: MeetingListItem[] } = {};
    for (const m of meetings) {
      const key = formatDateHeader(m.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }
    return groups;
  }, [meetings]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--bg)]">
      {/* ── Column 1: Channels Sub-sidebar ── */}
      <div className="w-56 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--bg-sub)] select-none">
        {/* Search channels header */}
        <div className="h-[52px] border-b border-[var(--border)] px-3 flex items-center shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] w-full focus-within:border-[#6c47ff]/50 transition-colors">
            <Search size={13} className="text-[var(--text-4)] shrink-0" />
            <input
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              placeholder="Search channels"
              className="bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none w-full min-w-0"
            />
          </div>
        </div>

        {/* Main channels list */}
        <div className="p-2 space-y-0.5 border-b border-[var(--border)] shrink-0">
          <button
            onClick={() => setActiveChannel("my-meetings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              activeChannel === "my-meetings"
                ? "bg-[#6c47ff]/10 text-[#6c47ff]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-card)] hover:text-[var(--text-1)]"
            }`}
          >
            <span className="text-[#6c47ff] font-bold text-sm leading-none">#</span>
            <span className="flex-1 truncate">My Meetings</span>
          </button>

          <button
            onClick={() => setActiveChannel("all-meetings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              activeChannel === "all-meetings"
                ? "bg-[#6c47ff]/10 text-[#6c47ff]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-card)] hover:text-[var(--text-1)]"
            }`}
          >
            <Inbox size={14} className="text-[var(--text-3)] shrink-0" />
            <span className="flex-1 truncate">All Meetings</span>
          </button>

          <button
            onClick={() => setActiveChannel("voice-agents")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              activeChannel === "voice-agents"
                ? "bg-[#6c47ff]/10 text-[#6c47ff]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-card)] hover:text-[var(--text-1)]"
            }`}
          >
            <Video size={14} className="text-[var(--text-3)] shrink-0" />
            <span className="flex-1 truncate">Voice Agent Meetings</span>
          </button>

          <button
            onClick={() => setActiveChannel("uploads")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              activeChannel === "uploads"
                ? "bg-[#6c47ff]/10 text-[#6c47ff]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-card)] hover:text-[var(--text-1)]"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <UploadCloud size={14} className="text-[var(--text-3)] shrink-0" />
              <span className="truncate">Uploads</span>
            </div>
            <span className="text-[9px] font-semibold bg-[#10b981]/15 text-[#10b981] px-1.5 py-0.5 rounded shrink-0">
              NEW
            </span>
          </button>
        </div>

        {/* All channels section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="text-left mb-6">
            <span className="text-xs font-semibold text-[var(--text-3)]">All channels</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="text-2xl text-[#ec4899] font-bold mb-2">#</div>
            <p className="text-xs text-[var(--text-3)] mb-4 leading-relaxed max-w-[150px]">
              Create channels to organize your conversations
            </p>
            <button
              onClick={() => toast("Channels feature coming soon!", { icon: "✨" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--bg-card)] text-xs text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors shadow-xs"
            >
              <Plus size={13} />
              <span>Channel</span>
            </button>
          </div>
          <div />
        </div>
      </div>

      {/* ── Column 2: Center Meetings List ── */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Top Header Row matching screenshot */}
        <div className="h-[52px] border-b border-[var(--border)] px-6 flex items-center justify-between gap-4 shrink-0 bg-[var(--bg)]">
          <span className="text-base font-semibold text-[var(--text-1)] shrink-0">Meetings</span>

          {/* Centralized search input */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-sub)] focus-within:border-[#6c47ff]/60 transition-colors">
              <Search size={13} className="text-[var(--text-4)] shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or keyword"
                className="flex-1 bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none min-w-0"
              />
              <span className="text-[10px] text-[var(--text-4)] bg-[var(--bg-elevated)] border border-[var(--border)] px-1.5 py-0.5 rounded font-mono shrink-0 select-none">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right actions: 2 Free meetings, Upgrade, Bell, Capture */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#22c55e]/15 text-[#16a34a] text-xs font-semibold">
              <span className="w-4 h-4 rounded-full bg-[#22c55e] text-white text-[9px] flex items-center justify-center font-bold">2</span>
              <span>Free meetings</span>
            </div>

            <Link
              href="/upgrade"
              className="hidden sm:flex items-center px-3 py-1 rounded-md border border-[#22c55e]/40 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 text-[#16a34a] text-xs font-semibold transition-colors"
            >
              Upgrade
            </Link>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                title="Notifications"
                className="relative p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>

            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Video size={13} />
              <span>Capture</span>
            </button>
          </div>
        </div>

        {/* Subheader Filters Bar */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex items-center justify-between gap-3 shrink-0 bg-[var(--bg)]">
          <div className="flex items-center gap-2">
            {/* Hosted by me button: toggles between 'hosted' and 'all' */}
            <button
              onClick={handleToggleHosted}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                ownerFilter === "hosted"
                  ? "border-[#6c47ff] bg-[#6c47ff]/15 text-[#6c47ff] font-medium"
                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
              }`}
            >
              Hosted by me
            </button>

            {/* Shared with me button: toggles between 'shared' and 'all' */}
            <button
              onClick={handleToggleShared}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                ownerFilter === "shared"
                  ? "border-[#6c47ff] bg-[#6c47ff]/15 text-[#6c47ff] font-medium"
                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
              }`}
            >
              Shared with me
            </button>

            {/* Filters toggle button */}
            <button
              onClick={() => setShowFiltersBar((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                showFiltersBar
                  ? "border-[#6c47ff] bg-[#6c47ff]/15 text-[#6c47ff] font-medium"
                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)]"
              }`}
            >
              <SlidersHorizontal size={12} />
              <span>Filters</span>
            </button>
          </div>

          <button
            onClick={() => setShowSearchInput((v) => !v)}
            className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--border-strong)] transition-colors"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Optional expanded filter options */}
        {showFiltersBar && (
          <div className="px-6 py-2.5 border-b border-[var(--border)] bg-[var(--bg-sub)] flex items-center gap-4 text-xs">
            <span className="text-[var(--text-3)]">Sort:</span>
            <button
              onClick={() => setSortOrder("date_desc")}
              className={`font-medium ${sortOrder === "date_desc" ? "text-[#6c47ff]" : "text-[var(--text-3)] hover:text-[var(--text-1)]"}`}
            >
              Newest first
            </button>
            <button
              onClick={() => setSortOrder("date_asc")}
              className={`font-medium ${sortOrder === "date_asc" ? "text-[#6c47ff]" : "text-[var(--text-3)] hover:text-[var(--text-1)]"}`}
            >
              Oldest first
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[var(--text-4)]">{meetings.length} results</span>
            </div>
          </div>
        )}

        {/* Main Meetings Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] animate-pulse" />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[var(--text-3)] mb-4">No meetings found</p>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors"
              >
                <Plus size={14} />
                <span>New Meeting</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMeetings).map(([groupDate, groupList], idx) => (
                <div key={groupDate} className="space-y-3">
                  {/* Date group header */}
                  <div className="flex items-center justify-between text-xs text-[var(--text-3)] select-none">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-1)]">
                      <input type="checkbox" className="rounded border-[var(--border)] text-[#6c47ff] focus:ring-0" />
                      <span className="font-medium text-[var(--text-2)]">{groupDate}</span>
                    </label>

                    {idx === 0 && (
                      <button
                        onClick={() => toast("Feedback submitted, thank you!", { icon: "💬" })}
                        className="flex items-center gap-1 hover:text-[var(--text-1)] transition-colors text-[var(--text-4)]"
                      >
                        <MessageSquare size={13} />
                        <span>Feedback</span>
                      </button>
                    )}
                  </div>

                  {/* Meeting Cards List */}
                  <div className="space-y-2.5">
                    {groupList.map((m) => (
                      <div
                        key={m.id}
                        className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[#6c47ff]/40 p-4 transition-all duration-150 flex items-center justify-between shadow-xs hover:shadow-sm"
                      >
                        <Link href={`/meetings/${m.id}`} className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Left Avatar Thumbnail */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-black/10 shadow-xs relative bg-[var(--bg-elevated)]">
                            <Image
                              src={getAvatarImage(m.participants[0]?.name || m.title || m.id)}
                              alt={m.participants[0]?.name || m.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>

                          {/* Meeting Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-[var(--text-1)] group-hover:text-[#6c47ff] transition-colors truncate">
                                {m.title}
                              </span>
                              <ChevronRight size={14} className="text-[var(--text-4)] group-hover:text-[#6c47ff] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                            <p className="text-xs text-[var(--text-3)] mt-0.5">
                              {formatShortDate(m.date)} · {formatTime(m.date)} · {Math.max(1, Math.round(m.duration / 60))} min · {m.participants[0]?.name || user.firstName || "Devansh"}
                            </p>
                          </div>
                        </Link>

                        {/* Action buttons on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/meetings/${m.id}`);
                              toast.success("Meeting link copied!");
                            }}
                            className="p-1.5 rounded-lg text-[var(--text-4)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
                            title="Share meeting link"
                          >
                            <Share2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(m.id)}
                            className="p-1.5 rounded-lg text-[var(--text-4)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete meeting"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p className="text-xs text-[var(--text-4)] text-center py-8 select-none">
                You&apos;ve reached the end of your meetings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Column 3: Right AskFred Side Panel ── */}
      <div className="w-[340px] xl:w-[360px] shrink-0 border-l border-[var(--border)] flex flex-col bg-[var(--bg)] overflow-hidden">
        {/* AskFred Header */}
        <div className="h-[52px] border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#6c47ff]/15 flex items-center justify-center shrink-0">
              <span className="text-[#6c47ff] text-[11px] font-bold">🤖</span>
            </div>
            <span className="text-sm font-semibold text-[#6c47ff]">Ask Fred</span>
          </div>

          <div className="flex items-center gap-2 text-[var(--text-4)]">
            <button
              onClick={() => toast("Starting new AskFred session", { icon: "💬" })}
              className="p-1 hover:text-[var(--text-2)] transition-colors"
            >
              <MessageSquare size={15} />
            </button>
            <button
              onClick={() => setChatInput("")}
              className="p-1 hover:text-[var(--text-2)] transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* AskFred Body Area */}
        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
          <div>
            {/* Slack + Gmail Connect Promo Card */}
            {showConnectBanner && (
              <div className="bg-gradient-to-r from-[#6c47ff]/[0.06] via-[#8b5cf6]/[0.04] to-transparent dark:from-zinc-900 dark:to-zinc-900 border border-[var(--border)] rounded-xl p-3 mb-6 relative shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center -space-x-1 shrink-0 p-1 bg-white dark:bg-zinc-800 rounded-lg border border-[var(--border)] shadow-xs">
                    <Image src="/assets/logos/slack.svg" alt="Slack" width={13} height={13} className="object-contain" />
                    <Image src="/assets/logos/gmail.svg" alt="Gmail" width={13} height={13} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs text-[var(--text-2)] leading-snug">
                      Connect Slack and Gmail — get answers with full context.
                    </p>
                  </div>
                  <Link
                    href="/integrations"
                    className="text-xs font-semibold text-[#6c47ff] hover:underline shrink-0"
                  >
                    Connect
                  </Link>
                  <button
                    onClick={() => setShowConnectBanner(false)}
                    className="text-[var(--text-4)] hover:text-[var(--text-2)] shrink-0 ml-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Sparkles Greeting Section */}
            <div className="mb-6">
              <div className="mb-2">
                <Sparkles size={20} className="text-[#10b981]" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-1)] mb-0.5">
                Hi {user.firstName || "Devansh"}!
              </h3>
              <p className="text-xs text-[var(--text-3)] mb-4">Get ready for your meeting</p>

              {/* Action Chips */}
              <div className="space-y-2">
                <button
                  onClick={() => setChatInput("Show me my action items across recent meetings")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#6c47ff]/40 text-xs text-[var(--text-1)] transition-colors text-left shadow-xs"
                >
                  <span className="text-[#10b981] font-bold text-xs">✓</span>
                  <span className="font-medium">My action items</span>
                </button>
                <button
                  onClick={() => setChatInput("What were the key decisions made in recent meetings?")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#6c47ff]/40 text-xs text-[var(--text-1)] transition-colors text-left shadow-xs"
                >
                  <span>🎯</span>
                  <span className="font-medium">Key decisions</span>
                </button>
                <button
                  onClick={() => setChatInput("Summarize key initiatives discussed across meetings")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[#6c47ff]/40 text-xs text-[var(--text-1)] transition-colors text-left shadow-xs"
                >
                  <span>📌</span>
                  <span className="font-medium">Key initiatives</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Chat Input Box */}
          <div className="pt-3">
            <div className="border border-[var(--border)] bg-[var(--bg-card)] rounded-xl p-3 shadow-xs focus-within:border-[#6c47ff]/60 transition-colors">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-sub)] border border-[var(--border)] text-[10px] text-[var(--text-3)] font-medium mb-2">
                <span>#</span>
                <span>My Meetings</span>
              </div>
              <textarea
                rows={2}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything. Type / to run AI skills."
                className="w-full bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim()) {
                      toast.success("AskFred: Thinking...");
                      setChatInput("");
                    }
                  }
                }}
              />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[var(--text-4)]">
                  <button
                    onClick={() => toast("Attachments coming soon", { icon: "📎" })}
                    className="hover:text-[var(--text-2)] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => toast("Prompt templates enabled", { icon: "📚" })}
                    className="hover:text-[var(--text-2)] transition-colors"
                  >
                    <Layers size={13} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast("Voice input ready", { icon: "🎙️" })}
                    className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
                  >
                    <Mic size={14} />
                  </button>
                  <button
                    disabled={!chatInput.trim()}
                    onClick={() => {
                      if (chatInput.trim()) {
                        toast.success("AskFred: Thinking...");
                        setChatInput("");
                      }
                    }}
                    className="w-6 h-6 rounded-md bg-[#6c47ff]/20 text-[#6c47ff] hover:bg-[#6c47ff] hover:text-white disabled:opacity-40 flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateMeetingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete meeting?"
        message="This will permanently delete the meeting, transcript, summary, and all action items. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[var(--text-3)]">Loading meetings...</div>}>
      <MeetingsContent />
    </Suspense>
  );
}
