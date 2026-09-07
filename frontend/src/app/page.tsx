"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, X, ChevronDown, ArrowRight, Play, Mic, Star, Lock, Check } from "lucide-react";

// ── Announcement Bar ──────────────────────────────────────────────────────────

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm" style={{ background: "linear-gradient(90deg, #3b1fa3 0%, #6c47ff 50%, #9c6dff 100%)" }}>
      <span className="text-[10px] font-bold bg-[#22c55e] text-white px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0">NEW</span>
      <p className="text-white/90 text-xs sm:text-sm">
        Meet Email Assistant: Your inbox triaged and replies auto-drafted.{" "}
        <a href="#" className="text-white font-semibold underline underline-offset-2 hover:text-white/80">
          See Now →
        </a>
      </p>
      <button
        onClick={onDismiss}
        className="ml-auto shrink-0 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center gap-4 px-6 md:px-12 py-4 border-b border-white/10 backdrop-blur-md" style={{ background: "rgba(13,13,31,0.85)" }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-6">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#6c47ff" }}>
          <Flame size={14} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">fireflies</span>
      </Link>

      {/* Nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-1 text-sm text-white/70">
        {["Product", "Solutions", "Integration", "Resources"].map((item) => (
          <button key={item} className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
            {item} <ChevronDown size={12} />
          </button>
        ))}
        <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">Enterprise</button>
        <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">Pricing</button>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="hidden sm:flex px-4 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:border-white/60 hover:text-white transition-colors">
          Request Demo
        </button>
        <Link
          href="/home"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-colors"
          style={{ background: "#6c47ff" }}
        >
          Open App <ArrowRight size={13} />
        </Link>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-16 overflow-hidden" style={{ background: "#0d0d1f" }}>
      {/* Starry dot background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.2) 0%, transparent 100%)",
          backgroundSize: "300px 300px, 500px 500px, 400px 400px, 350px 350px, 450px 450px",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #6c47ff 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          The #1 AI Assistant
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #6c47ff)" }}>
            For Your Meetings
          </span>
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
          Transcribe, summarize, search, and analyze all your team conversations — automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/home"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-base transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6c47ff, #9c6dff)" }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-white/80 font-medium text-base border border-white/20 hover:border-white/40 hover:text-white transition-colors">
            Request Demo
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
              ))}
              <Star size={13} className="text-[#f59e0b]" />
            </div>
            <span className="text-white/60 font-medium">Rated 4.8 / 5 on G2</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-white/40" />
            <span>GDPR · SOC 2 · HIPAA Ready</span>
          </div>
        </div>

        {/* App mockup */}
        <div className="mt-12 relative mx-auto max-w-2xl">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "#13132b" }}>
            {/* Mock header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "#1a1a3e" }}>
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="ml-3 text-xs text-white/40">Product Strategy Review — 45 min</span>
            </div>
            {/* Mock transcript */}
            <div className="p-5 space-y-3">
              {[
                { speaker: "Sarah K.", color: "#6c47ff", text: "Let's walk through the Q4 roadmap priorities before we finalize the release timeline." },
                { speaker: "Marcus T.", color: "#10b981", text: "Agreed. The authentication flow should be our first priority — it's blocking the mobile team." },
                { speaker: "Priya L.", color: "#f59e0b", text: "I can have the design specs ready by Thursday. We just need sign-off from engineering." },
              ].map(({ speaker, color, text }) => (
                <div key={speaker} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5" style={{ background: color }}>
                    {speaker[0]}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold mb-0.5" style={{ color }}>{speaker}</p>
                    <p className="text-xs text-white/60">{text}</p>
                  </div>
                </div>
              ))}
              {/* AI Summary pill */}
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl border border-[#6c47ff]/30" style={{ background: "rgba(108,71,255,0.1)" }}>
                <Flame size={14} className="text-[#9c6dff] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-[#9c6dff] mb-0.5">AI Summary</p>
                  <p className="text-xs text-white/60">Team agreed to prioritize authentication flow for Q4 release. Priya will deliver design specs by Thursday pending engineering approval.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Transcription ────────────────────────────────────────────────────

function FeatureTranscription() {
  return (
    <section className="px-6 md:px-12 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Text side */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            High Quality Meeting{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #a78bfa)" }}>
              Transcription & Recording
            </span>
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Capture every word with industry-leading accuracy across 100+ languages. Never miss a critical detail again.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#6c47ff" }}
          >
            Get Started <ArrowRight size={14} />
          </Link>

          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { stat: "98%", label: "Accuracy Rate" },
              { stat: "100+", label: "Languages" },
              { stat: "Multi", label: "Speaker Recognition" },
              { stat: "Auto", label: "Language Detection" },
            ].map(({ stat, label }) => (
              <div key={label} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xl font-bold text-gray-900">{stat}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel mockup */}
        <div className="flex-1 max-w-sm w-full">
          <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6c47ff]" />
              <span className="text-xs font-medium text-gray-600">Live Transcript</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { speaker: "Alex", color: "#6c47ff", time: "0:02", text: "Can everyone confirm the launch date is still locked for the 15th?" },
                { speaker: "Jamie", color: "#10b981", time: "0:14", text: "Yes, engineering is on track. QA finishes Friday." },
                { speaker: "Alex", color: "#6c47ff", time: "0:28", text: "Perfect. Let's lock that in and communicate to stakeholders today." },
              ].map(({ speaker, color, time, text }) => (
                <div key={time} className="flex gap-2.5">
                  <span className="text-[10px] text-gray-400 mt-0.5 w-6 shrink-0">{time}</span>
                  <div>
                    <span className="text-[10px] font-semibold" style={{ color }}>{speaker}: </span>
                    <span className="text-xs text-gray-600">{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Live Assist ──────────────────────────────────────────────────────

function FeatureLiveAssist() {
  const integrationIcons = ["Z", "T", "G", "S", "N", "H"];
  const iconColors = ["#2d8cff", "#5059c9", "#4285f4", "#e01e5a", "#374151", "#ff7a59"];

  return (
    <section className="px-6 md:px-12 py-20" style={{ background: "#0d0d1f" }}>
      <div className="max-w-6xl mx-auto">
        {/* Integration icons row */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {integrationIcons.map((icon, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: iconColors[i] }}
            >
              {icon}
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 p-10 text-center" style={{ background: "linear-gradient(135deg, #1a0a4a 0%, #0d1a3e 100%)" }}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 max-w-2xl mx-auto">
            Get Real-Time Suggestions, Coaching, And Answers During Meetings
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Live Assist surfaces the right information at the right moment — so you can focus on the conversation, not the research.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold border border-white/30 hover:border-white/60 hover:bg-white/10 transition-colors">
            <Play size={14} className="fill-white" />
            Explore Live Assist
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Conversation Intelligence ───────────────────────────────────────

function FeatureIntelligence() {
  return (
    <section className="px-6 md:px-12 py-20" style={{ background: "#f8f8ff" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Panel mockup */}
        <div className="flex-1 max-w-sm w-full order-2 lg:order-1">
          <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Conversation Analytics</span>
              <div className="flex gap-1">
                {["Talk Ratio", "Topics", "Sentiment"].map((tab, i) => (
                  <span key={tab} className={`text-[10px] px-2 py-0.5 rounded-full ${i === 0 ? "bg-[#6c47ff] text-white" : "text-gray-500"}`}>{tab}</span>
                ))}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { speaker: "You", pct: 35, color: "#6c47ff" },
                { speaker: "Client", pct: 52, color: "#10b981" },
                { speaker: "Others", pct: 13, color: "#f59e0b" },
              ].map(({ speaker, pct, color }) => (
                <div key={speaker}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">{speaker}</span>
                    <span className="font-semibold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="flex-1 order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Drive Insights With{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #a78bfa)" }}>
              Conversation Intelligence
            </span>
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Understand talk ratios, identify recurring topics, and track sentiment trends across your entire team's conversations.
          </p>
          <ul className="space-y-3">
            {["Track talk time and engagement ratios", "Surface recurring themes and topics", "Monitor sentiment across meetings", "Export reports and share with your team"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={14} className="text-[#6c47ff] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Tasks & Knowledge ────────────────────────────────────────────────

function FeatureTasks() {
  const [activeTab, setActiveTab] = useState<"Tasks" | "Contacts" | "Feed">("Tasks");

  const tasks = [
    { text: "Follow up with Sarah on the Q4 budget proposal", done: true },
    { text: "Schedule design review for the new onboarding flow", done: false },
    { text: "Send product roadmap to all stakeholders", done: false },
    { text: "Update the API documentation with the new endpoints", done: true },
  ];

  return (
    <section className="px-6 md:px-12 py-20" style={{ background: "#0d0d1f" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-lg">
            All Your Tasks, Contacts, &amp; Knowledge In One Place
          </h2>
          <Link
            href="/home"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shrink-0"
            style={{ background: "#6c47ff" }}
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {(["Tasks", "Contacts", "Feed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-[#6c47ff] text-white" : "text-white/50 hover:text-white hover:bg-white/10"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task mockup */}
        <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "#13132b" }}>
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#6c47ff] flex items-center justify-center">
              <Check size={10} className="text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Action Items from Meetings</span>
          </div>
          <div className="divide-y divide-white/5">
            {tasks.map(({ text, done }) => (
              <div key={text} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${done ? "bg-[#6c47ff] border-[#6c47ff]" : "border-white/20"}`}>
                  {done && <Check size={9} className="text-white" />}
                </div>
                <span className={`text-sm ${done ? "line-through text-white/30" : "text-white/70"}`}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative px-6 py-28 text-center overflow-hidden" style={{ background: "#0d0d1f" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 35% 75%, rgba(255,255,255,0.2) 0%, transparent 100%)",
          backgroundSize: "400px 400px, 600px 600px, 500px 500px, 350px 350px",
        }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #6c47ff 0%, transparent 70%)" }} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Unlock The Knowledge Buried Inside Your Conversations
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Join thousands of teams who run smarter meetings with AI-powered insights.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/home"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-base transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6c47ff, #9c6dff)" }}
          >
            Try For Free <ArrowRight size={16} />
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-white/80 font-medium text-base border border-white/20 hover:border-white/40 hover:text-white transition-colors">
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    heading: "Product",
    links: ["Meeting Transcription", "AI Summaries", "Action Items", "AskFred AI", "Voice Agents", "Analytics"],
  },
  {
    heading: "Use Cases",
    links: ["Sales Teams", "Engineering", "HR & Recruiting", "Customer Success", "Remote Teams", "Agencies"],
  },
  {
    heading: "Integrations",
    links: ["Zoom", "Google Meet", "Microsoft Teams", "Slack", "HubSpot", "Salesforce"],
  },
  {
    heading: "Company",
    links: ["About Us", "Blog", "Careers", "Press", "Security", "Privacy Policy"],
  },
];

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-14 border-t border-white/10" style={{ background: "#080810" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">{heading}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download column */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Download</p>
            <ul className="space-y-2">
              {["Desktop App", "iOS App", "Android App", "Chrome Extension"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#6c47ff" }}>
              <Flame size={11} className="text-white" />
            </div>
            <span className="text-white/60 text-sm font-medium">fireflies.ai</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Fireflies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0d1f" }}>
      {showAnnouncement && (
        <AnnouncementBar onDismiss={() => setShowAnnouncement(false)} />
      )}
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureTranscription />
        <FeatureLiveAssist />
        <FeatureIntelligence />
        <FeatureTasks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
