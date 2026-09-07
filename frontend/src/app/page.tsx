"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X, ChevronDown, ChevronUp, ArrowRight, Star, Lock, Check,
  Search, Globe, Users, Zap, Mic, Shield, Eye, Database,
  Download, Hash, MessageSquare, Sliders, Volume2,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

function PurpleArrowBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
      style={{ background: "#6c47ff" }}
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}

// ── Announcement Bar ───────────────────────────────────────────────────────────

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2"
      style={{ background: "linear-gradient(90deg, #5b35e0 0%, #7c5aff 50%, #a07fff 100%)" }}
    >
      <span className="text-[10px] font-bold bg-[#22c55e] text-white px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0">
        NEW
      </span>
      <p className="text-white/90 text-xs sm:text-sm">
        Meet Email Assistant: Your inbox triaged and replies auto-drafted.{" "}
        <a href="#" className="text-white font-semibold underline underline-offset-2 hover:text-white/80">
          See Now
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

// ── Navbar ─────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center px-6 md:px-10 h-[64px] border-b border-white/10 backdrop-blur-md"
      style={{ background: "rgba(13,11,35,0.96)" }}
    >
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-8">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #ff4f8b 0%, #6c47ff 100%)" }}
        >
          f
        </div>
        <span className="text-white font-bold text-[17px] tracking-tight">fireflies.ai</span>
      </Link>

      <div className="hidden md:flex items-center text-sm text-white/70">
        {["Product", "Solutions", "Integration", "Resources"].map((item) => (
          <button
            key={item}
            className="flex items-center gap-0.5 px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
          >
            {item} <ChevronDown size={11} className="mt-px" />
          </button>
        ))}
        <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">Enterprise</button>
        <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">Pricing</button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="hidden sm:block px-3 py-1.5 text-[#7c5aff] text-sm font-medium hover:text-[#9c7fff] transition-colors">
          Login
        </button>
        <button className="hidden sm:flex px-4 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:border-white/60 hover:text-white transition-colors whitespace-nowrap">
          Request Demo
        </button>
        <Link
          href="/home"
          className="flex items-center px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-colors whitespace-nowrap"
          style={{ background: "#6c47ff" }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center text-center px-6 pt-20 pb-0 overflow-hidden"
      style={{ background: "#0d0b23" }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.35) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 75% 12%, rgba(255,255,255,0.25) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 45% 55%, rgba(255,255,255,0.2) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 88% 72%, rgba(255,255,255,0.18) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 23% 82%, rgba(255,255,255,0.22) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 60% 38%, rgba(255,255,255,0.15) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 5% 48%, rgba(255,255,255,0.2) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 95% 35%, rgba(255,255,255,0.18) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "350px 350px, 600px 600px, 400px 400px, 500px 500px, 450px 450px, 300px 300px, 550px 550px, 480px 480px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-[52px] sm:text-[62px] md:text-[72px] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
          The #1 AI Assistant For
          <br />
          Your Meetings
        </h1>
        <p className="text-[17px] text-white/55 mb-8 max-w-lg mx-auto leading-relaxed">
          Transcribe, summarize, search, and analyze all your team conversations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/home"
            className="flex items-center gap-2 px-7 py-3 rounded-lg text-white font-semibold text-base transition-all hover:opacity-90"
            style={{ background: "#6c47ff" }}
          >
            Get Started <ArrowRight size={15} />
          </Link>
          <button
            className="flex items-center gap-2 px-7 py-3 rounded-lg text-white/85 font-medium text-base border border-white/20 hover:border-white/40 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Request Demo
          </button>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-4 text-sm text-white/50 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black">G</span>
            </div>
            <span className="text-white/65 text-sm font-medium">Rated 4.8 / 5</span>
            <div className="flex items-center gap-0.5 ml-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
              ))}
              <Star size={12} className="text-[#f59e0b] fill-[#f59e0b] opacity-50" />
            </div>
          </div>
          <span className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-white/40" />
            <span>GDPR, SOC2, More</span>
          </div>
        </div>

        {/* App mockup */}
        <div className="relative mx-auto max-w-[820px]">
          <div className="rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-white">
            {/* Top bar */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100"
              style={{ background: "#f9fafb" }}
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-gray-400">#</span>
                <span>Sales</span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-700">Kickoff Call – Fireflies.ai x Acme</span>
              </div>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#22c55e] text-white">REC</span>
              <div className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 text-xs text-gray-600">
                  <Globe size={11} /> Share
                </button>
              </div>
            </div>

            <div className="flex">
              {/* Left: Notes */}
              <div className="flex-1 p-5 border-r border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-800">Kickoff Call – Fireflies.ai x Acme</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-4">Sarah Watts, +3 · Mar 15 · 11:30 AM</p>
                <div className="flex items-center gap-2 mb-4">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-[10px] text-[#6c47ff] font-medium">
                    ✦ Sales Notes ▾
                  </button>
                </div>
                <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Overview</p>
                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                  The kickoff call served as an introduction between Fireflies.ai and Acme Inc. They aim to use
                  Fireflies.ai primarily to streamline internal communications, automate sales call follow-ups,
                  and improve meeting workflows.
                </p>
                <p className="text-[10px] font-semibold text-gray-700 mb-2">Notes</p>
                <div className="space-y-1.5">
                  {["Use Case & Requirements: 00:00 – 10:12", "Metrics & Goals: 10:15 – 20:43"].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-3 h-3 rounded-sm bg-gray-800 mt-px shrink-0" />
                      <span className="text-[10px] text-gray-600">{item}</span>
                    </div>
                  ))}
                  <div className="pl-5 space-y-1">
                    {[
                      "Acme wants their sales team more present during calls",
                      "Acme is looking to buy Fireflies for 50 seats",
                    ].map((sub) => (
                      <p key={sub} className="text-[10px] text-gray-500">• {sub}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Transcript */}
              <div className="w-[280px] shrink-0 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-800">Transcript</span>
                  <div className="relative">
                    <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="pl-6 pr-2 py-1 rounded-md border border-gray-200 text-[10px] w-20 outline-none"
                      placeholder="Search"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Sarah", color: "#8b5cf6", time: "00:53", text: "We're aiming for a seamless onboarding experience, especially around the integrations with Slack and HubSpot." },
                    { name: "Janice", color: "#f59e0b", time: "01:24", text: "Absolutely, our team will work closely with your tech lead to ensure a smooth integration process." },
                    { name: "Chris", color: "#10b981", time: "01:47", text: "I'll prepare the migration timeline and send it over by end of week." },
                  ].map(({ name, color, time, text }) => (
                    <div key={time} className="flex gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5"
                        style={{ background: color }}
                      >
                        {name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold text-gray-700">{name}</span>
                          <span className="text-[9px] text-[#6c47ff]">{time}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0d0b23)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Company Logos Strip ────────────────────────────────────────────────────────

function CompanyLogos() {
  const logos = [
    { src: "/assets/logos/assembly-ai.png", alt: "AssemblyAI", w: 160, h: 32 },
    { src: "/assets/logos/emaar.png", alt: "EMAAR MISR", w: 120, h: 40 },
    { src: "/assets/logos/leonardo-ai.png", alt: "Leonardo.Ai", w: 140, h: 36 },
    { src: "/assets/logos/penn.png", alt: "University of Pennsylvania", w: 120, h: 36 },
  ];
  return (
    <section className="py-10 px-6" style={{ background: "#0d0b23" }}>
      <p className="text-center text-[11px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-8">
        Used Across <span className="text-[#6c47ff]">1 Million+</span> Companies
      </p>
      <div className="flex items-center justify-center gap-12 flex-wrap">
        {logos.map(({ src, alt, w, h }) => (
          <div key={alt} className="opacity-40 hover:opacity-60 transition-opacity">
            <Image src={src} alt={alt} width={w} height={h} className="object-contain brightness-[10] invert" style={{ maxHeight: h }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Feature: Transcription ─────────────────────────────────────────────────────

function FeatureTranscription() {
  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-[36px] md:text-[42px] font-extrabold leading-tight mb-5 text-gray-900">
            High Quality Meeting{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
            >
              Transcription &amp; Recording
            </span>
          </h2>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Globe size={18} className="text-gray-500" />, stat: "95% Accurate", desc: "Fireflies is the industry leader in transcription accuracy." },
              { icon: <Globe size={18} className="text-gray-500" />, stat: "100+ Languages", desc: "Transcribe meetings in English, Spanish, French, & several others." },
              { icon: <Users size={18} className="text-gray-500" />, stat: "Speaker Recognition", desc: "Fireflies identifies different speakers in meetings and audio files." },
              { icon: <Zap size={18} className="text-gray-500" />, stat: "Auto-Language Detection", desc: "Automatically switch languages from meeting to meeting with ease." },
            ].map(({ icon, stat, desc }) => (
              <div key={stat} className="pt-3">
                <div className="mb-2">{icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{stat}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript screenshot */}
        <div className="flex-1 max-w-[460px] w-full">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/assets/images/transcript-recording-desktop.webp"
              alt="Fireflies transcript recording"
              width={750}
              height={500}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: AI Summaries ──────────────────────────────────────────────────────

function FeatureAISummaries() {
  const [activeTab, setActiveTab] = useState<"Overview" | "Bullet Points" | "Action Items" | "Custom Notes">("Overview");

  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#0d0b23" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-10">
          <div>
            <h2 className="text-[36px] md:text-[42px] font-extrabold text-white leading-tight mb-4">
              Comprehensive{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}
              >
                AI Summaries
              </span>
            </h2>
            <p className="text-white/55 text-base max-w-md leading-relaxed">
              Get detailed notes, action items, and customized summaries instantly after every meeting.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {(["Overview", "Bullet Points", "Action Items", "Custom Notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                activeTab === tab
                  ? "bg-[#6c47ff] text-white border-[#6c47ff]"
                  : "text-white/50 border-white/15 hover:text-white/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* AI summary screenshot */}
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src="/assets/images/ai-summary-canvas.webp"
            alt="Fireflies AI summaries"
            width={1200}
            height={720}
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
}

// ── Feature: Capture Anywhere ──────────────────────────────────────────────────

function FeatureCaptureAnywhere() {
  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[36px] md:text-[42px] font-extrabold text-gray-900 leading-tight mb-12 max-w-lg">
          Capture Meetings{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
          >
            Anywhere &amp; Anytime
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* AI Note Taker Bot */}
          <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ background: "#f5f3ff" }}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Note Taker Bot</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Invite fred@fireflies.ai to a live meeting or have it autojoin your calendar meetings to record,
                transcribe, and summarize.
              </p>
            </div>
            <div className="px-6 pb-0">
              <div className="rounded-xl overflow-hidden border border-purple-100 bg-white shadow-md">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
                      31
                    </div>
                    <span className="font-medium">Sales Demo</span>
                    <span className="text-gray-400">Janice, +2</span>
                  </div>
                  <div className="w-8 h-5 rounded-full bg-[#6c47ff] flex items-center justify-end px-0.5">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
                <div
                  className="p-5 flex flex-col items-center justify-center gap-3 min-h-[120px]"
                  style={{ background: "#1a1a2e" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #ff4f8b 0%, #6c47ff 100%)" }}
                  >
                    <span className="text-white font-bold text-xl">f</span>
                  </div>
                  <p className="text-white/70 text-xs">Janice's Fireflies.ai Notetaker</p>
                  <div className="flex items-center gap-2">
                    {["G", "Z", "T", "W"].map((l, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[9px] text-white font-bold"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chrome Extension */}
          <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ background: "#fffbf0" }}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chrome Extension</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Automatically record your Google Meet calls and get real-time transcripts.
              </p>
            </div>
            <div className="px-6 pb-0">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md min-h-[130px] relative">
                {/* Webcam-style person placeholder */}
                <div
                  className="w-full h-32 flex items-end justify-end p-3"
                  style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2239 100%)" }}
                >
                  <div className="w-16 h-12 rounded-lg border-2 border-blue-400 overflow-hidden flex items-center justify-center" style={{ background: "#1a3050" }}>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e] text-white">TRANSCRIBING</span>
                </div>
                <div className="px-3 py-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">31</div>
                  <span className="text-xs text-gray-600 font-medium">Sales Demo</span>
                  <span className="text-xs text-gray-400 ml-auto">02:14</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "📱", title: "Mobile App", desc: "Transcribe and summarize in-person conversation with the Fireflies mobile app." },
            { icon: "🖥", title: "Desktop App", desc: "Transcribe and summarize your calls with the Fireflies desktop app." },
            { icon: "📞", title: "Dialers & API", desc: "Transcribe calls from Aircall, Ringcentral and other dialers or use our API to process audio files." },
          ].map(({ icon, title, desc }) => (
            <div key={title}>
              <p className="text-2xl mb-3">{icon}</p>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Feature: AI Search ─────────────────────────────────────────────────────────

function FeatureSearch() {
  return (
    <section className="px-6 md:px-16 py-20 text-center" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[36px] md:text-[46px] font-extrabold text-gray-900 leading-tight mb-3">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
          >
            Remember
          </span>{" "}
          Every Conversation
          <br />
          With{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
          >
            AI Powered Search
          </span>
        </h2>
        <p className="text-gray-500 mb-10 text-base">Fireflies gives you perfect memory after every conversation.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Meeting Search */}
          <div
            className="rounded-2xl overflow-hidden border border-gray-100 text-left"
            style={{ background: "#f9f5ff" }}
          >
            <div className="p-5">
              <p className="text-xs font-semibold text-[#6c47ff] uppercase tracking-wider mb-3">Meeting Search</p>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 mb-4">
                <Search size={13} className="text-gray-400" />
                <span className="text-sm text-gray-700">Design</span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "Design Team Sync",
                    date: "Matt · May 15",
                    matches: "14 matches",
                    excerpts: [
                      '"..So you look for this design sync meeting in this particular..."',
                      '"...for let\'s say design team and their tasks.."',
                    ],
                  },
                  { title: "Roadmap Planning", date: "Matt · May 15", matches: null, excerpts: [] },
                ].map(({ title, date, matches, excerpts }) => (
                  <div key={title} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-800">{title}</span>
                      {matches && <span className="text-[10px] text-[#6c47ff] font-medium">{matches}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{date}</p>
                    {excerpts.map((e) => (
                      <p key={e} className="text-[11px] text-gray-500 italic">{e}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AskFred */}
          <div
            className="rounded-2xl overflow-hidden border border-gray-100 text-left"
            style={{ background: "#f0fff8" }}
          >
            <div className="p-5">
              <p className="text-xs font-semibold text-[#10b981] uppercase tracking-wider mb-3">AskFred</p>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#6c47ff] flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">f</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">AskFred</span>
                  </div>
                  <span className="text-xs text-gray-400">GPT-4o ▾</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-0.5">You</p>
                    <p className="text-xs text-gray-600">
                      What did Sam say about the updated pricing for Facebook ads?
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#6c47ff] flex items-center justify-center shrink-0">
                    <span className="text-white text-[8px] font-bold">f</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-0.5">AskFred</p>
                    <p className="text-xs text-gray-600">
                      Sam said, new Facebook ad pricing is more competitive, but CPC has slightly increased.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  <div className="text-[#6c47ff] text-xs">✦</div>
                  <input
                    className="flex-1 text-xs text-gray-400 outline-none"
                    placeholder="Ask anything..."
                    readOnly
                  />
                  <div className="w-6 h-6 rounded-lg bg-[#6c47ff] flex items-center justify-center">
                    <ArrowRight size={11} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Live Assist ───────────────────────────────────────────────────────

function FeatureLiveAssist() {
  const appIcons = [
    { l: "Z", bg: "#2d8cff" },
    { l: "G", bg: "#4285f4" },
    { l: "T", bg: "#5059c9" },
    { l: "S", bg: "#e01e5a" },
    { l: "F", bg: "#6c47ff" },
    { l: "W", bg: "#25d366" },
    { l: "D", bg: "#5865f2" },
    { l: "P", bg: "#374151" },
  ];

  const meetingAppIcons = [
    { src: "/assets/logos/zoom.svg", alt: "Zoom" },
    { src: "/assets/logos/google-meet.svg", alt: "Google Meet" },
    { src: "/assets/logos/ms-teams.svg", alt: "Microsoft Teams" },
    { src: "/assets/logos/slack.svg", alt: "Slack" },
  ];

  return (
    <section
      className="px-6 md:px-16 py-4"
      style={{ background: "#0d0b23" }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ minHeight: "420px" }}
        >
          {/* Background photo */}
          <Image
            src="/assets/images/fireflies-live-assist-card.png"
            alt="Live Assist background"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

          <div className="relative z-10 py-16 px-8 text-center">
            {/* App icons row */}
            <div className="flex items-center justify-center gap-1.5 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20" style={{ background: "rgba(0,0,0,0.5)" }}>
                {meetingAppIcons.map(({ src, alt }) => (
                  <div key={alt} className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                    <Image src={src} alt={alt} width={28} height={28} className="w-5 h-5 object-contain" />
                  </div>
                ))}
                {appIcons.slice(4).map(({ l, bg }, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: bg }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-[28px] md:text-[38px] font-extrabold text-white mb-4 max-w-2xl mx-auto leading-tight">
              Get Real-Time Suggestions, Coaching,
              <br />
              And Answers During Meetings.
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto text-base leading-relaxed">
              Meet the new Live Assist that can provide real-time suggestions, coaching, and answers during your
              meetings.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
              style={{ background: "#6c47ff" }}
            >
              Explore Live Assist <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Conversation Intelligence ────────────────────────────────────────

function FeatureConvIntelligence() {
  const [openIdx, setOpenIdx] = useState(0);

  const items = [
    {
      title: "Speaker Talk-time",
      desc: "Automatically track each participant's speaking time and easily monitor participation in meetings.",
    },
    {
      title: "AI Filters",
      desc: "Filter transcripts by questions, tasks, dates, metrics, and more to quickly find what you need.",
    },
    {
      title: "Sentiment Analysis",
      desc: "Track emotional tone and trends across meetings to understand team and customer dynamics.",
    },
    {
      title: "Topic Trackers",
      desc: "Monitor recurring themes across all your team conversations automatically.",
    },
  ];

  const speakers = [
    { name: "Cate", color: "#8b5cf6", time: "00:53", pct: 64, text: "There's some concern about onboarding. Clients feel it's not intuitive enough." },
    { name: "Rohan", color: "#f97316", time: "01:24", pct: 24, text: "Noted. We'll pass that to product. On the seating front—how are we doing with capacity?" },
    { name: "Tom", color: "#ec4899", time: "01:47", pct: 8, text: "" },
    { name: "Emily", color: "#8b5cf6", time: "02:19", pct: null, text: "" },
  ];

  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-16">
        {/* Left: accordion */}
        <div className="flex-1">
          <h2 className="text-[36px] md:text-[42px] font-extrabold text-gray-900 leading-tight mb-4">
            Drive Insights With
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
            >
              Conversation Intelligence
            </span>
          </h2>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            Detailed analytics to help you uncover insights across every conversation.
          </p>
          <div className="divide-y divide-gray-200">
            {items.map((item, i) => (
              <div key={item.title}>
                <button
                  onClick={() => setOpenIdx(i === openIdx ? -1 : i)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span
                    className={`text-sm font-semibold ${openIdx === i ? "text-[#6c47ff]" : "text-gray-800"}`}
                  >
                    {item.title}
                  </span>
                  {openIdx === i ? (
                    <ChevronUp size={15} className="text-[#6c47ff] shrink-0" />
                  ) : (
                    <ChevronDown size={15} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openIdx === i && (
                  <p className="pb-4 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: transcript panel + % overlay */}
        <div className="flex-1 max-w-[480px] relative">
          <div className="rounded-2xl border border-gray-200 shadow-xl overflow-visible bg-white">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Transcript</span>
              <div className="relative">
                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="pl-6 pr-3 py-1 rounded-md border border-gray-200 text-[10px] w-20 outline-none"
                  placeholder="Search"
                  readOnly
                />
              </div>
            </div>
            <div className="p-4 space-y-4">
              {speakers.map(({ name, color, time, pct, text }) => (
                <div key={time} className="flex gap-2 relative">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: color }}
                  >
                    {name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold text-gray-700">{name}</span>
                      <ChevronDown size={9} className="text-gray-400" />
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300 mx-0.5" />
                      <span className="text-[9px] text-[#6c47ff] font-medium">{time}</span>
                    </div>
                    {text && <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>}
                  </div>
                  {/* Percentage badge floated right */}
                  {pct !== null && (
                    <div className="absolute right-0 top-0 flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm translate-x-[110%]">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ background: color }}
                      >
                        {name[0]}
                      </div>
                      <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">{pct}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Tasks ─────────────────────────────────────────────────────────────

function FeatureTasks() {
  const [activeTab, setActiveTab] = useState<"Tasks" | "Contacts" | "Feed">("Tasks");

  const leftLogos = [
    { img: "/assets/logos/asana.svg", alt: "Asana" },
    { img: "/assets/logos/slack.svg", alt: "Slack" },
    { img: "/assets/logos/hubspot.svg", alt: "HubSpot" },
    { img: "/assets/logos/notion.svg", alt: "Notion" },
  ];
  const rightLogos = [
    { img: "/assets/logos/salesforce.svg", alt: "Salesforce" },
    { img: "/assets/logos/zapier.svg", alt: "Zapier" },
    { img: "/assets/logos/trello.svg", alt: "Trello" },
    { img: "/assets/logos/google-docs.svg", alt: "Google Docs" },
  ];

  return (
    <section
      className="relative px-6 md:px-16 py-20 overflow-hidden"
      style={{ background: "#120b2e" }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: [
              "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 25% 80%, rgba(255,255,255,0.25) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "300px 300px, 400px 400px, 250px 250px, 350px 350px",
          }}
        />
      </div>

      {/* Floating logos left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-4 hidden lg:flex">
        {leftLogos.map(({ img, alt }) => (
          <div
            key={alt}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 bg-white p-2"
          >
            <Image src={img} alt={alt} width={32} height={32} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      {/* Floating logos right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 hidden lg:flex">
        {rightLogos.map(({ img, alt }) => (
          <div
            key={alt}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 bg-white p-2"
          >
            <Image src={img} alt={alt} width={32} height={32} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[36px] md:text-[42px] font-extrabold text-white leading-tight mb-3">
              All Your{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}>
                Tasks, Contacts,
              </span>{" "}
              &amp;{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}>
                Knowledge
              </span>{" "}
              In One Place
            </h2>
            <p className="text-white/55 text-base max-w-md leading-relaxed">
              Understand what's happening across the company and what your team needs to get done.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* Section tabs */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {(["Tasks", "Contacts", "Feed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors border ${
                activeTab === tab ? "bg-white text-gray-900 border-white" : "text-white/50 border-white/20 hover:text-white/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task screenshot in dark card */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #1a0e4a 0%, #2d1b69 50%, #1e0f5a 100%)" }}
        >
          <div className="p-4 md:p-6 relative">
            <div className="rounded-xl overflow-hidden shadow-2xl relative">
              <Image
                src={activeTab === "Tasks" ? "/assets/images/tasks-desktop.webp" :
                     activeTab === "Contacts" ? "/assets/images/contacts-desktop.webp" :
                     "/assets/images/feed-desktop.webp"}
                alt={`${activeTab} view`}
                width={900}
                height={560}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Go Beyond Notetaking (AI Skills) ──────────────────────────────────

const AI_SKILLS: Record<string, { name: string; desc: string; color: string }[]> = {
  Sales: [
    { name: "BANT App", desc: "Extract the budget, authority, need and timeline from meetings.", color: "#f97316" },
    { name: "Churn Risk Analyzer", desc: "Identify potential indicators of customer churn.", color: "#ec4899" },
    { name: "Customer Objection Tracker", desc: "List down objections or concerns raised by the customer.", color: "#8b5cf6" },
    { name: "Follow-Up Email Generator", desc: "Generate follow up email for the deal.", color: "#06b6d4" },
  ],
  Recruiting: [
    { name: "Candidate Scorer", desc: "Score candidates based on key attributes from interviews.", color: "#10b981" },
    { name: "Interview Summary", desc: "Generate structured summaries from interview meetings.", color: "#6c47ff" },
    { name: "Offer Letter Draft", desc: "Draft personalized offer letters based on interview notes.", color: "#f59e0b" },
    { name: "Rejection Feedback", desc: "Create constructive rejection feedback from interview data.", color: "#ef4444" },
  ],
  Marketing: [
    { name: "Campaign Brief Extractor", desc: "Pull key campaign goals and KPIs from marketing meetings.", color: "#6c47ff" },
    { name: "Content Ideas Generator", desc: "Generate content ideas based on customer feedback calls.", color: "#f97316" },
    { name: "Competitor Mentions Tracker", desc: "Identify mentions of competitors across all conversations.", color: "#ec4899" },
    { name: "Brand Voice Analyzer", desc: "Analyze how your brand messaging lands with customers.", color: "#10b981" },
  ],
};

const USE_CASE_IMAGES: Record<string, string> = {
  Sales: "/assets/images/usecase-sales.png",
  Recruiting: "/assets/images/usecase-recruiting.png",
  Marketing: "/assets/images/usecase-marketing.png",
  "User Research": "/assets/images/usecase-user-research.png",
  Engineering: "/assets/images/usecase-engineering.png",
  Finance: "/assets/images/usecase-finance.png",
  Healthcare: "/assets/images/usecase-healthcare.png",
  "Media & Podcasting": "/assets/images/usecase-media-podcasting.png",
  "Venture Capital": "/assets/images/usecase-venture-capital.png",
};

function FeatureBeyondNotetaking() {
  const TABS = ["Sales", "Recruiting", "Marketing", "User Research", "Engineering", "Finance", "Healthcare", "Media & Podcasting", "Venture Capital"];
  const [activeTab, setActiveTab] = useState("Sales");
  const skills = AI_SKILLS[activeTab] || AI_SKILLS.Sales;
  const useCaseImg = USE_CASE_IMAGES[activeTab] || USE_CASE_IMAGES.Sales;

  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[36px] md:text-[42px] font-extrabold text-gray-900 leading-tight mb-3">
              Go Beyond Notetaking With{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
              >
                300+ AI Apps
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-lg leading-relaxed">
              Use AI-powered apps to get more from your meetings — tailored to your role.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                activeTab === tab
                  ? "bg-[#6c47ff] text-white border-[#6c47ff]"
                  : "text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two-column: use case screenshot + skills list */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: use case screenshot */}
          <div className="flex-1 max-w-lg">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <Image
                src={useCaseImg}
                alt={`${activeTab} use case`}
                width={800}
                height={560}
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Right: Skills list */}
          <div className="flex-1 min-w-0">
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
              {skills.map(({ name, desc, color }) => (
                <div
                  key={name}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0"
                    style={{ background: color }}
                  >
                    ✦
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
              {/* Create New */}
              <div className="flex items-center gap-4 px-5 py-4" style={{ background: "#f0fdf4" }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#22c55e] text-sm shrink-0"
                  style={{ background: "rgba(34,197,94,0.1)", border: "1px dashed #22c55e" }}
                >
                  ✦
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Create New</p>
                  <p className="text-xs text-gray-400 mt-0.5">Add prompts to tailor meeting summaries to fit your needs.</p>
                </div>
                <span className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 bg-white shrink-0 cursor-pointer hover:bg-gray-50">
                  Create
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Fireflies MCP ─────────────────────────────────────────────────────

function FeatureMCP() {
  return (
    <section className="px-6 md:px-16 pb-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
          style={{ background: "#f5f3ff" }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-5">
              {[
                { bg: "#e5e7eb", label: "📎" },
                { bg: "#e5e7eb", label: "✳" },
                { bg: "#e5e7eb", label: "⬡" },
              ].map(({ bg, label }, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 text-lg"
                  style={{ background: bg }}
                >
                  {label}
                </div>
              ))}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e] text-white ml-1">New</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-extrabold text-gray-900 leading-tight mb-3">
              Meeting Intelligence With{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
              >
                Fireflies MCP
              </span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Fireflies MCP Server lets you bring meeting insights into your AI tools like Claude, Devin, and
              ChatGPT in one click.
            </p>
          </div>
          {/* MCP visualization image */}
          <div className="w-full md:w-[420px] shrink-0 rounded-xl overflow-hidden">
            <Image
              src="/assets/images/mcp-hero.png"
              alt="Fireflies MCP visualization"
              width={840}
              height={520}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Integrations ──────────────────────────────────────────────────────

function FeatureIntegrations() {
  const leftApps = [
    { src: "/assets/logos/slack.svg", alt: "Slack" },
    { src: "/assets/logos/google-meet.svg", alt: "Google Meet" },
    { src: "/assets/logos/zoom.svg", alt: "Zoom" },
    { src: "/assets/logos/ms-teams.svg", alt: "Microsoft Teams" },
    { src: "/assets/logos/hubspot.svg", alt: "HubSpot" },
    { src: "/assets/logos/salesforce.svg", alt: "Salesforce" },
    { src: "/assets/logos/asana.svg", alt: "Asana" },
    { src: "/assets/logos/notion.svg", alt: "Notion" },
    { src: "/assets/logos/zapier.svg", alt: "Zapier" },
    { src: "/assets/logos/google-docs.svg", alt: "Google Docs" },
  ];
  const rightApps = [
    { src: "/assets/logos/trello.svg", alt: "Trello" },
    { src: "/assets/logos/aircall.svg", alt: "Aircall" },
    { src: "/assets/logos/lever.svg", alt: "Lever" },
    { src: "/assets/logos/hubspot.svg", alt: "HubSpot CRM" },
    { src: "/assets/logos/slack.svg", alt: "Slack DMs" },
    { src: "/assets/logos/salesforce.svg", alt: "Salesforce CRM" },
    { src: "/assets/logos/google-docs.svg", alt: "Docs" },
    { src: "/assets/logos/notion.svg", alt: "Notion Notes" },
    { src: "/assets/logos/zapier.svg", alt: "Zapier Zaps" },
    { src: "/assets/logos/asana.svg", alt: "Asana Projects" },
  ];

  return (
    <section className="relative px-6 md:px-16 py-20 overflow-hidden" style={{ background: "#0d0b23" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[32px] md:text-[42px] font-extrabold text-white text-center mb-12 leading-tight">
          Integrate Fireflies With Your{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}
          >
            Favorite Tools
          </span>
        </h2>

        <div className="flex items-center gap-6">
          {/* Left grid */}
          <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
            {leftApps.map(({ src, alt }) => (
              <div
                key={alt}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 p-2"
              >
                <Image src={src} alt={alt} width={28} height={28} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

          {/* Center: Fireflies app card */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-white shadow-2xl">
              <div
                className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-600"
                style={{ background: "#f9fafb" }}
              >
                <span>📅</span>
                <span className="font-medium text-gray-800">Design Session</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Summary</p>
                <p className="text-xs text-gray-500 mb-3">Focused on enhancing the Notepad and customization...</p>
                <div className="h-1.5 rounded-full bg-gray-100 mb-1.5">
                  <div className="h-1.5 rounded-full w-3/4" style={{ background: "#10b981" }} />
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 mb-4">
                  <div className="h-1.5 rounded-full w-1/2" style={{ background: "#10b981" }} />
                </div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Notes</p>
                <div className="space-y-1 mb-4 text-xs text-gray-500">
                  <p>• UX Optimization: Focus on viewing and sharing notes.</p>
                  <p>• UI Simplification: Change template selection to a simple dropdown.</p>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#6c47ff]/5 border border-[#6c47ff]/20">
                  <div className="w-4 h-4 rounded bg-[#6c47ff] flex items-center justify-center shrink-0">
                    <Check size={9} className="text-white" />
                  </div>
                  <span className="text-xs text-gray-600 flex-1">Add copy button</span>
                  <span className="text-xs text-gray-400">Janice</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right grid */}
          <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
            {rightApps.map(({ src, alt }) => (
              <div
                key={alt}
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 p-2"
              >
                <Image src={src} alt={alt} width={28} height={28} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Feature: Enterprise Security + More Capabilities ───────────────────────────

function FeatureSecurity() {
  const securityFeatures = [
    {
      icon: <Eye size={20} />,
      title: "Zero Data Retention",
      desc: "Your data is never used for AI training or any purpose outside your direct business needs.",
      bg: "#0d9488",
    },
    {
      icon: <Database size={20} />,
      title: "Private Storage",
      desc: "Secure, dedicated cloud storage exclusively for your organization's data.",
      bg: "#7c3aed",
    },
    {
      icon: <Shield size={20} />,
      title: "Customer Own Their Data",
      desc: "You maintain full control and ownership of your data, explicitly stated in our Term of Service.",
      bg: "#d97706",
    },
  ];

  const moreFeatures = [
    { icon: <Sliders size={18} />, title: "Expand Summary Notes", desc: "Expand specific summary bullet points for additional context and details." },
    { icon: <Download size={18} />, title: "Download Meetings", desc: "Easily download summary, transcript, meeting audio or video." },
    { icon: <Volume2 size={18} />, title: "Soundbites", desc: "Clip out important moments from calls into easily shareable audio snippets." },
    { icon: <Hash size={18} />, title: "Channels", desc: "Organize your team meetings into different channels." },
    { icon: <Users size={18} />, title: "User Groups", desc: "Create different user groups for different teams to easily share meetings." },
    { icon: <MessageSquare size={18} />, title: "Comments & Bookmarks", desc: "Leave time-stamped comments or bookmark action items, important moments, etc." },
  ];

  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
          <div>
            <h2 className="text-[36px] md:text-[42px] font-extrabold text-gray-900 leading-tight flex flex-wrap items-center gap-2">
              Enterprise-Grade{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
              >
                Security
              </span>
              <span>🔒</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl text-base leading-relaxed">
              Fireflies is the preferred platform for CIOs across the Fortune 500, offering robust admin controls
              and stringent security protocols.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* 3-col security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {securityFeatures.map(({ icon, title, desc, bg }) => (
            <div key={title}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">{title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-sm text-gray-400 whitespace-nowrap">...and many more capabilities</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* 3×2 more features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {moreFeatures.map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="mb-3 text-gray-500">{icon}</div>
              <p className="text-sm font-bold text-gray-900 mb-2">{title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Ed Leon Klinger",
    role: "Co-founder, Flair AI",
    photo: "/assets/images/testimonial-ed.png",
    quote: "Love Fireflies' analytics. It helps tracks my teams' conversations and drives improvements.",
  },
  {
    name: "Lee McMahon",
    role: "Co founder @Clara",
    photo: "/assets/images/testimonial-lee.png",
    quote: "Fireflies cuts down on additional calls with customers, letting us focus directly on solutions.",
  },
  {
    name: "Achintya Gupta",
    role: "Co founder @Phyllo",
    photo: "/assets/images/testimonial-achintya.png",
    quote: "Super impressed with how Fireflies helps us understand what our customers actually need!",
  },
];

function Testimonials() {
  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 mb-3">
          Don't Take Our Word For It
        </h2>
        <p className="text-gray-500 mb-12 text-base">
          See why thousands of organizations are switching to Fireflies
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ name, role, photo, quote }) => (
            <div
              key={name}
              className="p-6 rounded-2xl border border-gray-100 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={photo} alt={name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  "What is Fireflies AI Assistant?",
  "How is Fireflies different from a regular AI notetaker?",
  "What are AI Skills?",
  "What are Voice Agents?",
  "Does Fireflies work with the tools I already use?",
  "Does Fireflies connect with Claude or other AI tools?",
  "Is my data safe with Fireflies?",
  "Does Fireflies record without people knowing?",
  "What languages does Fireflies support?",
  "Can I use Fireflies for free?",
  "How does Fireflies handle enterprise teams?",
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-16 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-100">
          {FAQ_ITEMS.map((q, i) => (
            <div key={q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left text-gray-800 text-sm font-medium hover:text-[#6c47ff] transition-colors"
              >
                <span>{q}</span>
                {open === i ? (
                  <span className="text-lg leading-none text-[#6c47ff] shrink-0">−</span>
                ) : (
                  <span className="text-lg leading-none text-gray-400 shrink-0">+</span>
                )}
              </button>
              {open === i && (
                <div className="pb-4 text-sm text-gray-500 leading-relaxed">
                  Fireflies.ai uses advanced AI to automatically transcribe, summarize, and analyze your meetings
                  so your team can focus on the conversation — not note-taking.
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          Still have more questions? Please write to{" "}
          <a href="mailto:support@fireflies.ai" className="text-[#6c47ff] hover:underline">
            support@fireflies.ai
          </a>{" "}
          and we will respond as quickly as we can.
        </p>
      </div>
    </section>
  );
}

// ── CTA Section ────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative px-6 py-28 text-center overflow-hidden" style={{ background: "#0d0b23" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.25) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.2) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.15) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 35% 75%, rgba(255,255,255,0.2) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "400px 400px, 600px 600px, 500px 500px, 350px 350px",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 rounded-full"
          style={{ background: "radial-gradient(circle, #6c47ff 0%, transparent 70%)" }}
        />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-[36px] md:text-[52px] font-extrabold text-white mb-4 leading-tight">
          Unlock The Knowledge Buried Inside Your Conversations
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/home"
            className="flex items-center gap-2 px-7 py-3 rounded-lg text-white font-semibold text-base transition-all hover:opacity-90"
            style={{ background: "#6c47ff" }}
          >
            Try Fireflies For Free
          </Link>
          <button
            className="flex items-center gap-2 px-7 py-3 rounded-lg text-white/80 font-medium text-base border border-white/25 hover:border-white/50 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    heading: "Product",
    links: ["Features", "Notetaker", "AI Assistant", "Daily Brief", "Email Assistant", "Live Assist", "Voice Agents", "Slack Assistant", "Conversation intelligence", "Chrome Extension", "AI Skills Store", "API", "Pricing", "Security", "Trust Center (SOC2, HIPAA, GDPR)"],
  },
  {
    heading: "Use Cases",
    links: ["Sales", "Recruiting", "Marketing", "Product & User Research", "Collaboration", "Engineering", "Venture Capital", "Healthcare", "Podcasting", "Real Estate"],
  },
  {
    heading: "Integrations",
    links: ["All integrations", "Video conferencing", "Audio recording", "CRM", "Dialers", "Collaboration", "Storage"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Partnership", "HIPAA", "Terms of Service", "Privacy Policy"],
    sub: {
      heading: "Learn",
      links: ["Guide | Help center", "Fireflies Community", "Blog", "Product Announcements", "Customers", "Fireflies for Startups", "Media kit"],
    },
  },
  {
    heading: "Download",
    links: ["Desktop App", "iOS App", "Android App", "Chrome Extension"],
    sub: {
      heading: "Contact & Help",
      links: ["Report bug", "Help Center", "Contact us"],
    },
  },
];

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-14 border-t border-white/10" style={{ background: "#080810" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {FOOTER_COLS.map(({ heading, links, sub }) => (
            <div key={heading}>
              <p className="text-xs font-bold text-white mb-3">{heading}</p>
              <ul className="space-y-2 mb-6">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors leading-relaxed">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              {sub && (
                <>
                  <p className="text-xs font-bold text-white mb-3 mt-4">{sub.heading}</p>
                  <ul className="space-y-2">
                    {sub.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #ff4f8b, #6c47ff)" }}
            >
              f
            </div>
            <span className="text-white/50 text-sm font-medium">fireflies.ai</span>
          </div>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} Fireflies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0b23" }}>
      {showAnnouncement && <AnnouncementBar onDismiss={() => setShowAnnouncement(false)} />}
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CompanyLogos />
        <FeatureTranscription />
        <FeatureAISummaries />
        <FeatureCaptureAnywhere />
        <FeatureSearch />
        <FeatureLiveAssist />
        <FeatureConvIntelligence />
        <FeatureTasks />
        <FeatureBeyondNotetaking />
        <FeatureMCP />
        <FeatureIntegrations />
        <FeatureSecurity />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
