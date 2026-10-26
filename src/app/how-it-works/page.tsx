import Link from "next/link";
import { ShieldCheck, UserCheck, Search, CheckCircle, ArrowRight, Lock, Award, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>The SkillProof Verification Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          How SkillProof Replaces Self-Reported Claims With Verifiable Competence
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Traditional hiring relies on unstandardized resumes and unverifiable certificates. SkillProof establishes a three-way trust protocol between candidates, authorized evaluators, and employers.
        </p>
      </div>

      {/* 4-Step Process Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="rounded-xl border border-border bg-card p-6 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-bold mb-4">
            1
          </div>
          <h3 className="font-bold text-base text-foreground mb-2">Demonstrate</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Candidates choose standardized, practical challenges (e.g. Next.js dashboard, PostgreSQL ETL pipeline) designed around actual industry problems.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold mb-4">
            2
          </div>
          <h3 className="font-bold text-base text-foreground mb-2">Submit Evidence</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload verifiable proof: GitHub repository URLs, live deployed applications, design documents, and architecture schematics into private storage.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 font-bold mb-4">
            3
          </div>
          <h3 className="font-bold text-base text-foreground mb-2">Rubric Evaluation</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Vetted domain experts evaluate the work using transparent, version-controlled scoring rubrics, providing detailed feedback or requesting revisions.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold mb-4">
            4
          </div>
          <h3 className="font-bold text-base text-foreground mb-2">Verified Passport</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upon passing, an immutable cryptographic credential is generated with a public verification URL that employers can inspect with a single click.
          </p>
        </div>
      </div>

      {/* Role Comparison Breakdown */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-center">
          Engineered for All Three Sides of Hiring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-base text-foreground">For Candidates</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Curate a portable portfolio of verified skills that outlasts any single job application.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Receive expert rubric-based feedback to identify skill gaps and level up.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Share verified credentials directly on LinkedIn, resumes, and job portals.</span>
              </li>
            </ul>
          </div>

          {/* Evaluator */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-base text-foreground">For Evaluators</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Access assigned candidate evidence in a secure, sandboxed evaluation queue.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Grade against objective, version-controlled criteria with zero room for interviewer bias.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Enforce industry integrity with authoritative approval or revision decisions.</span>
              </li>
            </ul>
          </div>

          {/* Employer */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-emerald-500" />
              <h3 className="font-bold text-base text-foreground">For Employers</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verify credentials instantly via dynamic URL without needing candidate login.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero trust in static screenshots — live database lookups confirm active/revoked status.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Drastically reduce technical interview rounds and eliminate fake resume claims.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Ready to Build Your Skills Passport?</h2>
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto mb-6">
          Browse our standardized engineering assessments and submit your practical evidence today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/assessments">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-sm">
              Browse Assessments <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/verify/skp_live_9f83a1b4c102">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold">
              View Sample Verified Credential
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
