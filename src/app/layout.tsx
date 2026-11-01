import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frame Diary",
  description: "Track films you've watched. Save those you want to see. Tell your friends what's good.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-canvas text-text-primary relative selection:bg-primary/25 selection:text-primary`}
      >
        <AuthProvider>
          {/* Lightweight Ambient Background Pattern */}
          <div className="cinema-pattern" aria-hidden="true">
            <div className="cinema-pattern-glow-top" />
            <div className="cinema-pattern-glow-bottom" />
            <div className="cinema-pattern-dots" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
