"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">SkillProof</span>
            <span className="text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
              Verified Skills Passport
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/assessments" className="transition-colors hover:text-blue-700">
            Assessment Catalogue
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-blue-700">
            How It Works
          </Link>
          <Link href="/verify/demo" className="transition-colors hover:text-blue-700">
            Verify a Credential
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="rounded-md px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-input text-slate-700 md:hidden hover:text-blue-700"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-800">
            <Link
              href="/assessments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-700 transition-colors"
            >
              Assessment Catalogue
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-700 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/verify/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-700 transition-colors"
            >
              Verify a Credential
            </Link>
            <div className="my-2 border-t border-border pt-4 flex flex-col gap-2">
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-md border border-input py-2 text-sm font-semibold text-slate-900 hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}