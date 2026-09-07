"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Home,
  Bot,
  Video,
  ListTodo,
  Sparkles,
  BarChart2,
  Puzzle,
  ChevronDown,
  X,
  Mail,
  Mic,
  Users,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  onNavClick?: () => void;
}

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onNavClick,
  badge,
  highlight,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  onNavClick?: () => void;
  badge?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-[#6c47ff]/15 text-[var(--accent-text)] font-medium"
          : highlight
          ? "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)]"
          : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)]"
      }`}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {badge}
    </Link>
  );
}

export function Sidebar({ onNavClick }: Props) {
  const pathname = usePathname();
  const [showInviteCard, setShowInviteCard] = useState(true);

  function isActive(href: string) {
    if (href === "/home") return pathname === "/home";
    if (href === "/meetings") return pathname.startsWith("/meetings");
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-[var(--bg-sub)] border-r border-[var(--border)]">
      {/* User identity at top */}
      <div className="px-3 pt-4 pb-3 border-b border-[var(--border)]">
        <button className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "#6c47ff" }}
          >
            D
          </div>
          <span className="text-sm font-medium text-[var(--text-1)] truncate flex-1 text-left">Devansh</span>
          <ChevronDown size={13} className="text-[var(--text-3)] shrink-0" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        <NavLink href="/home" label="Home" icon={Home} isActive={isActive("/home")} onNavClick={onNavClick} />
        <NavLink href="/askfred" label="AskFred" icon={Bot} isActive={isActive("/askfred")} onNavClick={onNavClick} />
        <NavLink href="/meetings" label="Meetings" icon={Video} isActive={isActive("/meetings")} onNavClick={onNavClick} />
        <NavLink href="/tasks" label="Tasks" icon={ListTodo} isActive={isActive("/tasks")} onNavClick={onNavClick} />
        <NavLink href="/ai-skills" label="AI Skills" icon={Sparkles} isActive={isActive("/ai-skills")} onNavClick={onNavClick} />
        <NavLink href="/analytics" label="Analytics" icon={BarChart2} isActive={isActive("/analytics")} onNavClick={onNavClick} />

        <NavLink href="/voice-agents" label="Voice Agents" icon={Mic} isActive={isActive("/voice-agents")} onNavClick={onNavClick} />

        {/* Upgrade with badge */}
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <TrendingUp size={16} />
          <span className="flex-1">Upgrade</span>
          <span className="text-[10px] font-semibold bg-[#22c55e]/15 text-[#16a34a] px-1.5 py-0.5 rounded">
            40% OFF
          </span>
        </Link>
      </nav>

      {/* Try Email Assistant promo */}
      <div className="px-3 pb-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <div className="w-5 h-5 rounded bg-[#ea4335]/15 flex items-center justify-center shrink-0">
            <Mail size={11} className="text-[#ea4335]" />
          </div>
          <span className="flex-1 text-sm">Try Email Assistant</span>
        </Link>
      </div>

      {/* Bottom: Integrations + Settings */}
      <div className="px-3 pb-1 space-y-0.5">
        <NavLink href="/integrations" label="Integrations" icon={Puzzle} isActive={isActive("/integrations")} onNavClick={onNavClick} />
        <NavLink href="/settings" label="Settings" icon={Settings} isActive={isActive("/settings")} onNavClick={onNavClick} />
      </div>

      {/* Theme toggle */}
      <div className="px-3 pb-2">
        <ThemeToggle />
      </div>

      {/* Invite coworkers card */}
      {showInviteCard && (
        <div className="mx-3 mb-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] relative">
          <button
            onClick={() => setShowInviteCard(false)}
            className="absolute top-2 right-2 text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <Users size={14} className="text-[var(--text-3)]" />
            <p className="text-xs font-medium text-[var(--text-1)]">Invite coworkers to your Fireflies team</p>
          </div>
          <button className="w-full py-1.5 rounded-lg bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-medium transition-colors">
            Create Team
          </button>
        </div>
      )}
    </aside>
  );
}
