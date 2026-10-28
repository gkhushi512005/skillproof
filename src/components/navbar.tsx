"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, Menu, X, ArrowRight, User, LogOut, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; role?: string; fullName?: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const supabase = createClient();

      // Check initial session
      const fetchUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Query profile for role & full name
            const { data: profile } = await supabase
              .from("profiles")
              .select("role, full_name")
              .eq("id", user.id)
              .single();

            setUser({
              email: user.email,
              role: profile?.role || (user.user_metadata?.role as string) || "candidate",
              fullName: profile?.full_name || (user.user_metadata?.full_name as string) || "User",
            });
          } else {
            setUser(null);
          }
        } catch (e) {
          console.warn("Navbar auth fetch failed:", e);
        }
      };

      fetchUser();

      // Listen for auth state changes
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email,
            role: (session.user.user_metadata?.role as string) || "candidate",
            fullName: (session.user.user_metadata?.full_name as string) || "User",
          });
        } else {
          setUser(null);
        }
      });
      subscription = data.subscription;
    } catch (e) {
      console.warn("Navbar Supabase init error:", e);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const dashboardHref = user?.role === "evaluator" ? "/evaluator" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-950">SkillProof</span>
            <span className="text-[10px] font-extrabold tracking-wide text-blue-700 uppercase">
              Verified Skills Passport
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-extrabold text-slate-900">
          <Link href="/assessments" className="transition-colors hover:text-blue-600">
            Assessment Catalogue
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-blue-600">
            How It Works
          </Link>
          <Link href="/verify/demo" className="transition-colors hover:text-blue-600">
            Verify a Credential
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isClient && user ? (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100">
                {user.role === "evaluator" ? (
                  <span className="flex items-center gap-1 text-indigo-700">
                    <Award className="h-3.5 w-3.5" /> Evaluator
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-blue-700">
                    <User className="h-3.5 w-3.5" /> Candidate
                  </span>
                )}
              </Badge>

              <Link href={dashboardHref}>
                <Button size="sm" className="font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-xs">
                  Go to {user.role === "evaluator" ? "Evaluator Queue" : "Dashboard"}
                </Button>
              </Link>

              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-slate-700 hover:text-rose-700"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="rounded-md px-3.5 py-2 text-sm font-extrabold text-slate-900 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-900 md:hidden hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col gap-2 pt-3 text-sm font-extrabold text-slate-900">
            <Link
              href="/assessments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-600 transition-colors"
            >
              Assessment Catalogue
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/verify/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-blue-600 transition-colors"
            >
              Verify a Credential
            </Link>

            <div className="my-2 border-t border-slate-200 pt-4 flex flex-col gap-2">
              {isClient && user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-extrabold text-white shadow-xs"
                  >
                    Go to {user.role === "evaluator" ? "Evaluator Queue" : "Dashboard"}
                  </Link>
                  <form action={signOutAction} className="w-full">
                    <button
                      type="submit"
                      className="w-full text-center rounded-md border border-rose-300 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"
                    >
                      Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-md border border-slate-300 py-2 text-sm font-extrabold hover:bg-slate-100 text-slate-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-md bg-blue-600 py-2 text-sm font-extrabold text-white shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
