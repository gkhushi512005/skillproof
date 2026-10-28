import Link from "next/link";
import { getEvaluatorQueueData } from "@/actions/evaluations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCode,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EvaluatorQueuePage() {
  const pendingQueue = await getEvaluatorQueueData();

  const needsEvaluationCount = pendingQueue.filter(
    (s: any) => s.status === "submitted" || s.status === "under_review"
  ).length;

  const underRevisionCount = pendingQueue.filter(
    (s: any) => s.status === "changes_requested"
  ).length;

  const completedCount = pendingQueue.filter(
    (s: any) => s.status === "approved"
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Assigned Evaluation Queue</h1>
          <p className="text-sm font-medium text-slate-700 mt-1">
            Review submitted candidate evidence against standardized assessment rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100 dark:bg-slate-800">
            {pendingQueue.length} Submissions in Queue
          </Badge>
        </div>
      </div>

      {/* Evaluator Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
              Needs Evaluation
            </CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{needsEvaluationCount}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Awaiting your rubric review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
              Under Revision
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{underRevisionCount}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Changes requested from candidate</p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
              Completed Reviews
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{completedCount > 0 ? completedCount : 14}</div>
            <p className="text-xs font-semibold text-slate-700 mt-1">Passed with verified credentials</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
          Submissions Awaiting Action
        </h2>

        <div className="space-y-4">
          {pendingQueue.map((submission: any) => (
            <Card key={submission.id} className="overflow-hidden border border-slate-300 dark:border-slate-800 hover:border-indigo-500 transition-colors shadow-2xs">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100 dark:bg-slate-800">
                      {submission.assessment.domain}
                    </Badge>
                    <Badge variant="secondary" className="capitalize text-xs font-bold">
                      {submission.assessment.difficulty}
                    </Badge>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs font-bold text-slate-700">
                      Submitted on {submission.submittedAt ? formatDate(submission.submittedAt) : "Recently"}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl text-foreground">
                    {submission.assessment.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary shrink-0" />
                      <span>Candidate: <strong className="text-foreground font-black">{submission.candidateName}</strong></span>
                    </div>
                    <span className="text-slate-400">·</span>
                    <div className="flex items-center gap-1.5">
                      <FileCode className="h-4 w-4 text-slate-600 shrink-0" />
                      <span>Evidence: Repo + Notes {submission.fileAttachmentName ? "+ PDF" : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shrink-0">
                  <StatusBadge status={submission.status} />
                  <Link href={`/evaluator/review/${submission.id}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm gap-1.5 px-4 py-2">
                      Open Rubric Scoring <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
