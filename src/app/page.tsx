// Location: src/app/page.tsx
// Action: Replace entire file

import Link from "next/link";
import { ShieldCheck, UserCheck, FileCode, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-secondary/20 to-background border-b border-border">
        <div className="container flex flex-col items-center text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>Human-Evaluated · Tamper-Evident · Employer-Verified</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Prove Your Skills. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Build Unshakable Trust.
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Move beyond self-reported resumes. SkillProof lets candidates complete practical engineering challenges,
            get evaluated against transparent rubrics by verified experts, and share permanent cryptographic passports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/assessments"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              Explore Assessments <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-all"
            >
              How Verification Works
            </Link>
          </div>

          {/* Quick Metrics Badge Row */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left border border-border/80 rounded-xl p-5 bg-card/80 backdrop-blur shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">100% Practical</p>
                <p className="text-xs text-muted-foreground">Code repositories & real work</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Human Verified</p>
                <p className="text-xs text-muted-foreground">Vetted domain reviewers</p>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-start gap-3">
              <FileCode className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Live Public Proof</p>
                <p className="text-xs text-muted-foreground">Dynamic state check per URL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Section */}
      <section className="w-full py-16 md:py-20 bg-background">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Engineered for the Modern Talent Ecosystem
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Three distinct user journeys unified by a single standard of verified competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-foreground">Candidates</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Take domain-specific challenges, upload real-world evidence, receive actionable rubric scores, and build
                a permanent portable passport.
              </p>
            </div>

            {/* Evaluator Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-foreground">Evaluators</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Review candidate repositories and artifacts in an isolated workspace. Score against rigorous criteria
                with zero room for bias.
              </p>
            </div>

            {/* Employer Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-foreground">Employers</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Inspect public verification links. Instantly see verified competencies and pass status without sorting
                through unverified claims.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}