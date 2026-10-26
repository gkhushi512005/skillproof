"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/actions/auth";

export default function EvaluatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [evaluatorName, setEvaluatorName] = useState("Dr. Marcus Chen");

  useEffect(() => {
    const supabase = createClient();
    const loadEvaluator = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setEvaluatorName(profile.full_name);
        } else if (user.user_metadata?.full_name) {
          setEvaluatorName(user.user_metadata.full_name as string);
        }
      }
    };
    loadEvaluator();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col">
      {/* Evaluator Secondary Bar */}
      <div className="border-b border-border bg-card px-4 py-3 sticky top-16 z-40 shadow-2xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-base shadow-sm">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-foreground">Evaluator Workspace</span>
                <Badge variant="outline" className="border-indigo-400 bg-indigo-50 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-200 text-[11px] font-bold">
                  Authorized Reviewer
                </Badge>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {evaluatorName} · Verified Domain Evaluator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-foreground flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-md px-3.5 py-2 hover:bg-slate-200 transition-colors shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Candidate View
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md px-3 py-2 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
