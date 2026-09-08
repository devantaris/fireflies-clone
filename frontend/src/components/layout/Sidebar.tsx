"use client";

import Link from "next/link";
import Image from "next/image";
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
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useUser, clearName } from "@/lib/currentUser";

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
  const user = useUser();
  const [showInviteCard, setShowInviteCard] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  function isActive(href: string) {
    if (href === "/home") return pathname === "/home";
    if (href === "/meetings") return pathname.startsWith("/meetings");
    return pathname === href || pathname.startsWith(href + "/");
  }

  if (pathname === "/meetings") {
    return (
      <aside className="w-14 shrink-0 flex flex-col h-full bg-[var(--bg-sub)] border-r border-[var(--border)] items-center py-3 justify-between select-none">
        {/* Top: User Avatar */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              title={user.name}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs hover:ring-2 hover:ring-[#6c47ff]/40 transition-all overflow-hidden"
              style={{ background: user.color }}
            >
              {user.initials}
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute left-10 top-0 z-50 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-sm font-medium text-[var(--text-1)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">Free Plan</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileOpen(false); onNavClick?.(); window.location.href = "/settings"; }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] transition-colors text-left"
                    >
                      <Settings size={14} />
                      Settings
                    </button>
                    <button
                      onClick={() => { clearName(); window.location.reload(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] transition-colors text-left"
                    >
                      <LogOut size={14} />
                      Switch User
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Nav Icons Stack */}
          <nav className="flex flex-col items-center gap-1 w-full px-2">
            <Link
              href="/home"
              title="Home"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Home size={18} />
            </Link>
            <Link
              href="/askfred"
              title="AskFred"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Bot size={18} />
            </Link>
            <Link
              href="/meetings"
              title="Meetings"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#6c47ff]/15 text-[#6c47ff] transition-colors"
            >
              <Video size={18} />
            </Link>
            <Link
              href="/tasks"
              title="Tasks"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <ListTodo size={18} />
            </Link>
            <Link
              href="/ai-skills"
              title="AI Skills"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Sparkles size={18} />
            </Link>
            <Link
              href="/analytics"
              title="Analytics"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <BarChart2 size={18} />
            </Link>
            <Link
              href="/voice-agents"
              title="Voice Agents"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Mic size={18} />
            </Link>
            <Link
              href="/integrations"
              title="Integrations"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Zap size={18} />
            </Link>
          </nav>
        </div>

        {/* Bottom Icons: Invite & Settings */}
        <div className="flex flex-col items-center gap-1.5 w-full px-2">
          <button
            title="Invite coworkers"
            onClick={() => setShowInviteCard(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Users size={17} />
          </button>
          <Link
            href="/settings"
            title="Settings"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Settings size={17} />
          </Link>
          <div className="pt-1">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-[var(--bg-sub)] border-r border-[var(--border)]">
      {/* User identity at top */}
      <div className="px-3 pt-4 pb-3 border-b border-[var(--border)] relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: user.color }}
          >
            {user.initials}
          </div>
          <span className="text-sm font-medium text-[var(--text-1)] truncate flex-1 text-left">{user.firstName}</span>
          <ChevronDown size={13} className={`text-[var(--text-3)] shrink-0 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--text-1)]">{user.name}</p>
                <p className="text-xs text-[var(--text-3)] mt-0.5">Free Plan</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setProfileOpen(false); onNavClick?.(); window.location.href = "/settings"; }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] transition-colors text-left"
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button
                  onClick={() => { clearName(); window.location.reload(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-2)] hover:bg-[var(--bg-hover)] transition-colors text-left"
                >
                  <LogOut size={14} />
                  Switch User
                </button>
              </div>
            </div>
          </>
        )}
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
          href="/upgrade"
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
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <div className="w-5 h-5 rounded bg-white dark:bg-zinc-800 shadow-xs border border-[var(--border)] flex items-center justify-center shrink-0 p-0.5 group-hover:scale-105 transition-transform">
            <Image src="/assets/logos/gmail.svg" alt="Gmail" width={13} height={13} className="object-contain" />
          </div>
          <span className="flex-1 text-sm font-medium">Try Email Assistant</span>
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
