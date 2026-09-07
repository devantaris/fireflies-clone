"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserContext, buildProfile, getSavedName, saveName } from "@/lib/currentUser";
import type { UserProfile } from "@/lib/currentUser";

function WelcomeScreen({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm mx-4 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#6c47ff] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--text-1)]">fireflies.ai</span>
        </div>

        <h1 className="text-xl font-semibold text-[var(--text-1)] mb-2">Welcome to Fireflies</h1>
        <p className="text-sm text-[var(--text-3)] mb-8">What should we call you?</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-[var(--bg-sub)] border border-[var(--border-strong)] rounded-xl px-4 py-3 text-sm text-[var(--text-1)] placeholder:text-[var(--text-4)] outline-none focus:border-[#6c47ff]/60 transition-colors text-center"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-[#6c47ff] hover:bg-[#5535ee] disabled:bg-[var(--border-strong)] disabled:text-[var(--text-4)] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:cursor-not-allowed"
          >
            Get Started →
          </button>
        </form>

        <p className="text-xs text-[var(--text-4)] mt-6">No account needed — your name is stored locally.</p>
      </div>
    </div>
  );
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = getSavedName();
    if (saved) {
      setUser(buildProfile(saved));
    } else {
      // Only intercept with welcome screen inside the app, not on the landing page
      if (pathname !== "/") {
        setShowWelcome(true);
      } else {
        // On landing page just use a guest profile — the welcome triggers on /home
        setUser(buildProfile("Guest"));
      }
    }
    setMounted(true);
  }, [pathname]);

  function handleNameSubmit(name: string) {
    saveName(name);
    setUser(buildProfile(name));
    setShowWelcome(false);
  }

  // Don't render anything until mounted (avoids hydration mismatch)
  if (!mounted) return null;

  if (showWelcome) {
    return <WelcomeScreen onSubmit={handleNameSubmit} />;
  }

  if (!user) return null;

  return (
    <UserContext value={user}>
      {children}
    </UserContext>
  );
}
