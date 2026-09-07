"use client";

import { useState } from "react";
import {
  Video, Bell, Mail, Brain, Zap, BookOpen, Code2, Cookie,
  User, Shield, ChevronLeft, Gift, X, Crown,
} from "lucide-react";
import { useUser } from "@/lib/currentUser";

const SETTINGS_SECTIONS = [
  { id: "recording", label: "Recording & Privacy", icon: Video },
  { id: "compliance", label: "Compliance Notification", icon: Bell },
  { id: "email", label: "Email Assistant", icon: Mail },
  { id: "ai", label: "AI Settings", icon: Brain },
  { id: "live", label: "Live Assist", icon: Zap },
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "api", label: "MCP & API", icon: Code2 },
  { id: "cookies", label: "Cookies", icon: Cookie },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#6c47ff]" : "bg-[var(--border-strong)]"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const user = useUser();
  const [activeSection, setActiveSection] = useState("recording");
  const [activeTab, setActiveTab] = useState<"personal" | "team">("personal");
  const [autoRecord, setAutoRecord] = useState(true);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);
  const [showEmailBanner, setShowEmailBanner] = useState(true);

  // Derive a plausible email handle from the user's name
  const emailDisplay = `${user.firstName.toLowerCase()}@fireflies.ai`;

  return (
    <div className="min-h-full flex bg-[var(--bg)]">
      {/* Settings sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-[var(--border)] flex flex-col">
        {/* Back + User info */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <button className="flex items-center gap-1.5 text-xs text-[var(--text-3)] hover:text-[var(--text-2)] mb-3 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: user.color }}
            >
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-1)] truncate">{emailDisplay}</p>
              <p className="text-[10px] text-[var(--text-3)]">Free Plan</p>
            </div>
          </div>

          {/* Personal / Team toggle */}
          <div className="flex rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] p-0.5">
            {(["personal", "team"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                  activeTab === t
                    ? "bg-[#6c47ff] text-white"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                activeSection === id
                  ? "text-[var(--text-1)] bg-[var(--bg-card)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--bg-card)]/50"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-[var(--border)] py-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm bg-[#6c47ff]/[0.08] text-[var(--accent-text)] hover:bg-[var(--accent-bg)]">
            <Gift size={15} />
            Refer and earn $5 each
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-3)] hover:text-[var(--text-2)]">
            <User size={15} />
            Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-3)] hover:text-[var(--text-2)]">
            <Shield size={15} />
            Security overview
            <span className="ml-auto text-[10px] font-medium bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-[var(--text-3)]">2/3</span>
          </button>
        </div>
      </aside>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "recording" ? (
          <div className="max-w-2xl px-8 py-6">
            {/* Email Assistant banner */}
            {showEmailBanner && (
              <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-[#ea4335]/20 bg-[#ea4335]/[0.05]">
                <div className="w-7 h-7 rounded-lg bg-[#ea4335] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold">G</span>
                </div>
                <p className="text-xs text-[var(--text-2)] flex-1 min-w-0">
                  <span className="font-medium">Email Assistant</span>
                  {" — "}Auto-drafts replies and follow-ups, and labels your inbox.{" "}
                  <button className="text-[var(--accent-text)] hover:underline">Try Now →</button>
                </p>
                <button onClick={() => setShowEmailBanner(false)} className="text-[var(--text-4)] hover:text-[var(--text-2)] shrink-0">
                  <X size={13} />
                </button>
              </div>
            )}

            <h2 className="text-base font-semibold text-[var(--text-1)] mb-5">Recording</h2>

            {/* Recording card */}
            <div className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)] mb-8">
              {/* Auto-record */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={15} className="text-[#6c47ff]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)]">Auto-record meetings</h3>
                    <Toggle checked={autoRecord} onChange={() => setAutoRecord(!autoRecord)} />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">Fireflies notetaker will join and record your calendar events.</p>
                  {autoRecord && (
                    <div className="mt-3">
                      <select className="w-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-xs text-[var(--text-2)] outline-none focus:border-[#6c47ff]/50">
                        <option>Record all calendar events with a meeting link</option>
                        <option>Record only events I organize</option>
                        <option>Record all events</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Capture video */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={15} className="text-[var(--text-3)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)] flex items-center gap-1.5">
                      Capture meeting video
                      <Crown size={12} className="text-[var(--accent-text)]" />
                    </h3>
                    <Toggle checked={captureVideo} onChange={() => setCaptureVideo(!captureVideo)} />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">Capture your meeting screen and shared content as video.</p>
                </div>
              </div>

              {/* Meeting language */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--text-3)] text-xs font-bold">T</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--text-1)] mb-1">Meeting language</h3>
                  <p className="text-xs text-[var(--text-3)] mb-3">For transcripts and summaries.</p>
                  <select className="w-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-lg px-3 py-2 text-xs text-[var(--text-2)] outline-none focus:border-[#6c47ff]/50">
                    <option>English (Global)</option>
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>

            <h2 className="text-base font-semibold text-[var(--text-1)] mb-4">Privacy &amp; Access</h2>
            <div className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
              {/* Auto-delete */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={15} className="text-[var(--text-3)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)] flex items-center gap-1.5">
                      Auto-delete meetings
                      <Crown size={12} className="text-[var(--accent-text)]" />
                    </h3>
                    <Toggle checked={autoDelete} onChange={() => setAutoDelete(!autoDelete)} />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">Automatically delete meetings after a set retention period.</p>
                </div>
              </div>

              {/* Meeting privacy */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={15} className="text-[var(--text-3)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--text-1)] mb-1">Meeting privacy</h3>
                  <p className="text-xs text-[var(--text-3)]">Control who can view and access your meeting recordings and transcripts.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="text-center">
              {(() => {
                const sec = SETTINGS_SECTIONS.find((s) => s.id === activeSection);
                const Icon = sec?.icon;
                return (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4 mx-auto">
                      {Icon && <Icon size={24} className="text-[var(--text-4)]" />}
                    </div>
                    <h3 className="text-base font-medium text-[var(--text-1)] mb-1">{sec?.label}</h3>
                    <p className="text-sm text-[var(--text-3)]">Settings coming soon.</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
