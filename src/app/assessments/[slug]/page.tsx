import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  GitBranch,
  Globe,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

export function generateStaticParams() {
  return MOCK_ASSESSMENTS.map((a) => ({
    slug: a.slug,
  }));
}

interface AssessmentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AssessmentDetailPage({ params }: AssessmentDetailPageProps) {
  const { slug } = await params;
  const assessment = MOCK_ASSESSMENTS.find((a) => a.slug === slug);

  if (!assessment) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Back button */}
      <Link
        href="/assessments"
        className="inline-flex items-center text-sm font-black text-slate-900 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Assessment Catalogue
      </Link>

      {/* Header Banner */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className="font-black text-xs border-slate-300 text-slate-950 bg-slate-100 px-3 py-1">
            {assessment.domain}
          </Badge>
          <Badge
            className={`capitalize font-black text-xs px-3 py-1 ${
              assessment.difficulty === "beginner"
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : assessment.difficulty === "intermediate"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-amber-100 text-amber-800 border-amber-300"
            }`}
          >
            {assessment.difficulty}
          </Badge>
          <span className="flex items-center text-xs font-black text-slate-800 ml-auto bg-slate-100 px-3 py-1 rounded-md">
            <Clock className="mr-1.5 h-4 w-4 text-blue-600" />
            Estimated effort: ~{assessment.estimatedHours} hours
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
          {assessment.title}
        </h1>
        <p className="mt-3 text-base font-semibold text-slate-700 leading-relaxed max-w-3xl">
          {assessment.summary}
        </p>

        <div className="mt-6 pt-6 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Standardized Rubric v1.0 · Evaluated by Authorized Human Reviewers</span>
          </div>

          <Link href={`/dashboard/submit/${assessment.slug}`}>
            <Button className="font-black bg-blue-600 text-white hover:bg-blue-700 text-sm px-6 py-2.5 shadow-md">
              Submit Your Evidence <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Task Instructions & Rubric Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructions Card */}
          <Card className="border-2 border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-black text-slate-950 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> Task Instructions & Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-line text-xs sm:text-sm leading-relaxed font-semibold">
                {assessment.instructionsMarkdown}
              </div>
            </CardContent>
          </Card>

          {/* Version-Controlled Evaluation Rubric */}
          <Card className="border-2 border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-slate-950">Transparent Evaluation Rubric</CardTitle>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                  Reviewers score each criterion independently. A minimum aggregate score of 75% is required for credential issuance.
                </p>
              </div>
              <Badge className="text-xs font-black bg-slate-950 text-white border-none">
                Rubric v1.0
              </Badge>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-3.5">
              {assessment.rubric.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-black">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-black text-slate-950">{criterion.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge className="text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                        Weight: {criterion.weight}%
                      </Badge>
                      <span className="text-[11px] font-black text-slate-700">
                        Max {criterion.maxPoints} pts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed pl-7">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Required Evidence Checklist & Actions */}
        <div className="space-y-6">
          <Card className="border-2 border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-black text-slate-950">Submission Requirements</CardTitle>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                All evidence is kept private and shared only with your assigned evaluator.
              </p>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              {assessment.submissionRequirements.requiresRepoUrl && (
                <div className="flex items-start gap-2.5 text-xs">
                  <GitBranch className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-950">Public/Private Git Repo URL</p>
                    <p className="text-slate-700 text-[11px] font-semibold">Clean commits and complete README</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresLiveUrl && (
                <div className="flex items-start gap-2.5 text-xs">
                  <Globe className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-950">Live Deployed Application</p>
                    <p className="text-slate-700 text-[11px] font-semibold">Vercel, Netlify, Fly.io, or AWS</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresExplanation && (
                <div className="flex items-start gap-2.5 text-xs">
                  <FileText className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-950">Architecture Rationale Notes</p>
                    <p className="text-slate-700 text-[11px] font-semibold">Explain tradeoffs and key decisions</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresFileUpload && (
                <div className="flex items-start gap-2.5 text-xs">
                  <UploadCloud className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-slate-950">Architecture Diagram / Audit PDF</p>
                    <p className="text-slate-700 text-[11px] font-semibold">
                      Formats: {assessment.submissionRequirements.allowedMimeTypes?.join(", ")} (Max 10MB)
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t-2 border-slate-100">
                <Link href={`/dashboard/submit/${assessment.slug}`} className="w-full">
                  <Button className="w-full font-black bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                    Start Submission
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Guarantee Card */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-sm mb-1">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <span>Human Reviewer Accountability</span>
            </div>
            <p className="text-slate-800 font-semibold leading-relaxed text-xs">
              Every assessment is evaluated by a verified domain expert. If revisions are required, you will receive clear, criterion-level feedback to fix issues and resubmit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
