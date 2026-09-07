"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    const d = localStorage.getItem("ff-trial-banner-dismissed");
    if (!d) setDismissed(false);
  }, []);

  function dismiss() {
    localStorage.setItem("ff-trial-banner-dismissed", "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6c47ff] text-white text-xs relative">
      <span>You are eligible for 7 days business plan free trial.</span>
      <button className="font-semibold hover:opacity-80 transition-opacity flex items-center gap-1">
        Start free trial →
      </button>
      <button
        onClick={dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
