"use client";

import { Search, X, ChevronDown } from "lucide-react";
import type { MeetingFilters } from "@/lib/types";

interface Props {
  filters: MeetingFilters;
  onChange: (f: Partial<MeetingFilters>) => void;
  onClear: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const INPUT_CLS =
  "bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-1)] placeholder-[var(--text-4)] focus:outline-none focus:border-[#6c47ff] transition-colors";

export function MeetingFiltersBar({ filters, onChange, onClear, searchInputRef }: Props) {
  const hasActiveFilters =
    filters.search || filters.date_from || filters.date_to || filters.participant;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none"
        />
        <input
          ref={searchInputRef}
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search meetings…"
          className={`${INPUT_CLS} w-full pl-8 pr-8 py-1.5`}
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Participant */}
      <input
        type="text"
        value={filters.participant}
        onChange={(e) => onChange({ participant: e.target.value })}
        placeholder="Participant…"
        className={`${INPUT_CLS} px-3 py-1.5 w-36`}
      />

      {/* Date from */}
      <input
        type="date"
        value={filters.date_from}
        onChange={(e) => onChange({ date_from: e.target.value })}
        className={`${INPUT_CLS} px-3 py-1.5 w-32 [color-scheme:dark]`}
        title="From date"
      />

      <span className="text-[var(--text-4)] text-xs shrink-0">–</span>

      {/* Date to */}
      <input
        type="date"
        value={filters.date_to}
        onChange={(e) => onChange({ date_to: e.target.value })}
        className={`${INPUT_CLS} px-3 py-1.5 w-32 [color-scheme:dark]`}
        title="To date"
      />

      {/* Sort */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as MeetingFilters["sort"] })}
          className={`${INPUT_CLS} pl-3 pr-7 py-1.5 cursor-pointer appearance-none`}
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-4)] pointer-events-none"
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)]"
        >
          <X size={11} />
          Clear
        </button>
      )}
    </div>
  );
}
