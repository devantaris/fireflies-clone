"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Mic2, RefreshCw, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { getMeetings, deleteMeeting } from "@/lib/api";
import type { MeetingListItem, MeetingDetail, MeetingFilters } from "@/lib/types";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { MeetingFiltersBar } from "@/components/meetings/MeetingFilters";
import { CreateMeetingModal } from "@/components/meetings/CreateMeetingModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const DEFAULT_FILTERS: MeetingFilters = {
  search: "",
  date_from: "",
  date_to: "",
  participant: "",
  sort: "date_desc",
};

function MeetingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-[72px] bg-[var(--bg-elevated)]" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[var(--border)] rounded w-3/4" />
            <div className="h-3 bg-[var(--bg-elevated)] rounded w-1/2" />
            <div className="flex gap-1.5 mt-4">
              {[1, 2].map((j) => (
                <div key={j} className="w-6 h-6 rounded-full bg-[var(--border)]" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filtered, onNew }: { filtered: boolean; onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-4">
        <Mic2 size={28} className="text-[var(--text-4)]" />
      </div>
      {filtered ? (
        <>
          <h3 className="text-base font-medium text-[var(--text-1)] mb-1">
            No meetings match your filters
          </h3>
          <p className="text-sm text-[var(--text-3)] max-w-xs">
            Try adjusting your search or date range.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-[var(--text-1)] mb-1">No meetings yet</h3>
          <p className="text-sm text-[var(--text-3)] mb-5 max-w-xs">
            Create your first meeting to get started.
          </p>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            New Meeting
          </button>
        </>
      )}
    </div>
  );
}

function FetchErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-[#ef4444]" />
      </div>
      <h3 className="text-base font-medium text-[var(--text-1)] mb-1">
        Failed to load meetings
      </h3>
      <p className="text-sm text-[var(--text-3)] mb-5 max-w-xs">
        Check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--border)] text-sm text-[var(--text-2)] transition-colors border border-[var(--border-strong)]"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

// Inner component — safe to use useSearchParams inside Suspense
function MeetingsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const focusParam = searchParams.get("focus");

  const [ownerTab, setOwnerTab] = useState<"hosted" | "shared">("hosted");
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [filters, setFilters] = useState<MeetingFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") ?? "",
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Auto-focus search when ?focus=search is in the URL
  useEffect(() => {
    if (focusParam === "search") {
      const t = setTimeout(() => searchInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [focusParam]);

  const fetchMeetings = useCallback(async (f: MeetingFilters, tab: "hosted" | "shared") => {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await getMeetings({
        search: f.search || undefined,
        date_from: f.date_from || undefined,
        date_to: f.date_to || undefined,
        participant: f.participant || undefined,
        sort: f.sort,
        hosted: tab === "hosted",
      });
      setMeetings(data);
    } catch {
      setFetchError(true);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings(filters, ownerTab);
  }, [filters, ownerTab, fetchMeetings]);

  function updateFilters(partial: Partial<MeetingFilters>) {
    setFilters((f) => ({ ...f, ...partial }));
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMeeting(deleteId);
      setMeetings((m) => m.filter((x) => x.id !== deleteId));
      toast.success("Meeting deleted");
    } catch {
      toast.error("Failed to delete meeting");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function handleCreated(meeting: MeetingDetail) {
    router.push(`/meetings/${meeting.id}`);
  }

  const hasActiveFilters =
    filters.search || filters.date_from || filters.date_to || filters.participant;

  const displayMeetings = meetings;

  return (
    <div className="min-h-full flex flex-col">
      {/* Top header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-1)]">Meetings</h1>
            {!loading && !fetchError && (
              <p className="text-xs text-[var(--text-3)] mt-0.5">
                {displayMeetings.length} meeting{displayMeetings.length !== 1 ? "s" : ""}
                {hasActiveFilters ? " (filtered)" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Hosted by me / Shared with me tabs */}
            <div className="hidden sm:flex items-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-0.5 text-xs font-medium">
              <button
                onClick={() => setOwnerTab("hosted")}
                className={`px-3 py-1 rounded-md transition-colors ${ownerTab === "hosted" ? "bg-[#6c47ff] text-white" : "text-[var(--text-3)] hover:text-[var(--text-2)]"}`}
              >
                Hosted by me
              </button>
              <button
                onClick={() => setOwnerTab("shared")}
                className={`px-3 py-1 rounded-md transition-colors ${ownerTab === "shared" ? "bg-[#6c47ff] text-white" : "text-[var(--text-3)] hover:text-[var(--text-2)]"}`}
              >
                Shared with me
              </button>
            </div>
            <button
              onClick={() => fetchMeetings(filters, ownerTab)}
              className="p-2 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Meeting</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        <MeetingFiltersBar
          filters={filters}
          onChange={updateFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          searchInputRef={searchInputRef}
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {loading ? (
          <MeetingsSkeleton />
        ) : fetchError ? (
          <FetchErrorState onRetry={() => fetchMeetings(filters, ownerTab)} />
        ) : displayMeetings.length === 0 ? (
          <EmptyState
            filtered={!!hasActiveFilters || ownerTab === "shared"}
            onNew={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayMeetings.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>

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

// Page export wraps in Suspense to satisfy Next.js useSearchParams requirement
export default function MeetingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex flex-col">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <div className="h-7 w-28 bg-[var(--border)] rounded animate-pulse" />
          </div>
          <div className="flex-1 px-6 py-6">
            <MeetingsSkeleton />
          </div>
        </div>
      }
    >
      <MeetingsList />
    </Suspense>
  );
}
