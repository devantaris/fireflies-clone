"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-1)",
            border: "1px solid var(--border-strong)",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "var(--bg-elevated)" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "var(--bg-elevated)" } },
        }}
      />
    </>
  );
}
