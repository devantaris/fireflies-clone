"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Mic2, RefreshCw } from "lucide-react";
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
          className="bg-[#1a1a1a] border border-[#252525] rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-[72px] bg-[#242424]" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
            <div className="h-3 bg-[#242424] rounded w-1/2" />
            <div className="flex gap-1.5 mt-4">
              {[1, 2].map((j) => (
                <div key={j} className="w-6 h-6 rounded-full bg-[#2a2a2a]" />
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
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2e2e2e] flex items-center justify-center mb-4">
        <Mic2 size={28} className="text-[#444]" />
      </div>
      {filtered ? (
        <>
          <h3 className="text-base font-medium text-[#f0f0f0] mb-1">
            No meetings match your filters
          </h3>
          <p className="text-sm text-[#666] max-w-xs">
            Try adjusting your search or date range.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-medium text-[#f0f0f0] mb-1">
            No meetings yet
          </h3>
          <p className="text-sm text-[#666] mb-5 max-w-xs">
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

// Inner component — safe to use useSearchParams inside Suspense
function MeetingsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MeetingFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") ?? "",
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMeetings = useCallback(async (f: MeetingFilters) => {
    setLoading(true);
    try {
      const data = await getMeetings({
        search: f.search || undefined,
        date_from: f.date_from || undefined,
        date_to: f.date_to || undefined,
        participant: f.participant || undefined,
        sort: f.sort,
      });
      setMeetings(data);
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings(filters);
  }, [filters, fetchMeetings]);

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

  return (
    <div className="min-h-full flex flex-col">
      {/* Top header */}
      <div className="sticky top-0 z-10 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#1e1e1e] px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-[#f0f0f0]">Meetings</h1>
            {!loading && (
              <p className="text-xs text-[#666] mt-0.5">
                {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}
                {hasActiveFilters ? " (filtered)" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMeetings(filters)}
              className="p-2 rounded-lg text-[#666] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
            >
              <Plus size={15} />
              New Meeting
            </button>
          </div>
        </div>

        <MeetingFiltersBar
          filters={filters}
          onChange={updateFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {loading ? (
          <MeetingsSkeleton />
        ) : meetings.length === 0 ? (
          <EmptyState
            filtered={!!hasActiveFilters}
            onNew={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {meetings.map((m) => (
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
          <div className="border-b border-[#1e1e1e] px-6 py-4">
            <div className="h-7 w-28 bg-[#1e1e1e] rounded animate-pulse" />
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
