"use client";

import { useState } from "react";
import { Menu, Flame } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export function LayoutShell({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <>
      {/* ── Desktop sidebar — hidden on mobile ─────────────────────────── */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* ── Content column ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Mobile-only top bar */}
        <header className="flex md:hidden shrink-0 items-center gap-3 px-4 py-3 bg-[#111111] border-b border-[#1e1e1e]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-lg text-[#666] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#6c47ff] flex items-center justify-center">
              <Flame size={10} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-[#f0f0f0] tracking-tight">
              fireflies
            </span>
            <span className="text-[10px] font-medium bg-[#6c47ff]/20 text-[#9b7cff] px-1.5 py-0.5 rounded">
              beta
            </span>
          </div>
        </header>

        {/* Main page content */}
        <main className="flex-1 min-w-0 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Dim overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <div className="relative z-10 flex h-full">
            <Sidebar onNavClick={closeDrawer} />
          </div>
        </div>
      )}
    </>
  );
}
