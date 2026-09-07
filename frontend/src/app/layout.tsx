import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "@/components/layout/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fireflies — Meeting Transcripts & AI Notes",
  description: "AI-powered meeting transcription, summaries, and action items",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="h-full bg-[#0f0f0f] text-[#f0f0f0] flex">
        <Providers>
          <Sidebar />
          <main className="flex-1 min-w-0 h-full overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
