"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X, ChevronDown, ChevronUp, ArrowRight, Star, Lock, Check,
  Search, Globe, Users, Zap, Eye, Database,
  Download, Hash, MessageSquare, Sliders, Volume2, Sparkles,
  MessageCircle, UploadCloud
} from "lucide-react";

// ── Shared UI Helpers ────────────────────────────────────────────────────────────

function PurpleArrowBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
      style={{ background: "#6c47ff" }}
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}

// ── Real Brand SVG Logos ─────────────────────────────────────────────────────────

function AppleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.74 1.03.08 2.06-.51 2.58-1.26z" />
    </svg>
  );
}

function GooglePlayLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3.6 2.5c-.2.2-.4.6-.4 1.1v16.8c0 .5.2.9.4 1.1l9.4-9.5L3.6 2.5z" fill="#00D3FF" />
      <path d="M16.5 8.9L13 12l3.5 3.1 3.9-2.2c1.1-.6 1.1-1.6 0-2.2l-3.9-1.8z" fill="#FFCE00" />
      <path d="M3.6 21.5l9.4-9.5 3.5 3.1-9.9 5.6c-1.3.8-2.6.4-3-.2z" fill="#FF334B" />
      <path d="M3.6 2.5l3-.2 9.9 5.6-3.5 3.1-9.4-9.5z" fill="#00F076" />
    </svg>
  );
}

function RingCentralLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#F8712C" />
      <path d="M8 8a6 6 0 0 1 8 5h-2.2a3.8 3.8 0 0 0-5.8-3.8V8zm0 4a3.8 3.8 0 0 1 5.8 2.2H16a6 6 0 0 0-8-5v2.8zm0 4v-2a1.8 1.8 0 0 1 1.8 1.8h-1.8z" fill="white" />
    </svg>
  );
}

function ClaudeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#D97757">
      <path d="M4.5 9.5l2.2-3.8a2 2 0 0 1 2.8-.7l4.5 2.6-3.8 6.5-4.5-2.6a2 2 0 0 1-1.2-2zM15 4l3.5 2a2 2 0 0 1 .7 2.8l-4 7-3.5-2 4-7a2 2 0 0 1-.7-2.8zM8.5 17.5l7 4a2 2 0 0 0 2.8-.7l2-3.5-7-4-2 3.5a2 2 0 0 0-.8.7z" />
    </svg>
  );
}

function DevinLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#10B981" />
      <polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5" fill="#064E3B" />
      <circle cx="12" cy="12" r="3" fill="#34D399" />
    </svg>
  );
}

function OpenAILogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#10A37F">
      <path d="M22.28 9.37a5.55 5.55 0 0 0-.47-4.49 5.67 5.67 0 0 0-5.83-2.73 5.57 5.57 0 0 0-4.32-2.15 5.67 5.67 0 0 0-5.4 3.93 5.55 5.55 0 0 0-3.86 2.8 5.67 5.67 0 0 0 .58 6.4 5.55 5.55 0 0 0 .47 4.49 5.67 5.67 0 0 0 5.83 2.73 5.57 5.57 0 0 0 4.32 2.15 5.67 5.67 0 0 0 5.4-3.93 5.55 5.55 0 0 0 3.86-2.8 5.67 5.67 0 0 0-.58-6.37zM12 14.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z" />
    </svg>
  );
}

function FredRobotIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="13" rx="4" fill="#6C47FF" />
      <circle cx="9" cy="12" r="1.8" fill="white" />
      <circle cx="15" cy="12" r="1.8" fill="white" />
      <circle cx="9" cy="12" r="0.8" fill="#1E1045" />
      <circle cx="15" cy="12" r="0.8" fill="#1E1045" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="#6C47FF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.5" fill="#FF4F8B" />
      <path d="M10 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── 1. Announcement Bar (Mathematically Centered) ─────────────────────────────────

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="w-full relative z-50 text-xs sm:text-sm py-2 px-4 flex items-center justify-center text-center"
      style={{ background: "linear-gradient(90deg, #5b35e0 0%, #7c5aff 50%, #a07fff 100%)" }}
    >
      <div className="flex items-center justify-center gap-2.5 mx-auto max-w-4xl">
        <span className="text-[10px] font-bold bg-[#22c55e] text-white px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0">
          NEW
        </span>
        <p className="text-white/95 font-normal">
          Meet Email Assistant: Your inbox triaged and replies auto-drafted.{" "}
          <a href="#demo" className="text-white font-semibold underline underline-offset-2 hover:text-white/80 transition-colors">
            See Now
          </a>
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── 2. Sticky Navbar With Mega-Menu Dropdowns ─────────────────────────────────────

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <nav
      className="sticky top-0 z-50 h-[68px] border-b border-white/10 backdrop-blur-md"
      style={{ background: "rgba(13, 11, 35, 0.94)" }}
    >
      <div className="max-w-7xl mx-auto h-full px-6 sm:px-8 flex items-center justify-between relative">
        {/* Left: Brand + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ background: "linear-gradient(135deg, #ff4f8b 0%, #6c47ff 100%)" }}
            >
              f
            </div>
            <span className="text-white font-bold text-[18px] tracking-tight">fireflies.ai</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 text-sm text-white/75 font-normal">
            {/* Product Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter("product")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  activeDropdown === "product" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/10"
                }`}
              >
                Product <ChevronDown size={12} className={`opacity-70 mt-px transition-transform ${activeDropdown === "product" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Solutions Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter("solutions")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  activeDropdown === "solutions" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/10"
                }`}
              >
                Solutions <ChevronDown size={12} className={`opacity-70 mt-px transition-transform ${activeDropdown === "solutions" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Integration Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter("integration")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  activeDropdown === "integration" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/10"
                }`}
              >
                Integration <ChevronDown size={12} className={`opacity-70 mt-px transition-transform ${activeDropdown === "integration" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Resources Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter("resources")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  activeDropdown === "resources" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/10"
                }`}
              >
                Resources <ChevronDown size={12} className={`opacity-70 mt-px transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>
            </div>

            <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
              Enterprise
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
              Pricing
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex px-4 py-2 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm">
            Request Demo
          </button>
          <Link
            href="/home"
            className="flex items-center px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm whitespace-nowrap"
            style={{ background: "#6c47ff" }}
          >
            Open App
          </Link>
        </div>

        {/* ── Mega-Menu: Product Dropdown ── */}
        {activeDropdown === "product" && (
          <div
            className="absolute top-[68px] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-gray-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMouseEnter("product")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Left 8 cols: 2 columns of products */}
              <div className="col-span-7 grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer">Desktop App</span>
                    <span className="text-[10px] font-bold bg-[#ede9fe] text-[#6c47ff] px-1.5 py-0.5 rounded-full uppercase">✦ NEW</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">Capture, summarize, and get real-time assistance with the Fireflies Desktop App.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Voice Agents</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate interviews, sales calls, and support conversations with Fireflies Voice Agents.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Personal Assistant</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Get a daily brief, prep for every meeting, and track every task.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Mobile App</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Record, transcribe, &amp; summarize in-person conversations directly from your phone.</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer">Email Assistant</span>
                    <span className="text-[10px] font-bold bg-[#ede9fe] text-[#6c47ff] px-1.5 py-0.5 rounded-full uppercase">✦ NEW</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">Your inbox triaged, replies drafted, and follow-ups tracked.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Chrome Extension</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Capture &amp; transcribe meetings and videos using Fireflies Chrome extension.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Fireflies AI Skills</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Supercharge your meetings with Fireflies apps.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">API</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Unlock endless possibilities for integration with Fireflies API.</p>
                </div>
              </div>

              {/* Right 5 cols: Live Assist Featured Card + Testimonial */}
              <div className="col-span-5 space-y-4">
                {/* Dark Live Assist Card */}
                <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #0d0b23 0%, #1c1538 100%)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block text-[10px] font-bold bg-[#6c47ff] text-white px-2 py-0.5 rounded-full mb-3 uppercase tracking-wide">
                        ✦ Just Arrived
                      </span>
                      <h4 className="text-lg font-bold mb-2">Introducing Live Assist</h4>
                      <p className="text-xs text-white/70 mb-4 leading-relaxed">
                        Get smart suggestions and real-time answers during your meeting.
                      </p>
                      <button className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/10">
                        Learn more
                      </button>
                    </div>

                    <div className="w-36 h-28 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src="/assets/images/fireflies-live-assist-card.png"
                        alt="Live Assist UI preview"
                        width={180}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Brian Testimonial Card */}
                <div className="rounded-2xl p-5 border border-purple-100 shadow-sm" style={{ background: "#f8f6ff" }}>
                  <p className="text-xs text-gray-700 italic leading-relaxed mb-3">
                    &ldquo;Live Assist is a lifesaving feature. It saves me probably 20 hours a week at a minimum in replay and research.&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/assets/images/testimonial-brian.png"
                      alt="Brian Fontenot"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Brian Fontenot</p>
                      <p className="text-[10px] text-gray-500">CEO of Zenith Capital Investments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mega-Menu: Solutions Dropdown ── */}
        {activeDropdown === "solutions" && (
          <div
            className="absolute top-[68px] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-gray-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMouseEnter("solutions")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Left 8 cols: 2 columns of 10 use cases */}
              <div className="col-span-7 grid grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Sales</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Fill out your CRM, train sales team, and close deals more quickly.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Recruiting</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Better candidate screening, smooth communication and collaboration.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Marketing</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Identify competitors, analyze sentiment, and successfully execute marketing initiatives.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Product &amp; User Research</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate notes for user interviews, usability tests, and research debriefs.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Venture Capital</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Capture pitches, get IC-ready summaries, and make your entire pipeline searchable.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Engineering</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate meeting notes, documentation, and follow-up actions.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Finance</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate client notes, simplify portfolio reviews, and stay compliant.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Healthcare</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate clinical notes, capture patient insights, and streamline compliance with Fireflies AI.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Podcasting</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Generate transcript and subtitles for your podcast, audio and video.</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-900 hover:text-[#6c47ff] cursor-pointer block mb-1">Real Estate</span>
                  <p className="text-xs text-gray-500 leading-relaxed">Automate client meeting notes, capture property discussions.</p>
                </div>
              </div>

              {/* Right 5 cols: Clara Customer Story Card */}
              <div className="col-span-5 flex flex-col justify-between rounded-2xl p-6 border border-purple-100 bg-[#faf9fe]">
                <div className="rounded-xl overflow-hidden mb-4 shadow-sm border border-purple-100 bg-white">
                  <Image
                    src="/assets/images/customer-story.webp"
                    alt="Clara Case Study"
                    width={400}
                    height={220}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug">
                  How Fireflies Helps Clara Minimize Additional Client Calls
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  We can move straight into offering solutions rather than wasting time doing another conference call.
                </p>
                <a href="#customer-story" className="text-xs font-semibold text-[#6c47ff] flex items-center gap-1.5 hover:underline">
                  Read customer story <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Mega-Menu: Integration Dropdown ── */}
        {activeDropdown === "integration" && (
          <div
            className="absolute top-[68px] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-gray-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMouseEnter("integration")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-4 gap-8">
              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Video Conferencing</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Zoom</li>
                  <li className="hover:text-gray-900 cursor-pointer">Google Meet</li>
                  <li className="hover:text-gray-900 cursor-pointer">Microsoft Teams</li>
                  <li className="hover:text-gray-900 cursor-pointer">Webex</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">CRM &amp; Sales</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Salesforce</li>
                  <li className="hover:text-gray-900 cursor-pointer">HubSpot</li>
                  <li className="hover:text-gray-900 cursor-pointer">Pipedrive</li>
                  <li className="hover:text-gray-900 cursor-pointer">Close CRM</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Collaboration</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Slack</li>
                  <li className="hover:text-gray-900 cursor-pointer">Notion</li>
                  <li className="hover:text-gray-900 cursor-pointer">Asana</li>
                  <li className="hover:text-gray-900 cursor-pointer">Trello</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Dialers &amp; Storage</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Aircall</li>
                  <li className="hover:text-gray-900 cursor-pointer">RingCentral</li>
                  <li className="hover:text-gray-900 cursor-pointer">Google Drive</li>
                  <li className="hover:text-gray-900 cursor-pointer">Dropbox</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Mega-Menu: Resources Dropdown ── */}
        {activeDropdown === "resources" && (
          <div
            className="absolute top-[68px] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-gray-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => handleMouseEnter("resources")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Learn</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Blog</li>
                  <li className="hover:text-gray-900 cursor-pointer">Guides &amp; Help Center</li>
                  <li className="hover:text-gray-900 cursor-pointer">Product Announcements</li>
                  <li className="hover:text-gray-900 cursor-pointer">Media Kit</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Community</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Fireflies Community</li>
                  <li className="hover:text-gray-900 cursor-pointer">Customer Case Studies</li>
                  <li className="hover:text-gray-900 cursor-pointer">Fireflies for Startups</li>
                  <li className="hover:text-gray-900 cursor-pointer">Partnership Program</li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-[#6c47ff] uppercase tracking-wider mb-3">Trust &amp; Security</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="hover:text-gray-900 cursor-pointer">Security Overview</li>
                  <li className="hover:text-gray-900 cursor-pointer">Trust Center (SOC 2, GDPR, HIPAA)</li>
                  <li className="hover:text-gray-900 cursor-pointer">Terms of Service</li>
                  <li className="hover:text-gray-900 cursor-pointer">Privacy Policy</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── 3. Hero Section ──────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative flex flex-col items-center text-center px-6 pt-20 pb-0 overflow-hidden"
      style={{ background: "#0d0b23" }}
    >
      {/* Dynamic Starry Sky */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: [
              "radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.7) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 75% 12%, rgba(255,255,255,0.6) 0%, transparent 100%)",
              "radial-gradient(1.5px 1.5px at 45% 45%, rgba(255,255,255,0.5) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 88% 72%, rgba(255,255,255,0.5) 0%, transparent 100%)",
              "radial-gradient(1.5px 1.5px at 23% 82%, rgba(255,255,255,0.6) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 60% 32%, rgba(255,255,255,0.4) 0%, transparent 100%)",
              "radial-gradient(1.5px 1.5px at 5% 48%, rgba(255,255,255,0.5) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 95% 35%, rgba(255,255,255,0.6) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "350px 350px, 600px 600px, 400px 400px, 500px 500px, 450px 450px, 300px 300px, 550px 550px, 480px 480px",
          }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6c47ff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-[44px] sm:text-[62px] md:text-[74px] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
          The #1 AI Assistant For
          <br />
          Your Meetings
        </h1>
        <p className="text-[17px] sm:text-[19px] text-white/60 mb-8 max-w-xl mx-auto leading-relaxed">
          Transcribe, summarize, search, and analyze all your team conversations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <Link
            href="/home"
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 shadow-lg shadow-[#6c47ff]/25"
            style={{ background: "#6c47ff" }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <button
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-white/90 font-medium text-base border border-white/20 hover:border-white/40 hover:bg-white/10 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Request Demo
          </button>
        </div>

        {/* G2 & Security Trust Capsule */}
        <div className="inline-flex items-center justify-center gap-4 text-xs sm:text-sm text-white/60 mb-12 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#ef4444] flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black">G</span>
            </div>
            <span className="text-white/80 font-medium">Rated 4.8 / 5</span>
            <div className="flex items-center gap-0.5 ml-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
          </div>
          <span className="w-px h-3.5 bg-white/20" />
          <div className="flex items-center gap-1.5 text-white/80">
            <Lock size={12} className="text-[#a78bfa]" />
            <span>GDPR, SOC2, More</span>
          </div>
        </div>

        {/* Authentic Desktop App Mockup */}
        <div className="relative mx-auto max-w-[1020px] px-2 sm:px-4">
          <div className="rounded-t-2xl overflow-hidden border-t border-x border-white/15 shadow-2xl bg-white">
            <Image
              src="/assets/images/hero-desktop.webp"
              alt="Fireflies.ai Meeting Dashboard"
              width={1100}
              height={700}
              className="w-full h-auto block"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #0d0b23)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ── 4. Company Logos Strip ───────────────────────────────────────────────────────

function CompanyLogos() {
  const logos = [
    { src: "/assets/logos/assembly-ai.png", alt: "AssemblyAI", w: 160, h: 32 },
    { src: "/assets/logos/emaar.png", alt: "EMAAR MISR", w: 120, h: 38 },
    { src: "/assets/logos/leonardo-ai.png", alt: "Leonardo.Ai", w: 140, h: 36 },
    { src: "/assets/logos/penn.png", alt: "University of Pennsylvania", w: 125, h: 36 },
  ];
  return (
    <section className="py-12 px-6" style={{ background: "#0d0b23" }}>
      <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-8">
        USED ACROSS <span className="text-[#a78bfa]">1 MILLION+</span> COMPANIES
      </p>
      <div className="flex items-center justify-center gap-12 sm:gap-16 flex-wrap max-w-4xl mx-auto">
        {logos.map(({ src, alt, w, h }) => (
          <div key={alt} className="opacity-50 hover:opacity-80 transition-opacity">
            <Image
              src={src}
              alt={alt}
              width={w}
              height={h}
              className="object-contain brightness-[10] invert"
              style={{ maxHeight: h }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 5. Feature: Transcription & Recording ────────────────────────────────────────

function FeatureTranscription() {
  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <h2 className="text-[34px] sm:text-[42px] font-extrabold leading-tight mb-5 text-gray-900">
            High Quality Meeting{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
            >
              Transcription &amp; Recording
            </span>
          </h2>
          <div className="mb-10">
            <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                icon: <Globe size={20} className="text-gray-600" />,
                stat: "95% Accurate",
                desc: "Fireflies is the industry leader in transcription accuracy.",
              },
              {
                icon: <Globe size={20} className="text-gray-600" />,
                stat: "100+ Languages",
                desc: "Transcribe meetings in English, Spanish, French, & several others.",
              },
              {
                icon: <Users size={20} className="text-gray-600" />,
                stat: "Speaker Recognition",
                desc: "Fireflies identifies different speakers in meetings and audio files.",
              },
              {
                icon: <Zap size={20} className="text-gray-600" />,
                stat: "Auto-Language Detection",
                desc: "Automatically switch languages from meeting to meeting with ease.",
              },
            ].map(({ icon, stat, desc }) => (
              <div key={stat} className="pt-2">
                <div className="mb-2.5">{icon}</div>
                <p className="text-base font-bold text-gray-900 mb-1">{stat}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authentic Transcript Recording Screenshot */}
        <div className="flex-1 max-w-[500px] w-full">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
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

// ── 6. Feature: Comprehensive AI Summaries (With Auto-Moving Scroll) ─────────────

const SUMMARY_TABS = ["Overview", "Bullet Points", "Action Items", "Custom Notes"] as const;

// Approximate scroll offsets to focus each section in ai-summary-canvas.webp
const SCROLL_OFFSETS = [0, 270, 580, 920];

function FeatureAISummaries() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Automatically cycle through the 4 tabs every 3.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SUMMARY_TABS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#0d0b23" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-10">
          <div>
            <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white leading-tight mb-4">
              Comprehensive{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}
              >
                AI Summaries
              </span>
            </h2>
            <p className="text-white/60 text-base max-w-md leading-relaxed">
              Get detailed notes, action items, and customized summaries instantly after every meeting.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* Auto-Cycling Tab Bar */}
        <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1">
          {SUMMARY_TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border whitespace-nowrap ${
                activeIdx === idx
                  ? "bg-[#6c47ff] text-white border-[#6c47ff] shadow-sm"
                  : "text-white/55 border-white/15 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Smooth Auto-Scrolling Summary Window */}
        <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-white relative">
          {/* Fixed Meeting Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-[#f9fafb] z-10 relative">
            <div className="flex items-center gap-2.5 text-xs text-gray-700">
              <span className="text-gray-400">#</span>
              <span className="font-semibold text-gray-800">Sales</span>
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-700">Kickoff Call – Fireflies.ai x Acme</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#22c55e] text-white uppercase">REC</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="hover:text-gray-900 cursor-pointer">Soundbite</span>
              <span className="px-2.5 py-1 rounded bg-[#6c47ff] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                Share
              </span>
            </div>
          </div>

          {/* Viewport that scrolls the document content automatically */}
          <div className="h-[460px] overflow-hidden relative bg-white px-8 pt-4">
            <div
              style={{
                transform: `translateY(-${SCROLL_OFFSETS[activeIdx]}px)`,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Image
                src="/assets/images/ai-summary-canvas.webp"
                alt="Fireflies AI summaries auto-scrolling canvas"
                width={1100}
                height={1400}
                className="w-full h-auto block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 7. Feature: Capture Meetings Anywhere & Anytime ──────────────────────────────

function FeatureCaptureAnywhere() {
  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 leading-tight mb-14 max-w-xl">
          Capture Meetings{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
          >
            Anywhere &amp; Anytime
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: AI Note Taker Bot */}
          <div className="rounded-3xl overflow-hidden border border-[#ede9fe] p-8 flex flex-col justify-between" style={{ background: "#f6f4fe" }}>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Note Taker Bot</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Invite fred@fireflies.ai to a live meeting or have it autojoin your calendar meetings to record,
                transcribe, and summarize.
              </p>
            </div>
            
            {/* Visual Bot Preview */}
            <div className="rounded-2xl overflow-hidden border border-purple-100 bg-white shadow-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">31</div>
                  <span>Sales Demo</span>
                  <span className="text-gray-400 font-normal">Janice, +2</span>
                </div>
                <div className="w-8 h-4.5 rounded-full bg-[#6c47ff] flex items-center justify-end px-0.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden h-36 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2b1f4d 0%, #17112c 100%)" }}>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #ff4f8b 0%, #6c47ff 100%)" }}>
                    <span className="text-white font-bold text-xl">f</span>
                  </div>
                  <span className="text-white/80 text-xs font-medium">Janice's Fireflies.ai Notetaker</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Chrome Extension */}
          <div className="rounded-3xl overflow-hidden border border-[#fef3c7] p-8 flex flex-col justify-between" style={{ background: "#fffdf5" }}>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chrome Extension</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Automatically record your Google Meet calls and{" "}
                <span className="text-[#6c47ff] underline underline-offset-2 cursor-pointer">get real-time transcripts</span>.
              </p>
            </div>

            {/* Visual Extension Preview */}
            <div className="rounded-2xl overflow-hidden border border-amber-100 bg-white shadow-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">31</div>
                  <span>Sales Demo</span>
                  <span className="text-red-500 font-semibold">• 02:14</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e] text-white uppercase tracking-wider">
                  Transcribing
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden h-36 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2239 100%)" }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-blue-400">
                    M
                  </div>
                  <span className="text-white/80 text-xs font-medium">Michael Hines</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Columns Sub-features with Real Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800 shadow-sm">
                <AppleLogo className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
                <GooglePlayLogo className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">Mobile App</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transcribe and summarize in-person conversation with the{" "}
              <a href="#" className="underline text-gray-700 hover:text-[#6c47ff]">Fireflies mobile app</a>.
            </p>
          </div>

          <div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm mb-3" style={{ background: "linear-gradient(135deg, #ff4f8b, #6c47ff)" }}>
              f
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">Desktop App</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transcribe and summarize your calls with the{" "}
              <a href="#" className="underline text-gray-700 hover:text-[#6c47ff]">Fireflies desktop app</a>.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm p-1.5">
                <Image src="/assets/logos/aircall.svg" alt="Aircall" width={20} height={20} className="w-full h-full object-contain" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
                <RingCentralLogo className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1.5">Dialers &amp; API</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transcribe calls from Aircall, Ringcentral and other dialers or use our{" "}
              <a href="#" className="underline text-gray-700 hover:text-[#6c47ff]">API</a> to process audio files.
            </p>
          </div>
        </div>

        {/* Centered Upload Icon */}
        <div className="flex justify-center mt-12">
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors cursor-pointer shadow-sm">
            <UploadCloud size={18} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 8. Feature: AI Powered Search (With Fred Bot Icon) ───────────────────────────

function FeatureSearch() {
  return (
    <section className="px-6 md:px-16 py-24 text-center" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[34px] sm:text-[46px] font-extrabold text-gray-900 leading-tight mb-3">
          <span className="text-[#6c47ff]">Remember</span> Every Conversation
          <br />
          With <span className="text-[#6c47ff]">AI Powered Search</span>
        </h2>
        <p className="text-gray-500 mb-14 text-base max-w-lg mx-auto">
          Fireflies gives you perfect memory after every conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1: Meeting Search */}
          <div className="rounded-3xl border border-purple-100 p-7 shadow-sm" style={{ background: "#faf8ff" }}>
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-purple-100 shadow-sm mb-6">
              <Search size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">Design</span>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">M</div>
                    <span className="text-sm font-bold text-gray-800">Design Team Sync</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#6c47ff] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    14 matches
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 pl-9">Matt · May 15</p>
                <div className="space-y-2 pl-9 text-xs text-gray-600 leading-relaxed border-l-2 border-purple-200">
                  <p>
                    &ldquo;..So you look for this <mark className="bg-purple-100 text-[#6c47ff] font-semibold px-1 rounded">design</mark> sync meeting in this particular...&rdquo;
                  </p>
                  <p>
                    &ldquo;...for let&apos;s say <mark className="bg-purple-100 text-[#6c47ff] font-semibold px-1 rounded">design team</mark> and their tasks..&rdquo;
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center">R</div>
                  <span className="text-sm font-bold text-gray-800">Roadmap Planning</span>
                </div>
                <p className="text-xs text-gray-400 pl-9 mb-2">Matt · May 15</p>
                <div className="pl-9 space-y-1.5 opacity-40">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: AskFred */}
          <div className="rounded-3xl border border-emerald-100 p-7 shadow-sm" style={{ background: "#f3fcf7" }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FredRobotIcon className="w-5 h-5" />
                  <span className="text-xs font-bold text-gray-800">AskFred</span>
                </div>
                <button className="text-xs text-gray-500 font-medium flex items-center gap-1 hover:text-gray-800">
                  GPT-4o <ChevronDown size={11} />
                </button>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                  Y
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-0.5">You</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    What did Sam say about the updated pricing for Facebook ads?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <FredRobotIcon className="w-7 h-7 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-0.5">AskFred</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Sam said, new Facebook ad pricing is more competitive, but CPC has slightly increased.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/50">
                <Sparkles size={14} className="text-[#6c47ff] shrink-0" />
                <input
                  className="flex-1 text-xs text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
                  placeholder="Ask anything..."
                  readOnly
                />
                <div className="w-6 h-6 rounded-lg bg-[#6c47ff] flex items-center justify-center cursor-pointer shadow-sm">
                  <ArrowRight size={12} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 9. Feature: Live Assist Banner Card ──────────────────────────────────────────

function FeatureLiveAssist() {
  return (
    <section className="px-6 md:px-16 py-10" style={{ background: "#0d0b23" }}>
      <div className="max-w-6xl mx-auto">
        {/* Desktop View: Pristine authentic Live Assist graphic card matching Fireflies.ai */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 hidden md:block">
          <Image
            src="/assets/images/live-assist-banner.png"
            alt="Get Real-Time Suggestions, Coaching, And Answers During Meetings - Fireflies Live Assist"
            width={1200}
            height={450}
            className="w-full h-auto block"
            priority
          />
          {/* Clickable link over the Explore Live Assist button */}
          <Link
            href="/home"
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[220px] h-[52px] rounded-xl cursor-pointer"
            aria-label="Explore Live Assist"
          />
        </div>

        {/* Mobile View: Clean dark card with no overlapping graphics */}
        <div className="rounded-3xl p-8 text-center md:hidden border border-white/10" style={{ background: "#000000" }}>
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
              <Image src="/assets/logos/zoom.svg" alt="Zoom" width={20} height={20} className="w-full h-full object-contain" />
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
              <Image src="/assets/logos/google-meet.svg" alt="Google Meet" width={20} height={20} className="w-full h-full object-contain" />
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
              <Image src="/assets/logos/ms-teams.svg" alt="Microsoft Teams" width={20} height={20} className="w-full h-full object-contain" />
            </div>
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
              <Image src="/assets/logos/slack.svg" alt="Slack" width={20} height={20} className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-[24px] font-extrabold text-white mb-3 leading-tight">
            Get Real-Time Suggestions, Coaching, And Answers During Meetings.
          </h2>
          <p className="text-white/70 mb-6 text-xs leading-relaxed max-w-sm mx-auto">
            Meet the new Live Assist that can provide real-time suggestions, coaching, and answers during your
            meetings.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-xs transition-all hover:opacity-90"
            style={{ background: "#6c47ff" }}
          >
            Explore Live Assist <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── 10. Feature: Conversation Intelligence ───────────────────────────────────────

function FeatureConvIntelligence() {
  const [openIdx, setOpenIdx] = useState(0);

  const items = [
    {
      title: "Speaker Talk-time",
      desc: "Automatically track each participant's speaking time and easily monitor participation in meetings.",
      img: "/assets/images/speaker-talktime.webp",
    },
    {
      title: "AI Filters",
      desc: "Filter transcripts by questions, tasks, dates, metrics, and more to quickly find what you need.",
      img: "/assets/images/ai-filters.webp",
    },
    {
      title: "Sentiment Analysis",
      desc: "Track emotional tone and trends across meetings to understand team and customer dynamics.",
      img: "/assets/images/sentiment-analysis.webp",
    },
    {
      title: "Topic Trackers",
      desc: "Monitor recurring themes across all your team conversations automatically.",
      img: "/assets/images/topic-trackers.webp",
    },
  ];

  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Accordion Left */}
        <div className="flex-1 w-full">
          <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 leading-tight mb-4">
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
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {items.map((item, i) => (
              <div key={item.title}>
                <button
                  onClick={() => setOpenIdx(i)}
                  className="w-full flex items-center justify-between py-4 text-left font-semibold text-base transition-colors"
                >
                  <span className={openIdx === i ? "text-[#6c47ff]" : "text-gray-900"}>
                    {item.title}
                  </span>
                  {openIdx === i ? (
                    <ChevronUp size={16} className="text-[#6c47ff] shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openIdx === i && (
                  <p className="pb-4 text-sm text-gray-500 leading-relaxed pr-6">{item.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic High-Res Screenshot Right */}
        <div className="flex-1 max-w-[480px] w-full">
          <div className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-white">
            <Image
              src={items[openIdx].img}
              alt={items[openIdx].title}
              width={600}
              height={550}
              className="w-full h-auto block transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 11. Feature: Tasks, Contacts, & Knowledge ────────────────────────────────────

function FeatureTasks() {
  const [activeTab, setActiveTab] = useState<"Tasks" | "Contacts" | "Feed">("Tasks");

  return (
    <section className="relative px-6 md:px-16 py-24 overflow-hidden" style={{ background: "#120b2e" }}>
      {/* Stars Dust */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: [
              "radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.6) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.5) 0%, transparent 100%)",
              "radial-gradient(1.5px 1.5px at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "300px 300px, 400px 400px, 250px 250px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[34px] sm:text-[44px] font-extrabold text-white leading-tight mb-3">
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
            <p className="text-white/60 text-base max-w-md leading-relaxed">
              Understand what's happening across the company and what your team needs to get done.
            </p>
          </div>
          <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          {(["Tasks", "Contacts", "Feed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === tab
                  ? "bg-white text-gray-900 border-white shadow-md"
                  : "text-white/60 border-white/20 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Display Canvas with authentic screenshot */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <Image
            src={
              activeTab === "Tasks"
                ? "/assets/images/tasks-desktop.webp"
                : activeTab === "Contacts"
                ? "/assets/images/contacts-desktop.webp"
                : "/assets/images/feed-desktop.webp"
            }
            alt={`${activeTab} view`}
            width={1000}
            height={620}
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
}

// ── 12. Feature: 300+ AI Skills ──────────────────────────────────────────────────

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
  const TABS = [
    "Sales", "Recruiting", "Marketing", "User Research", "Engineering",
    "Finance", "Healthcare", "Media & Podcasting", "Venture Capital"
  ];
  const [activeTab, setActiveTab] = useState("Sales");
  const skills = AI_SKILLS[activeTab] || AI_SKILLS.Sales;
  const useCaseImg = USE_CASE_IMAGES[activeTab] || USE_CASE_IMAGES.Sales;

  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 leading-tight mb-3">
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

        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activeTab === tab
                  ? "bg-[#6c47ff] text-white border-[#6c47ff] shadow-sm"
                  : "text-gray-600 border-gray-200 hover:border-gray-400 bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two-column Layout: Image left, Apps list right */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex-1 max-w-xl w-full">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <Image
                src={useCaseImg}
                alt={`${activeTab} use case`}
                width={800}
                height={560}
                className="w-full h-auto block"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm bg-white">
              {skills.map(({ name, desc, color }) => (
                <div
                  key={name}
                  className="flex items-center gap-4 px-6 py-4.5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shrink-0 shadow-sm"
                    style={{ background: color }}
                  >
                    ✦
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Create New Prompt */}
              <div className="flex items-center gap-4 px-6 py-4.5" style={{ background: "#f6fdf9" }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#22c55e] text-sm shrink-0"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px dashed #22c55e" }}
                >
                  ✦
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">Create New</p>
                  <p className="text-xs text-gray-500 mt-0.5">Add prompts to tailor meeting summaries to fit your needs.</p>
                </div>
                <span className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white shrink-0 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
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

// ── 13. Feature: Fireflies MCP (With Real Autoplaying Video) ──────────────────────

function FeatureMCP() {
  return (
    <section className="px-6 md:px-16 pb-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center gap-12 border border-purple-100 shadow-sm"
          style={{ background: "#f6f4fe" }}
        >
          <div className="flex-1">
            {/* Real Claude, Devin, ChatGPT Logos */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm p-1.5" title="Claude AI">
                <ClaudeLogo className="w-5 h-5" />
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm p-1.5" title="Devin AI">
                <DevinLogo className="w-5 h-5" />
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm p-1.5" title="ChatGPT">
                <OpenAILogo className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e] text-white ml-2 uppercase tracking-wide">
                New
              </span>
            </div>
            <h2 className="text-[30px] sm:text-[38px] font-extrabold text-gray-900 leading-tight mb-4">
              Meeting Intelligence With{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
              >
                Fireflies MCP
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Fireflies MCP Server lets you bring meeting insights into your AI tools like Claude, Devin, and
              ChatGPT in one click.
            </p>
          </div>

          {/* Autoplaying Animated Video from Downloads/MCP.m4v */}
          <div className="w-full md:w-[440px] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white bg-black">
            <video
              src="/assets/videos/mcp.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 14. Feature: Integrations ────────────────────────────────────────────────────

function FeatureIntegrations() {
  return (
    <section className="relative px-6 md:px-16 py-24 overflow-hidden" style={{ background: "#0d0b23" }}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[32px] sm:text-[44px] font-extrabold text-white mb-12 leading-tight">
          Integrate Fireflies With Your{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #7c5aff, #b08fff)" }}
          >
            Favorite Work Tools
          </span>
        </h2>

        {/* Authentic Integration Mockup with Floating Tool Badges */}
        <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/assets/images/integration-mockup-desktop.webp"
            alt="Fireflies Tool Integrations"
            width={1100}
            height={600}
            className="w-full h-auto block mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

// ── 15. Feature: Enterprise Security ─────────────────────────────────────────────

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
      icon: <Lock size={20} />,
      title: "Customer Own Their Data",
      desc: "You maintain full control and ownership of your data, explicitly stated in our Term of Service.",
      bg: "#d97706",
    },
  ];

  const moreFeatures = [
    { icon: <Sliders size={20} />, title: "Expand Summary Notes", desc: "Expand specific summary bullet points for additional context and details." },
    { icon: <Download size={20} />, title: "Download Meetings", desc: "Easily download summary, transcript, meeting audio or video." },
    { icon: <Volume2 size={20} />, title: "Soundbites", desc: "Clip out important moments from calls into easily shareable audio snippets." },
    { icon: <Hash size={20} />, title: "Channels", desc: "Organize your team meetings into different channels." },
    { icon: <Users size={20} />, title: "User Groups", desc: "Create different user groups for different teams to easily share meetings." },
    { icon: <MessageSquare size={20} />, title: "Comments & Bookmarks", desc: "Leave time-stamped comments or bookmark action items, important moments, etc." },
  ];

  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Security Badges */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 leading-tight">
                Enterprise-Grade{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #6c47ff, #9c6dff)" }}
                >
                  Security
                </span>
              </h2>
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-gray-600 max-w-2xl text-base leading-relaxed">
              Fireflies is the preferred platform for CIOs across the Fortune 500, offering robust admin controls
              and stringent security protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PurpleArrowBtn href="/home">Get Started</PurpleArrowBtn>
          </div>
        </div>

        {/* Security Compliance Badges */}
        <div className="flex items-center gap-6 mb-14 flex-wrap">
          <div className="h-14 px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-2 bg-gray-50/50">
            <Image src="/assets/images/badge-soc2.png" alt="SOC2 Type II Certified" width={110} height={36} className="h-8 w-auto object-contain" />
          </div>
          <div className="h-14 px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-2 bg-gray-50/50">
            <Image src="/assets/images/badge-gdpr.png" alt="GDPR Compliant" width={80} height={36} className="h-8 w-auto object-contain" />
          </div>
          <div className="h-14 px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-2 bg-gray-50/50">
            <Image src="/assets/images/badge-hipaa.png" alt="HIPAA Compliant" width={90} height={36} className="h-8 w-auto object-contain" />
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {securityFeatures.map(({ icon, title, desc, bg }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-100 bg-[#fbfbfd]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white shadow-sm"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <p className="text-base font-bold text-gray-900 mb-2">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            ...and many more capabilities
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {moreFeatures.map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="mb-3 text-gray-600">{icon}</div>
              <p className="text-sm font-bold text-gray-900 mb-1.5">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 16. Testimonials ─────────────────────────────────────────────────────────────

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
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 mb-3">
          Don't Take Our Word For It
        </h2>
        <p className="text-gray-500 mb-14 text-base">
          See why thousands of organizations are switching to Fireflies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {TESTIMONIALS.map(({ name, role, photo, quote }) => (
            <div
              key={name}
              className="p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
              style={{ background: "#fcfcff" }}
            >
              <div className="flex items-center gap-3.5 mb-6">
                <Image
                  src={photo}
                  alt={name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 17. FAQ Accordion ────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is Fireflies AI Assistant?",
    a: "Fireflies.ai is an AI meeting assistant that automatically records, transcribes, and summarizes your team meetings across video conferencing platforms.",
  },
  {
    q: "How is Fireflies different from a regular AI notetaker?",
    a: "Fireflies does far more than just transcription. It provides conversation intelligence, action item extraction, integration with 40+ work tools, and custom AI apps to fit your workflows.",
  },
  {
    q: "What are AI Skills?",
    a: "AI Skills are specialized prompt modules that automatically extract role-tailored intelligence such as BANT sales qualifications, candidate scorecards, and bug reports from meetings.",
  },
  {
    q: "What are Voice Agents?",
    a: "Voice Agents allow you to interact conversationally with your meeting repository, enabling hands-free querying and knowledge retrieval.",
  },
  {
    q: "Does Fireflies work with the tools I already use?",
    a: "Yes! Fireflies integrates seamlessly with Zoom, Google Meet, Microsoft Teams, Slack, Salesforce, HubSpot, Notion, Asana, and over 40 other business platforms.",
  },
  {
    q: "Does Fireflies connect with Claude or other AI tools?",
    a: "Yes, via our official Fireflies MCP Server you can query meeting knowledge directly inside Claude, Devin, and ChatGPT.",
  },
  {
    q: "Is my data safe with Fireflies?",
    a: "Absolutely. Fireflies is SOC 2 Type II certified, GDPR and HIPAA compliant, and operates with zero data retention for model training.",
  },
  {
    q: "Does Fireflies record without people knowing?",
    a: "No. Fireflies clearly identifies itself as a participant (Fred) and supports visual and verbal recording notifications to ensure all participants are informed.",
  },
  {
    q: "What languages does Fireflies support?",
    a: "Fireflies supports transcription in over 100 languages including English, Spanish, French, German, Japanese, Portuguese, and Mandarin.",
  },
  {
    q: "Can I use Fireflies for free?",
    a: "Yes! Fireflies offers a generous free tier with unlimited transcription credits and 800 minutes of storage.",
  },
  {
    q: "How does Fireflies handle enterprise teams?",
    a: "Enterprise plans provide dedicated account managers, custom data retention rules, private storage, SSO, and centralized user management.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="px-6 md:px-16 py-24" style={{ background: "#ffffff" }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[34px] sm:text-[44px] font-extrabold text-gray-900 text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200 mb-12">
          {FAQS.map(({ q, a }, idx) => (
            <div key={q}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between py-5 text-left text-base font-semibold text-gray-900 hover:text-[#6c47ff] transition-colors"
              >
                <span>{q}</span>
                <span className="text-xl text-gray-400 font-light ml-4 shrink-0">
                  {openIdx === idx ? "−" : "+"}
                </span>
              </button>
              {openIdx === idx && (
                <p className="pb-5 text-sm text-gray-500 leading-relaxed pr-8">{a}</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500">
          Still have more questions? Please write to{" "}
          <a href="mailto:support@fireflies.ai" className="text-[#6c47ff] font-semibold underline underline-offset-2">
            support@fireflies.ai
          </a>{" "}
          and we will respond as quickly as we can.
        </p>
      </div>
    </section>
  );
}

// ── 18. CTA Section ──────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative px-6 py-28 text-center overflow-hidden" style={{ background: "#0d0b23" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: [
              "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.6) 0%, transparent 100%)",
              "radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,0.5) 0%, transparent 100%)",
              "radial-gradient(1.5px 1.5px at 85% 55%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            ].join(", "),
            backgroundSize: "400px 400px, 600px 600px, 500px 500px",
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-25 rounded-full"
          style={{ background: "radial-gradient(circle, #6c47ff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-[34px] sm:text-[48px] font-extrabold text-white mb-6 leading-tight">
          Unlock The Knowledge Buried Inside Your Conversations
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <Link
            href="/home"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 shadow-lg shadow-[#6c47ff]/25"
            style={{ background: "#6c47ff" }}
          >
            Try Fireflies For Free
          </Link>
          <button
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white/90 font-medium text-base border border-white/20 hover:border-white/40 hover:bg-white/10 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}

// ── 19. Footer ───────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      "Features", "Notetaker", "AI Assistant", "Daily Brief", "Email Assistant",
      "Live Assist", "Voice Agents", "Slack Assistant", "Conversation intelligence",
      "Chrome Extension", "AI Skills Store", "API", "Pricing", "Security",
      "Trust Center (SOC2, HIPAA, GDPR)",
    ],
  },
  {
    heading: "Use Cases",
    links: [
      "Sales", "Recruiting", "Marketing", "Product & User Research", "Collaboration",
      "Engineering", "Venture Capital", "Healthcare", "Podcasting", "Real Estate",
    ],
  },
  {
    heading: "Integrations",
    links: [
      "All integrations", "Video conferencing", "Audio recording", "CRM", "Dialers",
      "Collaboration", "Storage",
    ],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Partnership", "HIPAA", "Terms of Service", "Privacy Policy"],
    sub: {
      heading: "Learn",
      links: [
        "Guide | Help center", "Fireflies Community", "Blog", "Product Announcements",
        "Customers", "Fireflies for Startups", "Media kit",
      ],
    },
  },
  {
    heading: "Download",
    hasQR: true,
    links: ["Desktop App", "iOS App", "Android App", "Chrome Extension"],
    sub: {
      heading: "Contact & Help",
      links: ["Report bug", "Help Center", "Contact us"],
    },
  },
];

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-16 border-t border-white/10 text-white" style={{ background: "#05050a" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {FOOTER_COLS.map(({ heading, links, sub, hasQR }) => (
            <div key={heading}>
              <p className="text-xs font-bold text-white mb-4 uppercase tracking-wider">{heading}</p>
              
              {hasQR && (
                <div className="mb-5 bg-white p-2 rounded-xl inline-block shadow-md">
                  <Image
                    src="/assets/images/download-qr-code.png"
                    alt="Download Fireflies App"
                    width={110}
                    height={110}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              )}

              <ul className="space-y-2.5 mb-6">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-white/50 hover:text-white transition-colors leading-relaxed block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>

              {sub && (
                <>
                  <p className="text-xs font-bold text-white mb-3 mt-6 uppercase tracking-wider">{sub.heading}</p>
                  <ul className="space-y-2.5">
                    {sub.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-xs text-white/50 hover:text-white transition-colors leading-relaxed block">
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
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ background: "linear-gradient(135deg, #ff4f8b, #6c47ff)" }}
            >
              f
            </div>
            <span className="text-white/60 text-sm font-semibold">fireflies.ai</span>
          </div>
          <p className="text-xs text-white/35">© 2026 Fireflies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── 20. Cookie Privacy Banner & Floating Chat ────────────────────────────────────

function PrivacyBannerAndChat() {
  const [accepted, setAccepted] = useState(false);

  return (
    <>
      {!accepted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl"
          style={{ background: "rgba(10, 10, 15, 0.98)" }}
        >
          <div className="text-left max-w-3xl">
            <p className="text-sm font-bold text-white mb-0.5">Your privacy</p>
            <p className="text-xs text-white/60 leading-relaxed">
              Store cookies to enhance your experience, improve navigation, analyze site usage, and assist in
              delivering content that's more relevant to you.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAccepted(true)}
              className="px-4 py-2 rounded-lg border border-white/20 text-white/80 text-xs font-medium hover:border-white/40 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              Preference
            </button>
            <button
              onClick={() => setAccepted(true)}
              className="px-5 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 shadow-sm"
              style={{ background: "#6c47ff" }}
            >
              Accept all cookies
            </button>
          </div>
        </div>
      )}

      {/* Floating Purple Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
          style={{ background: "#6c47ff" }}
          aria-label="Chat with us"
        >
          <MessageCircle size={22} />
        </button>
      </div>
    </>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#6c47ff] selection:text-white" style={{ background: "#0d0b23" }}>
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
      <PrivacyBannerAndChat />
    </div>
  );
}
