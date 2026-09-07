"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, width = "max-w-lg" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={`w-full ${width} bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-strong)] shrink-0">
          <h2 className="text-base font-semibold text-[var(--text-1)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border-strong)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
