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
        className="inline-flex items-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Assessment Catalogue
      </Link>

      {/* Header Banner */}
      <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-card p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="font-bold border-slate-300 text-slate-900 bg-slate-100">
            {assessment.domain}
          </Badge>
          <Badge
            variant={
              assessment.difficulty === "beginner"
                ? "success"
                : assessment.difficulty === "intermediate"
                ? "info"
                : "warning"
            }
            className="capitalize font-bold"
          >
            {assessment.difficulty}
          </Badge>
          <span className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 ml-auto">
            <Clock className="mr-1.5 h-4 w-4" />
            Estimated effort: ~{assessment.estimatedHours} hours
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {assessment.title}
        </h1>
        <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-3xl">
          {assessment.summary}
        </p>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            <span>Standardized Rubric v1.0 · Evaluated by Authorized Human Reviewers</span>
          </div>

          <Link href={`/dashboard/submit/${assessment.slug}`}>
            <Button className="shadow-xs font-bold text-sm">
              Submit Your Evidence <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Task Instructions & Rubric Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructions Card */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Task Instructions & Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-line text-xs sm:text-sm leading-relaxed font-medium">
                {assessment.instructionsMarkdown}
              </div>
            </CardContent>
          </Card>

          {/* Version-Controlled Evaluation Rubric */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Transparent Evaluation Rubric</CardTitle>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Reviewers score each criterion independently. A minimum aggregate score of 75% is required for credential issuance.
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-bold border-slate-300">
                Rubric v1.0
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.rubric.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-black">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">{criterion.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-[11px] font-bold border-slate-300 text-slate-900">
                        Weight: {criterion.weight}%
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Max {criterion.maxPoints} pts
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Required Evidence Checklist & Actions */}
        <div className="space-y-6">
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Submission Requirements</CardTitle>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                All evidence is kept private and shared only with your assigned evaluator.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.submissionRequirements.requiresRepoUrl && (
                <div className="flex items-start gap-2.5 text-xs">
                  <GitBranch className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Public/Private Git Repo URL</p>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Clean commits and complete README</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresLiveUrl && (
                <div className="flex items-start gap-2.5 text-xs">
                  <Globe className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Live Deployed Application</p>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Vercel, Netlify, Fly.io, or AWS</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresExplanation && (
                <div className="flex items-start gap-2.5 text-xs">
                  <FileText className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Architecture Rationale Notes</p>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">Explain tradeoffs and key decisions</p>
                  </div>
                </div>
              )}

              {assessment.submissionRequirements.requiresFileUpload && (
                <div className="flex items-start gap-2.5 text-xs">
                  <UploadCloud className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Architecture Diagram / Audit PDF</p>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      Formats: {assessment.submissionRequirements.allowedMimeTypes?.join(", ")} (Max 10MB)
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link href={`/dashboard/submit/${assessment.slug}`} className="w-full">
                  <Button className="w-full font-bold shadow-xs">
                    Start Submission
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Guarantee Card */}
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-extrabold mb-1">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-700" />
              <span>Human Reviewer Accountability</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-xs">
              Every assessment is evaluated by a verified domain expert. If revisions are required, you will receive clear, criterion-level feedback to fix issues and resubmit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
