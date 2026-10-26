import Link from "next/link";
import { getCandidateSubmissionsData, getCandidateCredentialsData } from "@/actions/submissions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Award,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

export default async function CandidateDashboardPage() {
  const credentials = await getCandidateCredentialsData();
  const submissions = await getCandidateSubmissionsData();

  const activeCredentials = credentials.filter((c: any) => c.status === "valid");
  const inReviewSubmissions = submissions.filter((s: any) => s.status === "under_review" || s.status === "submitted");
  const actionRequiredSubmissions = submissions.filter((s: any) => s.status === "changes_requested");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Candidate Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Track your practical assessment progress, review evaluator feedback, and manage your verified credentials.
          </p>
        </div>

        <Link href="/assessments">
          <Button className="shadow-xs font-bold gap-2">
            <PlusCircle className="h-4 w-4" /> Browse Assessments
          </Button>
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Verified Passport Card */}
        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Verified Credentials
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{activeCredentials.length}</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Active, employer-verifiable passport</p>
            <Link
              href="/dashboard/credentials"
              className="mt-3 inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              View credentials <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* In Review Card */}
        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Under Review
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{inReviewSubmissions.length}</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Pending evaluator rubric grading</p>
            <Link
              href="/dashboard/submissions"
              className="mt-3 inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              Check queue status <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Action Required Card */}
        <Card className="border-slate-300 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Action Required
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{actionRequiredSubmissions.length}</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Revision requested by reviewer</p>
            <Link
              href="/dashboard/submissions"
              className="mt-3 inline-flex items-center text-xs font-bold text-amber-700 hover:underline"
            >
              Read reviewer feedback <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Active Submissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">Recent Submissions & Reviews</h2>
          <Link
            href="/dashboard/submissions"
            className="text-xs font-bold text-primary hover:underline"
          >
            View all history
          </Link>
        </div>

        <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-card overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {submission.assessment.domain}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Submitted {submission.submittedAt ? formatDate(submission.submittedAt) : "Draft"}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-foreground truncate">
                    {submission.assessment.title}
                  </h3>
                  {submission.evaluation?.generalFeedback && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 italic font-medium">
                      &quot;{submission.evaluation.generalFeedback}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                  <StatusBadge status={submission.status} />

                  {submission.status === "approved" && (
                    <Link href={`/verify/skp_live_9f83a1b4c102`}>
                      <Button variant="outline" size="sm" className="text-xs font-bold gap-1 border-slate-300 text-slate-800">
                        View Credential <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}

                  {submission.status === "changes_requested" && (
                    <Link href="/dashboard/submissions">
                      <Button size="sm" className="text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300">
                        View Revisions
                      </Button>
                    </Link>
                  )}

                  {submission.status === "under_review" && (
                    <Link href="/dashboard/submissions">
                      <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-700">
                        Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
