"use client";

import { useState } from "react";
import {
  Video,
  Bell,
  Mail,
  Brain,
  Zap,
  BookOpen,
  Code2,
  Cookie,
  User,
  Shield,
} from "lucide-react";

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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
        checked ? "bg-[#6c47ff]" : "bg-[var(--border-strong)]"
      }`}
      style={{ height: "22px" }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("recording");
  const [activeTab, setActiveTab] = useState<"personal" | "team">("personal");
  const [autoRecord, setAutoRecord] = useState(true);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);

  return (
    <div className="min-h-full flex bg-[var(--bg)]">
      {/* Settings sidebar */}
      <aside className="w-[220px] shrink-0 border-r border-[var(--border)] flex flex-col">
        {/* User info */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#6c47ff] flex items-center justify-center text-white text-sm font-bold shrink-0">
              D
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-1)] truncate">
                user@company.com
              </p>
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
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-3)] hover:text-[var(--text-2)]">
            <User size={15} />
            Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-3)] hover:text-[var(--text-2)]">
            <Shield size={15} />
            Security overview
          </button>
        </div>
      </aside>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "recording" ? (
          <div className="max-w-2xl px-8 py-6">
            <h2 className="text-lg font-semibold text-[var(--text-1)] mb-6">
              Recording
            </h2>

            {/* Auto-record */}
            <div className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)] mb-8">
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={15} className="text-[#6c47ff]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)]">
                      Auto-record meetings
                    </h3>
                    <Toggle
                      checked={autoRecord}
                      onChange={() => setAutoRecord(!autoRecord)}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">
                    Fireflies notetaker will join and record your calendar
                    events.
                  </p>
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

              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Video size={15} className="text-[var(--text-3)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)]">
                      Capture meeting video
                    </h3>
                    <Toggle
                      checked={captureVideo}
                      onChange={() => setCaptureVideo(!captureVideo)}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">
                    Capture your meeting screen and shared content as video.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[var(--text-3)] text-xs font-bold">T</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--text-1)] mb-1">
                    Meeting language
                  </h3>
                  <p className="text-xs text-[var(--text-3)] mb-3">
                    For transcripts and summaries.
                  </p>
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

            <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">
              Privacy &amp; Access
            </h2>
            <div className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
              <div className="flex items-start gap-4 p-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={15} className="text-[var(--text-3)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-[var(--text-1)]">
                      Auto-delete meetings
                    </h3>
                    <Toggle
                      checked={autoDelete}
                      onChange={() => setAutoDelete(!autoDelete)}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">
                    Automatically delete meetings after a set retention period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="text-center">
              {(() => {
                const sec = SETTINGS_SECTIONS.find(
                  (s) => s.id === activeSection
                );
                const Icon = sec?.icon;
                return (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4 mx-auto">
                      {Icon && <Icon size={24} className="text-[var(--text-4)]" />}
                    </div>
                    <h3 className="text-base font-medium text-[var(--text-1)] mb-1">
                      {sec?.label}
                    </h3>
                    <p className="text-sm text-[var(--text-3)]">
                      Settings coming soon.
                    </p>
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
