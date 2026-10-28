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
      <body className="flex min-h-screen flex-col font-sans bg-slate-50/50 text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-slate-200 bg-white py-8 text-center text-xs font-bold text-slate-700 shadow-2xs">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
            <p className="text-slate-900 font-extrabold">© 2026 SkillProof. All rights reserved. Verifiable Skills Infrastructure.</p>
            <div className="flex gap-6 text-slate-700">
              <span className="hover:text-blue-600 cursor-pointer font-bold transition-colors">Security Policy</span>
              <span className="hover:text-blue-600 cursor-pointer font-bold transition-colors">Verification Protocol</span>
              <span className="hover:text-blue-600 cursor-pointer font-bold transition-colors">Privacy Notice</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
