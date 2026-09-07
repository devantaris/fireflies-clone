"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic2,
  Settings,
  Flame,
  Home,
  Bot,
  Video,
  ListTodo,
  Sparkles,
  BarChart2,
  Puzzle,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  onNavClick?: () => void;
}

const PRIMARY_NAV = [
  { label: "Home", href: "/home", icon: Home },
  { label: "AskFred", href: "/askfred", icon: Bot },
];

const PRODUCT_NAV = [
  { label: "Meetings", href: "/meetings", icon: Video },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "AI Skills", href: "/ai-skills", icon: Sparkles },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Integrations", href: "/integrations", icon: Puzzle },
];

function UserAvatar() {
  return (
    <div className="px-3 pb-4 pt-2 border-t border-[var(--border)]">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "#6c47ff" }}
        >
          D
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text-1)] truncate">My Workspace</p>
          <p className="text-xs text-[var(--text-2)] truncate">user@company.com</p>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onNavClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onNavClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-[#6c47ff]/15 text-[var(--accent-text)] font-medium"
          : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

export function Sidebar({ onNavClick }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/home") return pathname === "/home";
    if (href === "/meetings") return pathname.startsWith("/meetings");
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-[var(--bg-sub)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="w-7 h-7 rounded-lg bg-[#6c47ff] flex items-center justify-center">
          <Flame size={15} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-[var(--text-1)] tracking-tight">
          fireflies
        </span>
        <span className="ml-1 text-[10px] font-medium bg-[#6c47ff]/20 text-[var(--accent-text)] px-1.5 py-0.5 rounded">
          beta
        </span>
      </div>

      {/* New Meeting shortcut */}
      <div className="px-3 mb-3">
        <Link
          href="/meetings/new"
          onClick={onNavClick}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c5aff] text-white text-sm font-medium transition-colors"
        >
          <Mic2 size={14} />
          New Meeting
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-0.5">
          {PRIMARY_NAV.map(({ label, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              isActive={isActive(href)}
              onNavClick={onNavClick}
            />
          ))}
        </div>

        <div className="my-3 border-t border-[var(--border)]" />

        <div className="space-y-0.5">
          {PRODUCT_NAV.map(({ label, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              isActive={isActive(href)}
              onNavClick={onNavClick}
            />
          ))}
        </div>
      </nav>

      {/* Theme toggle */}
      <div className="px-3 pb-1">
        <ThemeToggle />
      </div>

      {/* Settings at bottom */}
      <div className="px-3 pb-1">
        <NavLink
          href="/settings"
          label="Settings"
          icon={Settings}
          isActive={pathname === "/settings"}
          onNavClick={onNavClick}
        />
      </div>

      <UserAvatar />
    </aside>
  );
}
