"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileCheck2,
  Award,
  User,
  Compass,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/actions/auth";

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<{ fullName: string; role: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        setUserProfile({
          fullName: profile?.full_name || (user.user_metadata?.full_name as string) || "SkillProof User",
          role: profile?.role || (user.user_metadata?.role as string) || "candidate",
        });
      } else {
        setUserProfile({
          fullName: "Alex Rivera",
          role: "candidate",
        });
      }
    };
    loadUser();
  }, []);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Submissions", href: "/dashboard/submissions", icon: FileCheck2 },
    { name: "Skills Passport", href: "/dashboard/credentials", icon: Award },
    { name: "Candidate Profile", href: "/dashboard/profile", icon: User },
    { name: "Assessment Catalogue", href: "/assessments", icon: Compass },
  ];

  const isEvaluator = userProfile?.role === "evaluator" || userProfile?.role === "admin";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-300 dark:border-slate-800 bg-card p-4">
        {/* Candidate Profile Snippet */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-6 shadow-2xs">
          <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary shrink-0 overflow-hidden">
            {userProfile?.fullName ? userProfile.fullName.substring(0, 2).toUpperCase() : "SP"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-foreground truncate">{userProfile?.fullName || "Candidate"}</p>
            <div className="inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[11px] font-black text-blue-900 dark:text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-700" /> {userProfile?.role || "candidate"}
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-600"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role-Aware Shortcuts & Sign Out */}
        <div className="border-t border-slate-200 pt-4 mt-auto space-y-2">
          {/* Only display Evaluator shortcut if user has evaluator permissions */}
          {isEvaluator && (
            <Link
              href="/evaluator"
              className="flex items-center justify-between text-xs font-bold text-indigo-950 bg-indigo-50 border border-indigo-300 rounded-lg p-3 hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              <span>Evaluator Workspace</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-2 rounded-lg p-2.5 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden border-b border-border bg-card px-4 py-2.5 flex items-center gap-2 overflow-x-auto shadow-2xs">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-bold ${
                  isActive ? "bg-primary text-white" : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
