import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { UserProvider } from "@/components/layout/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fireflies — Meeting Transcripts & AI Notes",
  description: "AI-powered meeting transcription, summaries, and action items",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

// Inline script runs before paint to avoid light→dark flash for returning dark-mode users
const themeScript = `
  (function(){
    try{
      var t=localStorage.getItem('ff-theme')||'light';
      if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
        document.documentElement.classList.add('dark');
      }
    }catch(e){}
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable}>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text-1)" }}>
        <ThemeProvider>
          <UserProvider>
            <Providers>
              <LayoutShell>{children}</LayoutShell>
            </Providers>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
