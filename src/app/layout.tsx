import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SkillProof — Prove Your Skills. Build Trust.",
  description:
    "A verified skills passport platform where candidates demonstrate practical ability, receive human rubric-based evaluations, and share tamper-evident credentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-card/50 py-8 text-center text-xs text-muted-foreground">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
            <p>© 2026 SkillProof. All rights reserved. Verifiable Skills Infrastructure.</p>
            <div className="flex gap-6">
              <span className="hover:text-foreground cursor-pointer">Security Policy</span>
              <span className="hover:text-foreground cursor-pointer">Verification Protocol</span>
              <span className="hover:text-foreground cursor-pointer">Privacy Notice</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
