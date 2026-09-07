"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic2,
  Search,
  Settings,
  BookOpen,
  Flame,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Meetings", href: "/meetings", icon: BookOpen },
  { label: "Search", href: "/meetings?focus=search", icon: Search },
];

const AVATAR_COLORS = [
  "#6c47ff", "#0891b2", "#059669", "#d97706",
];

function UserAvatar() {
  return (
    <div className="px-3 pb-4 pt-2 border-t border-[#242424]">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#242424] cursor-pointer transition-colors">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "#6c47ff" }}
        >
          U
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#f0f0f0] truncate">My Workspace</p>
          <p className="text-xs text-[#8a8a8a] truncate">user@company.com</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-[#111111] border-r border-[#1e1e1e]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-7 h-7 rounded-lg bg-[#6c47ff] flex items-center justify-center">
          <Flame size={15} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-[#f0f0f0] tracking-tight">
          fireflies
        </span>
        <span className="ml-1 text-[10px] font-medium bg-[#6c47ff]/20 text-[#9b7cff] px-1.5 py-0.5 rounded">
          beta
        </span>
      </div>

      {/* New Meeting shortcut */}
      <div className="px-3 mb-3">
        <Link
          href="/meetings/new"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
        >
          <Mic2 size={14} />
          New Meeting
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const base = href.split("?")[0];
          const isActive =
            pathname === base ||
            (base === "/meetings" && pathname.startsWith("/meetings"));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#6c47ff]/15 text-[#9b7cff] font-medium"
                  : "text-[#8a8a8a] hover:text-[#f0f0f0] hover:bg-[#1e1e1e]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[#444]">
            Workspace
          </p>
        </div>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-[#6c47ff]/15 text-[#9b7cff] font-medium"
              : "text-[#8a8a8a] hover:text-[#f0f0f0] hover:bg-[#1e1e1e]"
          }`}
        >
          <Settings size={16} />
          Settings
        </Link>
      </nav>

      {/* User */}
      <UserAvatar />
    </aside>
  );
}
