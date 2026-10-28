"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_SUBMISSIONS, MOCK_CANDIDATE } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  GitBranch,
  Globe,
  FileText,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { submitEvaluationAction } from "@/actions/evaluations";

interface ReviewPageProps {
  params: Promise<{ submissionId: string }>;
}

export default function EvaluatorReviewPage({ params }: ReviewPageProps) {
  const router = useRouter();
  const { submissionId } = use(params);

  const submission =
    MOCK_SUBMISSIONS.find((s) => s.id === submissionId) || MOCK_SUBMISSIONS[0];
  const assessment = submission.assessment;

  // Initial criterion scores from previous evaluation or defaults
  const initialScores: Record<string, number> = {};
  assessment.rubric.forEach((crit) => {
    const existing = submission.evaluation?.scores.find((s) => s.criterionId === crit.id);
    initialScores[crit.id] = existing ? existing.pointsAwarded : 4; // default 4/5
  });

  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [generalFeedback, setGeneralFeedback] = useState(
    submission.evaluation?.generalFeedback ||
      "Great architecture and clean code. Ready for approval."
  );
  const [criterionComments, setCriterionComments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decisionResult, setDecisionResult] = useState<{
    decision: "approved" | "changes_requested" | "rejected";
    credentialId?: string;
  } | null>(null);

  // Calculate weighted total score
  const calculateTotalScore = () => {
    let total = 0;
    assessment.rubric.forEach((crit) => {
      const points = scores[crit.id] || 0;
      const weightFraction = crit.weight / 100;
      const criterionPercent = points / crit.maxPoints;
      total += criterionPercent * weightFraction * 100;
    });
    return Math.round(total);
  };

  const totalScore = calculateTotalScore();
  const isPassing = totalScore >= 75;

  const handleScoreChange = (criterionId: string, val: number) => {
    setScores((prev) => ({ ...prev, [criterionId]: val }));
  };

  const handleDecision = async (decision: "approved" | "changes_requested" | "rejected") => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const scoresList = assessment.rubric.map((c) => ({
      criterionId: c.id,
      pointsAwarded: scores[c.id] || 0,
      comments: criterionComments[c.id] || "",
    }));

    const formData = new FormData();
    formData.append("submissionId", submission.id);
    formData.append("decision", decision);
    formData.append("totalScore", totalScore.toString());
    formData.append("scoresJson", JSON.stringify(scoresList));
    formData.append("generalFeedback", generalFeedback);

    const result = await submitEvaluationAction(formData);

    setIsSubmitting(false);
    if (!result.success) {
      setErrorMessage(result.error || "Failed to record evaluation.");
      return;
    }

    setDecisionResult({
      decision,
      credentialId: result.credentialId,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back button & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link
            href="/evaluator"
            className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-foreground mb-1.5 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Evaluator Queue
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-foreground">Rubric Evaluation Workspace</h1>
            <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100">
              Rubric v1.0
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Status:</span>
          <StatusBadge status={submission.status} />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-3.5 text-xs font-bold text-rose-950 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Decision Modal / Notification Overlay */}
      {decisionResult && (
        <Card className="p-6 border-2 border-primary bg-card shadow-lg text-center max-w-xl mx-auto animate-in zoom-in-95">
          {decisionResult.decision === "approved" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-foreground">Submission Approved & Credential Issued!</h3>
              <p className="text-xs font-bold text-slate-700">
                Score achieved: <strong className="text-foreground text-sm font-black">{totalScore}%</strong>. A tamper-evident credential was generated on the server with public ID:
              </p>
              <div className="rounded-md bg-slate-100 border border-slate-300 p-2.5 font-mono text-xs font-black text-slate-900 select-all">
                {decisionResult.credentialId}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href={`/verify/${decisionResult.credentialId}`} target="_blank">
                  <Button size="sm" className="font-bold gap-1.5">
                    Open Public Verification Page <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => router.push("/evaluator")} className="font-bold">
                  Return to Queue
                </Button>
              </div>
            </div>
          )}

          {decisionResult.decision === "changes_requested" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-foreground">Revisions Requested</h3>
              <p className="text-xs font-bold text-slate-700">
                The candidate has been notified with your criterion-specific comments and constructive feedback.
              </p>
              <Button size="sm" onClick={() => router.push("/evaluator")} className="font-bold">
                Return to Queue
              </Button>
            </div>
          )}

          {decisionResult.decision === "rejected" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                <XCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-foreground">Submission Rejected</h3>
              <p className="text-xs font-bold text-slate-700">
                Decision recorded with feedback. No credential will be issued for this submission.
              </p>
              <Button size="sm" onClick={() => router.push("/evaluator")} className="font-bold">
                Return to Queue
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Candidate & Evidence (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Candidate Card */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-700">
                Candidate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary">
                  {MOCK_CANDIDATE.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={MOCK_CANDIDATE.avatarUrl}
                      alt={MOCK_CANDIDATE.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "AR"
                  )}
                </div>
                <div>
                  <p className="text-base font-black text-foreground">{MOCK_CANDIDATE.fullName}</p>
                  <p className="text-xs font-medium text-slate-700 line-clamp-1">{MOCK_CANDIDATE.headline}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 space-y-1">
                <p>Target Challenge: <strong className="text-foreground font-black">{assessment.title}</strong></p>
                <p>Submitted: {submission.submittedAt ? formatDate(submission.submittedAt) : "Recently"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Links & Artifacts */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" /> Verified Candidate Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submission.repoUrl && (
                <div className="rounded-lg border border-slate-300 dark:border-slate-700 p-3 space-y-1 bg-card">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">
                    Source Code Repository
                  </span>
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-xs text-primary font-bold hover:underline truncate"
                  >
                    <span className="truncate">{submission.repoUrl}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-1.5" />
                  </a>
                </div>
              )}

              {submission.liveUrl && (
                <div className="rounded-lg border border-slate-300 dark:border-slate-700 p-3 space-y-1 bg-card">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">
                    Live Deployed Application
                  </span>
                  <a
                    href={submission.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-xs text-primary font-bold hover:underline truncate"
                  >
                    <span className="truncate">{submission.liveUrl}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-1.5" />
                  </a>
                </div>
              )}

              {submission.fileAttachmentName && (
                <div className="rounded-lg border border-slate-300 dark:border-slate-700 p-3 flex items-center justify-between bg-card text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="truncate font-bold text-foreground">
                      {submission.fileAttachmentName}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold border-slate-300 cursor-pointer hover:bg-slate-100">
                    Inspect PDF
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Architecture Notes */}
          {submission.notesText && (
            <Card className="border-slate-300 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Architecture Rationale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-800 font-medium leading-relaxed">
                  {submission.notesText}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Interactive Rubric Scoring (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Rubric Score Aggregate Header Card */}
          <Card className="border-2 border-indigo-300 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/70 to-card dark:from-indigo-950/40">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-indigo-950 dark:text-indigo-300 uppercase tracking-wide">
                  Live Weighted Score
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-foreground">{totalScore}%</span>
                  <span className="text-xs font-bold text-slate-700">
                    (Minimum required to pass: 75%)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant={isPassing ? "success" : "warning"}
                  className="text-xs font-black px-3 py-1"
                >
                  {isPassing ? "Passing Criteria Met" : "Below Passing Bar"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Criteria Sliders / Point Pickers */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Standardized Rubric Criteria</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-700">
                Score each criterion objectively from 1 to 5 points.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {assessment.rubric.map((criterion) => {
                const currentScore = scores[criterion.id] ?? 4;
                return (
                  <div key={criterion.id} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{criterion.title}</h4>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{criterion.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="text-[11px] font-bold border-slate-300 text-slate-900">
                          Weight: {criterion.weight}%
                        </Badge>
                        <p className="text-xs font-black text-primary mt-1">
                          {currentScore} / {criterion.maxPoints} pts
                        </p>
                      </div>
                    </div>

                    {/* Quick Point Selector Buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => handleScoreChange(criterion.id, pt)}
                          className={`flex-1 py-1.5 rounded-md text-xs font-black transition-all ${
                            currentScore === pt
                              ? "bg-primary text-white shadow-xs scale-102"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {pt} pt{pt > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>

                    {/* Optional Criterion Comments */}
                    <input
                      type="text"
                      placeholder="Add specific criterion comment (optional)..."
                      value={criterionComments[criterion.id] || ""}
                      onChange={(e) =>
                        setCriterionComments((prev) => ({
                          ...prev,
                          [criterion.id]: e.target.value,
                        }))
                      }
                      className="w-full text-xs font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-1.5 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* General Constructive Feedback */}
          <Card className="border-slate-300 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Constructive Evaluator Feedback</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-700">
                This feedback is visible to the candidate to guide their career growth or revision.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                required
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="Explain what the candidate did well, areas for optimization, or specific fixes needed before approval..."
                className="font-medium text-foreground text-sm"
              />
            </CardContent>
          </Card>

          {/* Evaluator Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleDecision("rejected")}
              className="text-xs font-bold text-rose-700 hover:bg-rose-50 border-rose-300"
            >
              Reject Submission
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => handleDecision("changes_requested")}
                className="text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-400"
              >
                Request Revisions
              </Button>

              <Button
                type="button"
                disabled={!isPassing || isSubmitting}
                onClick={() => handleDecision("approved")}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5 px-4"
              >
                <ShieldCheck className="h-4 w-4" /> Approve & Issue Credential
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
