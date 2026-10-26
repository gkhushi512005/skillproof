"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  GitBranch,
  Globe,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
} from "lucide-react";
import { createSubmissionAction } from "@/actions/submissions";

interface SubmitPageProps {
  params: Promise<{ slug: string }>;
}

export default function SubmitEvidencePage({ params }: SubmitPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const assessment = MOCK_ASSESSMENTS.find((a) => a.slug === slug) || MOCK_ASSESSMENTS[0];

  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // File validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

    if (selectedFile.size > maxSizeBytes) {
      setFileError("File exceeds the maximum 10MB limit.");
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Only PDF and image files (PNG, JPEG, WebP) are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("assessmentId", assessment.id);
    formData.append("repoUrl", repoUrl);
    formData.append("liveUrl", liveUrl);
    formData.append("notesText", notes);
    if (file) {
      formData.append("file", file);
    }

    const result = await createSubmissionAction(formData);

    setIsSubmitting(false);
    if (!result.success) {
      setServerError(result.error || "Failed to submit evidence.");
      return;
    }

    setSubmittedSuccess(true);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-2 border-emerald-400 bg-emerald-50/40 text-center p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-black text-foreground">Evidence Submitted Successfully!</CardTitle>
          <CardDescription className="text-sm font-semibold text-slate-800 mt-2 max-w-md mx-auto">
            Your evidence for <strong className="text-foreground font-black">{assessment.title}</strong> has been saved and placed into the secure review queue for an authorized evaluator.
          </CardDescription>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => router.push("/dashboard/submissions")} className="font-bold">
              View Submission Queue
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="font-bold border-slate-400">
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href={`/assessments/${assessment.slug}`}
        className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Assessment Brief
      </Link>

      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="outline" className="font-bold border-slate-300 text-slate-900 bg-slate-100">{assessment.domain}</Badge>
          <Badge variant="secondary" className="capitalize font-bold">{assessment.difficulty}</Badge>
        </div>
        <h1 className="text-2xl font-black text-foreground">Submit Practical Work Evidence</h1>
        <p className="text-xs font-semibold text-slate-700 mt-1">
          Target Assessment: <span className="font-black text-foreground">{assessment.title}</span>
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-3.5 text-xs font-bold text-rose-950 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Repo URL */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" /> Repository URL
              {assessment.submissionRequirements.requiresRepoUrl && (
                <span className="text-destructive text-xs font-black">*</span>
              )}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-700">
              GitHub or GitLab URL containing clean source code, commit history, and setup instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="url"
              required={assessment.submissionRequirements.requiresRepoUrl}
              placeholder="https://github.com/your-username/your-repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="font-medium text-foreground"
            />
          </CardContent>
        </Card>

        {/* Live URL */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Live Application URL
              {assessment.submissionRequirements.requiresLiveUrl && (
                <span className="text-destructive text-xs font-black">*</span>
              )}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-700">
              Publicly accessible URL (Vercel, Netlify, Render, or cloud domain) where the evaluator can test your app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="url"
              required={assessment.submissionRequirements.requiresLiveUrl}
              placeholder="https://my-app.vercel.app"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="font-medium text-foreground"
            />
          </CardContent>
        </Card>

        {/* Architecture Notes */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Architecture Rationale & Tradeoffs
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-700">
              Explain your architectural decisions, data modeling, security measures, and any known limitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={5}
              required={assessment.submissionRequirements.requiresExplanation}
              placeholder="Detail your engineering approach, server actions handling, schema design, and performance optimizations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="font-medium text-foreground text-sm"
            />
          </CardContent>
        </Card>

        {/* File Upload to Private Storage */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-primary" /> Architecture Diagram / Audit PDF
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-700">
              Upload supporting documentation (PDF, PNG, JPEG up to 10MB). Files are encrypted in private storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!file ? (
              <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 cursor-pointer hover:border-primary transition-colors bg-slate-50 dark:bg-slate-900/40">
                <UploadCloud className="h-8 w-8 text-primary mb-2" />
                <span className="text-xs font-bold text-foreground">Click to select an evidence file</span>
                <span className="text-[11px] font-semibold text-slate-700 mt-0.5">PDF or images up to 10MB</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-3">
                <div className="flex items-center gap-2.5 truncate">
                  <FileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                    <p className="text-[10px] font-semibold text-slate-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-600 hover:text-destructive p-1 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="text-xs text-destructive flex items-center gap-1.5 font-bold">
                <AlertCircle className="h-4 w-4" /> {fileError}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="font-bold border-slate-400">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="font-bold shadow-xs">
            {isSubmitting ? "Submitting Evidence..." : "Submit for Evaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
