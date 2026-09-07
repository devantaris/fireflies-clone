"use client";

import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <div className="p-6 space-y-5">
        <p className="text-sm text-[var(--text-2)]">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--border-strong)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-[#6c47ff] hover:bg-[#7c5aff]"
            }`}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
