import Link from "next/link";
import { ShieldCheck, UserCheck, FileCode, CheckCircle2, ArrowRight, Sparkles, Check, Lock, Award, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 flex flex-col items-center text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-black text-blue-700 mb-6 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Human-Evaluated · Tamper-Evident · Employer-Verified</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-slate-950 max-w-4xl">
            Prove Your Skills. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Build Unshakable Trust.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg font-semibold text-slate-700 max-w-2xl leading-relaxed">
            Move beyond self-reported resumes. SkillProof lets candidates complete practical engineering challenges,
            get evaluated against transparent rubrics by verified experts, and share permanent cryptographic passports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/assessments"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-md hover:bg-blue-700 transition-all hover:scale-[1.02]"
            >
              Explore Assessments <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/verify/demo"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3.5 text-sm font-black text-slate-900 shadow-xs hover:bg-slate-100 hover:border-slate-400 transition-all"
            >
              <Eye className="h-4 w-4 text-blue-600" /> Inspect Sample Credential
            </Link>
          </div>

          {/* Quick Metrics Badge Row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-2 border-slate-200 rounded-2xl p-6 bg-white shadow-md w-full max-w-3xl">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">100% Practical</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Code repos & live deployed applications</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">Human Verified</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Vetted senior industry domain architects</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">Live Public Proof</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Tamper-evident cryptographic state check</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Platform Showcase Banner */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-3xl border-2 border-slate-200 overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">
                  <Sparkles className="h-3.5 w-3.5" /> Silicon Valley Standard
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Real Code. Verified Rubrics. <br />
                  <span className="text-blue-400">Zero Resume Inflation.</span>
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-300 leading-relaxed">
                  Traditional credentials only prove someone sat through a lecture. SkillProof authenticates that candidates actually built and shipped end-to-end production software.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/how-it-works">
                    <Button className="bg-blue-600 text-white hover:bg-blue-500 font-black text-xs sm:text-sm shadow-md">
                      See Verification Protocol <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                    alt="Developer code review"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-white/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">Next.js Fullstack Dashboard</p>
                      <p className="text-[10px] font-bold text-emerald-400">Score: 94% · Passed Rubric</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-white">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Personas Section With Rich Visual Cards */}
      <section className="w-full py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Engineered for the Modern Talent Ecosystem
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-700 max-w-xl mx-auto">
              Three distinct user journeys unified by a single standard of verified competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate Card */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col">
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                  alt="Candidates"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                  01 Candidates
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">Prove Technical Depth</h3>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    Take domain challenges, upload real repository evidence, receive granular rubric feedback, and build a permanent portable passport.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link href="/assessments" className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    Browse challenges <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Evaluator Card */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col">
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
                  alt="Evaluators"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                  02 Evaluators
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">Rigorous Peer Review</h3>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    Review candidate codebases in an isolated evaluator workspace. Score against authoritative rubrics with zero candidate bias.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link href="/how-it-works" className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    Evaluator protocol <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Employer Card */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all flex flex-col">
              <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
                  alt="Employers"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                  03 Employers
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">Zero-Trust Verification</h3>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    Inspect public verification URLs instantly. Confirm authenticated competencies, score breakdowns, and evaluator decisions with one click.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Link href="/verify/demo" className="text-xs font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                    Verify a candidate <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
