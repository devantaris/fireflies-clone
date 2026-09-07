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
            background: "#1a1a1a",
            color: "#f0f0f0",
            border: "1px solid #2e2e2e",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#1a1a1a" } },
        }}
      />
    </>
  );
}
