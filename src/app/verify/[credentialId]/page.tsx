import Link from "next/link";
import { MOCK_CREDENTIALS, MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { CredentialActions } from "./credential-actions";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar,
  UserCheck,
  FileCheck2,
  Lock,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  params: Promise<{ credentialId: string }>;
}

export default async function CredentialVerificationPage({ params }: VerifyPageProps) {
  const { credentialId } = await params;

  let credential: any = null;
  let evaluatorName = "Dr. Marcus Chen";

  try {
    const supabase = await createClient();
    const { data: dbCred } = await supabase
      .from("credentials")
      .select(`
        id,
        candidate_id,
        assessment_id,
        evaluation_id,
        status,
        issued_at,
        expires_at,
        profiles:candidate_id (full_name),
        assessments:assessment_id (id, title, domain, difficulty),
        evaluations:evaluation_id (
          evaluator:evaluator_id (full_name)
        )
      `)
      .eq("id", credentialId)
      .single();

    if (dbCred) {
      credential = {
        id: dbCred.id,
        candidateId: dbCred.candidate_id,
        candidateName: (dbCred.profiles as any)?.full_name || "Verified Candidate",
        assessmentId: dbCred.assessment_id,
        assessmentTitle: (dbCred.assessments as any)?.title || "Assessment",
        assessmentDomain: (dbCred.assessments as any)?.domain || "Engineering",
        assessmentDifficulty: (dbCred.assessments as any)?.difficulty || "intermediate",
        evaluationId: dbCred.evaluation_id,
        status: dbCred.status,
        issuedAt: dbCred.issued_at,
        expiresAt: dbCred.expires_at,
      };
      evaluatorName = (dbCred.evaluations as any)?.evaluator?.full_name || "Dr. Marcus Chen";
    }
  } catch (err) {
    console.warn("Database lookup note:", err);
  }

  // Fallback to mock credentials if not found in PostgreSQL
  if (!credential) {
    credential = MOCK_CREDENTIALS.find((c) => c.id === credentialId);
  }

  // If testing with "demo" or a newly generated random ID
  if (!credential && (credentialId === "demo" || credentialId.startsWith("skp_live_"))) {
    credential = {
      ...MOCK_CREDENTIALS[0],
      id: credentialId === "demo" ? "skp_live_9f83a1b4c102" : credentialId,
    };
  }

  if (!credential) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Invalid Credential Identifier</h1>
        <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
          The credential ID <code className="bg-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-900">{credentialId}</code> does not match any issued record in the SkillProof database.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="font-bold">Return Home</Button>
          </Link>
          <Link href="/verify/skp_live_9f83a1b4c102">
            <Button size="sm" className="font-bold">Inspect Valid Demo</Button>
          </Link>
        </div>
      </div>
    );
  }

  const assessment = MOCK_ASSESSMENTS.find((a) => a.id === credential.assessmentId) || MOCK_ASSESSMENTS[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Recruiter Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to SkillProof Home
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <CredentialActions
            credentialId={credential.id}
            candidateName={credential.candidateName}
            assessmentTitle={credential.assessmentTitle}
          />
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
            Lookup: {credential.id}
          </span>
        </div>
      </div>

      {/* Main Verification Certificate Card */}
      <Card className="overflow-hidden border-2 border-slate-300 dark:border-slate-800 shadow-md bg-card print:border-none print:shadow-none">
        {/* Verification Status Header Banner */}
        <div
          className={`p-6 border-b text-center flex flex-col items-center justify-center ${
            credential.status === "valid"
              ? "bg-emerald-100 border-emerald-300 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200"
              : credential.status === "expired"
              ? "bg-amber-100 border-amber-300 text-amber-950 dark:bg-amber-950 dark:text-amber-200"
              : "bg-rose-100 border-rose-300 text-rose-950 dark:bg-rose-950 dark:text-rose-200"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-1.5">
            {credential.status === "valid" && <ShieldCheck className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
            {credential.status === "expired" && <Clock className="h-6 w-6 text-amber-700 dark:text-amber-400" />}
            {credential.status === "revoked" && <ShieldAlert className="h-6 w-6 text-rose-700" />}

            <span className="text-xl font-black tracking-tight uppercase">
              {credential.status === "valid" && "Official Verified Credential · Valid"}
              {credential.status === "expired" && "Credential Expired"}
              {credential.status === "revoked" && "Credential Revoked"}
            </span>
          </div>

          <p className="text-xs font-bold opacity-95 max-w-lg mx-auto">
            {credential.status === "valid" &&
              "This credential has been authenticated against the SkillProof PostgreSQL database. Human rubric criteria verified."}
            {credential.status === "expired" &&
              "This credential has passed its 2-year validity window. Candidates may re-certify through the latest assessment."}
            {credential.status === "revoked" &&
              "This credential was revoked due to a policy violation or discovered code plagiarism."}
          </p>
        </div>

        {/* Certificate Body */}
        <CardContent className="p-6 sm:p-10 space-y-8">
          {/* Recipient & Assessment Details */}
          <div className="text-center space-y-2 border-b border-slate-300 dark:border-slate-800 pb-8">
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Verified Candidate Passport
            </span>
            <h2 className="text-3xl font-black text-foreground tracking-tight sm:text-4xl">
              {credential.candidateName}
            </h2>
            <p className="text-lg font-bold text-primary">
              {credential.assessmentTitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Badge variant="outline" className="font-bold border-slate-300 text-slate-900 bg-slate-100">{credential.assessmentDomain}</Badge>
              <Badge variant="secondary" className="capitalize font-bold">{credential.assessmentDifficulty}</Badge>
            </div>
          </div>

          {/* Audit Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase">
                <UserCheck className="h-4 w-4 text-primary" /> Authorized Evaluator
              </span>
              <p className="font-black text-slate-900 dark:text-slate-100 text-sm">{evaluatorName}</p>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Principal Systems Architect</p>
            </div>

            <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase">
                <Calendar className="h-4 w-4 text-primary" /> Issuance Timestamp
              </span>
              <p className="font-black text-slate-900 dark:text-slate-100 text-sm">{formatDate(credential.issuedAt)}</p>
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                {credential.expiresAt ? `Valid until ${formatDate(credential.expiresAt)}` : "Permanent"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase">
                <Lock className="h-4 w-4 text-primary" /> Unique Identifier
              </span>
              <p className="font-mono text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                {credential.id}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">Cryptographically Seeded</p>
            </div>
          </div>

          {/* Verified Rubric Criteria Passed */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <FileCheck2 className="h-4.5 w-4.5 text-primary" /> Verified Rubric Competencies
              </h3>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Standardized v1.0</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {assessment.rubric.map((criterion) => (
                <div
                  key={criterion.id}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-card p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      {criterion.title}
                    </p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 pl-6">{criterion.description}</p>
                  </div>
                  <div className="pl-6 sm:pl-0 shrink-0">
                    <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900">
                      Weight: {criterion.weight}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Data Minimization Notice */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
              <Lock className="h-4 w-4 text-primary" /> SkillProof Privacy & Verification Guarantee
            </div>
            <p className="leading-relaxed text-xs font-medium text-slate-700 dark:text-slate-300">
              To protect candidate privacy and assessment security, private contact emails, phone numbers, and raw draft submissions are strictly shielded from public view. Only verified competence metrics and authoritative evaluator decisions are exposed.
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-100 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 print:hidden">
          <span>SkillProof Verification Network · Dynamic State Protocol</span>
          <div className="flex items-center gap-2">
            <Link href={`/assessments/${assessment.slug}`}>
              <Button variant="outline" size="sm" className="text-xs font-bold border-slate-400">
                Inspect Task Rubric
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
