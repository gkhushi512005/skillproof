"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCandidateSubmissionsData } from "@/actions/submissions";
import { MOCK_SUBMISSIONS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  GitBranch,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function SubmissionsHistoryPage() {
  const [submissions, setSubmissions] = useState<any[]>(MOCK_SUBMISSIONS);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("sub_alex_002");

  useEffect(() => {
    const loadSubmissions = async () => {
      const data = await getCandidateSubmissionsData();
      if (data && data.length > 0) {
        setSubmissions(data);
        // Default expand the first item
        setExpandedId(data[0].id);
      }
    };
    loadSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    return sub.status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Submission History & Feedback</h1>
          <p className="text-sm text-slate-700 mt-1">
            Review detailed evaluator notes, criterion-level scoring breakdowns, and revision requests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg text-xs self-start sm:self-auto border border-border">
          {["all", "approved", "changes_requested", "under_review"].map((statusKey) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => setFilter(statusKey)}
              className={`capitalize px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filter === statusKey
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-700 hover:text-foreground hover:bg-slate-200/60"
              }`}
            >
              {statusKey.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const isExpanded = expandedId === submission.id;
          return (
            <Card key={submission.id} className="overflow-hidden border border-slate-300 dark:border-slate-800 shadow-xs">
              <div
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors select-none"
                onClick={() => setExpandedId(isExpanded ? null : submission.id)}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-bold text-slate-800">
                      {submission.assessment.domain}
                    </Badge>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs font-semibold text-slate-700">
                      Submitted on {submission.submittedAt ? formatDate(submission.submittedAt) : "N/A"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {submission.assessment.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={submission.status} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Collapsible Details Drawer */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-6 space-y-6">
                  {/* Candidate Evidence Submitted */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Candidate Evidence Submitted
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {submission.repoUrl && (
                        <a
                          href={submission.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-card hover:border-primary transition-colors text-xs"
                        >
                          <span className="flex items-center gap-2 truncate text-slate-900 font-semibold">
                            <GitBranch className="h-4 w-4 text-primary shrink-0" />
                            {submission.repoUrl}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        </a>
                      )}

                      {submission.liveUrl && (
                        <a
                          href={submission.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-card hover:border-primary transition-colors text-xs"
                        >
                          <span className="flex items-center gap-2 truncate text-slate-900 font-semibold">
                            <Globe className="h-4 w-4 text-primary shrink-0" />
                            {submission.liveUrl}
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        </a>
                      )}
                    </div>

                    {submission.notesText && (
                      <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-card p-4 text-xs space-y-1">
                        <span className="font-bold text-slate-900 text-xs">Candidate Notes:</span>
                        <p className="text-slate-800 font-medium leading-relaxed mt-0.5">
                          {submission.notesText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Evaluator Rubric Feedback */}
                  {submission.evaluation ? (
                    <div className="space-y-5 pt-3 border-t border-slate-300 dark:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <h4 className="text-base font-bold text-foreground">
                              Official Evaluation Decision
                            </h4>
                          </div>
                          <p className="text-xs font-medium text-slate-700 mt-0.5">
                            Evaluated by <strong className="text-slate-900">{submission.evaluation.evaluatorName}</strong> on {formatDate(submission.evaluation.evaluatedAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-card border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                          <span className="text-xs font-bold text-slate-700">Rubric Score:</span>
                          <Badge
                            variant={submission.evaluation.totalScore >= 75 ? "success" : "warning"}
                            className="text-xs font-black px-2 py-0.5"
                          >
                            {submission.evaluation.totalScore}%
                          </Badge>
                        </div>
                      </div>

                      {/* HIGH-CONTRAST Reviewer Feedback Box */}
                      <div
                        className={`rounded-xl p-4.5 border-2 shadow-xs ${
                          submission.status === "changes_requested"
                            ? "border-amber-300 bg-amber-50/90 dark:bg-amber-950/40 text-slate-900"
                            : "border-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40 text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {submission.status === "changes_requested" ? (
                            <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          )}
                          <span className={`text-xs font-extrabold uppercase tracking-wide ${
                            submission.status === "changes_requested" ? "text-amber-950 dark:text-amber-200" : "text-emerald-950 dark:text-emerald-200"
                          }`}>
                            Reviewer Feedback:
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed pl-6">
                          {submission.evaluation.generalFeedback}
                        </p>
                      </div>

                      {/* Criteria Score Breakdown */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                          Criteria Breakdown:
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {(submission.evaluation.scores || []).map((score: any) => {
                            const rubricItem = (submission.assessment.rubric || []).find(
                              (r: any) => r.id === score.criterionId
                            );
                            return (
                              <div
                                key={score.criterionId}
                                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="space-y-1">
                                  <p className="font-bold text-slate-900 text-sm">
                                    {rubricItem?.title || score.criterionId}
                                  </p>
                                  {score.comments && (
                                    <p className="text-slate-700 text-xs font-medium italic">
                                      &quot;{score.comments}&quot;
                                    </p>
                                  )}
                                </div>
                                <div className="font-black text-slate-900 text-sm shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md text-right">
                                  {score.pointsAwarded} / {rubricItem?.maxPoints || 5} pts
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-3">
                        {submission.status === "changes_requested" && (
                          <Link href={`/dashboard/submit/${submission.assessment.slug}`}>
                            <Button size="sm" className="font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                              Address Revisions & Resubmit
                            </Button>
                          </Link>
                        )}
                        {submission.status === "approved" && (
                          <Link href="/verify/skp_live_9f83a1b4c102">
                            <Button size="sm" variant="outline" className="gap-1.5 font-bold border-slate-400 text-slate-900">
                              Open Verified Public Credential <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs font-medium text-slate-700">
                      Your submission is currently in the queue. An authorized evaluator will review your evidence shortly.
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
