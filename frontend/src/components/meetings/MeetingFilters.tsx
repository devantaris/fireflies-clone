"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import type { MeetingFilters } from "@/lib/types";

interface Props {
  filters: MeetingFilters;
  onChange: (f: Partial<MeetingFilters>) => void;
  onClear: () => void;
}

export function MeetingFiltersBar({ filters, onChange, onClear }: Props) {
  const hasActiveFilters =
    filters.search || filters.date_from || filters.date_to || filters.participant;

  return (
    <div className="flex flex-col gap-3">
      {/* Main filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search meetings…"
            className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg pl-9 pr-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#f0f0f0]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Participant */}
        <input
          type="text"
          value={filters.participant}
          onChange={(e) => onChange({ participant: e.target.value })}
          placeholder="Filter by participant…"
          className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6c47ff] transition-colors w-44"
        />

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => onChange({ date_from: e.target.value })}
            className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors [color-scheme:dark] w-36"
          />
          <span className="text-[#555] text-xs">to</span>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => onChange({ date_to: e.target.value })}
            className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6c47ff] transition-colors [color-scheme:dark] w-36"
          />
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as MeetingFilters["sort"] })}
          className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm text-[#c0c0c0] focus:outline-none focus:border-[#6c47ff] transition-colors cursor-pointer"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-[#8a8a8a] hover:text-[#f0f0f0] transition-colors px-2 py-2"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
