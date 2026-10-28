import Link from "next/link";
import { ShieldCheck, UserCheck, Search, CheckCircle, ArrowRight, Lock, Award, FileCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-black text-blue-700 mb-4 shadow-2xs">
          <ShieldCheck className="h-4 w-4" />
          <span>The SkillProof Verification Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950">
          How SkillProof Replaces Self-Reported Claims With Verifiable Competence
        </h1>
        <p className="mt-4 text-base sm:text-lg font-semibold text-slate-700 leading-relaxed">
          Traditional hiring relies on unstandardized resumes and unverifiable certificates. SkillProof establishes a three-way trust protocol between candidates, authorized evaluators, and employers.
        </p>
      </div>

      {/* 4-Step Process Timeline With Curated Tech Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {/* Step 1 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col">
          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
              alt="Practical code challenge"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-sm shadow-md">
              1
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-black text-base text-slate-950 mb-2">1. Demonstrate</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Candidates choose standardized, practical challenges designed around actual industry problems (e.g., Next.js dashboard, PostgreSQL ETL pipeline).
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col">
          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80"
              alt="GitHub commits and deployment"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm shadow-md">
              2
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-black text-base text-slate-950 mb-2">2. Submit Evidence</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Upload verifiable proof: GitHub repository URLs, live deployed web applications, and architectural decisions directly into isolated storage.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col">
          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
              alt="Senior engineer rubric evaluation"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-black text-sm shadow-md">
              3
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-black text-base text-slate-950 mb-2">3. Rubric Evaluation</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Vetted domain experts evaluate the work using transparent, version-controlled rubrics, scoring code quality, architecture, and edge cases.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col">
          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
              alt="Verified skills passport"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-sm shadow-md">
              4
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-black text-base text-slate-950 mb-2">4. Verified Passport</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Upon passing, an immutable cryptographic credential is generated with a public verification URL that employers can inspect with a single click.
            </p>
          </div>
        </div>
      </div>

      {/* Role Comparison Breakdown */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 text-center">
          Engineered for All Three Sides of Hiring
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:border-blue-300 transition-all">
            <div className="h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                alt="Candidates"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-black text-lg text-slate-950">For Candidates</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Curate a portable portfolio of verified skills that outlasts any single job application.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive expert rubric-based feedback to identify skill gaps and level up.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Share verified credentials directly on LinkedIn, resumes, and job portals.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Evaluator */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:border-indigo-300 transition-all">
            <div className="h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
                alt="Evaluators"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-lg text-slate-950">For Evaluators</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Access candidate code repositories in an isolated, structured evaluation interface.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Score against standardized, objective criteria with zero personal identifying bias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Earn reputation and compensation as a recognized domain authority.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Employer */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:border-emerald-300 transition-all">
            <div className="h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                alt="Employers"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-5 w-5 text-emerald-600" />
                <h3 className="font-black text-lg text-slate-950">For Employers</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verify credentials instantly via dynamic URL without needing candidate login.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Zero trust in static screenshots — live database lookups confirm active/revoked status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Drastically reduce technical interview rounds and eliminate fake resume claims.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* High-Contrast CTA Banner */}
      <div className="rounded-3xl border-2 border-blue-500 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-8 sm:p-14 text-center text-white shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-white">
          Ready to Build Your Skills Passport?
        </h2>
        <p className="text-base sm:text-lg font-semibold text-blue-100 max-w-xl mx-auto mb-8">
          Browse our standardized engineering assessments and submit your practical evidence today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/assessments">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-black shadow-lg text-sm sm:text-base px-6 py-3">
              Browse Assessments <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/verify/skp_live_9f83a1b4c102">
            <Button
              size="lg"
              className="bg-slate-950 text-white hover:bg-slate-900 border-2 border-white font-black shadow-lg text-sm sm:text-base px-6 py-3"
            >
              View Sample Verified Credential
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
