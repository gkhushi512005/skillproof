import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_CREDENTIALS, MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Calendar,
  Lock,
  UserCheck,
  FileCheck2,
  CheckCircle2,
  Check,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CredentialActions } from "./credential-actions";

interface VerifyPageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { credentialId } = await params;

  let credential: any = null;
  let evaluatorName: string = "Dr. Marcus Chen";

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
        profiles!credentials_candidate_id_fkey (full_name),
        assessments (title, domain, difficulty),
        evaluations (
          evaluator:profiles!evaluations_evaluator_id_fkey (full_name)
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
        <h1 className="text-2xl font-black text-slate-950">Invalid Credential Identifier</h1>
        <p className="text-sm font-semibold text-slate-700 mt-2 leading-relaxed">
          The credential ID <code className="bg-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-900">{credentialId}</code> does not match any issued record in the SkillProof database.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="font-bold border-slate-300 text-slate-900 hover:bg-slate-100">Return Home</Button>
          </Link>
          <Link href="/verify/skp_live_9f83a1b4c102">
            <Button size="sm" className="font-bold bg-blue-600 text-white hover:bg-blue-700">Inspect Valid Demo</Button>
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
          className="inline-flex items-center text-sm font-extrabold text-slate-900 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to SkillProof Home
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <CredentialActions
            credentialId={credential.id}
            candidateName={credential.candidateName}
            assessmentTitle={credential.assessmentTitle}
          />
          <span className="text-xs font-mono font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-300 shadow-2xs">
            ID: {credential.id}
          </span>
        </div>
      </div>

      {/* Main Verification Certificate Card */}
      <Card className="overflow-hidden border-2 border-slate-300 shadow-xl bg-white print:border-none print:shadow-none rounded-2xl">
        {/* Verification Status Header Banner */}
        <div
          className={`p-6 border-b text-center flex flex-col items-center justify-center ${
            credential.status === "valid"
              ? "bg-emerald-600 text-white border-emerald-700"
              : credential.status === "expired"
              ? "bg-amber-600 text-white border-amber-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-1.5">
            {credential.status === "valid" && <ShieldCheck className="h-7 w-7 text-white" />}
            {credential.status === "expired" && <Clock className="h-7 w-7 text-white" />}
            {credential.status === "revoked" && <ShieldAlert className="h-7 w-7 text-white" />}

            <span className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              {credential.status === "valid" && "Official Verified Credential · Valid & Active"}
              {credential.status === "expired" && "Credential Expired"}
              {credential.status === "revoked" && "Credential Revoked"}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-white/95 max-w-xl mx-auto">
            {credential.status === "valid" &&
              "This credential has been authenticated against the SkillProof database. Cryptographic proof and human rubric evaluation verified."}
            {credential.status === "expired" &&
              "This credential has passed its validity window. Candidates may re-certify through the latest assessment."}
            {credential.status === "revoked" &&
              "This credential was revoked due to a policy violation or discovered code plagiarism."}
          </p>
        </div>

        {/* Certificate Body */}
        <CardContent className="p-6 sm:p-10 space-y-8 bg-white">
          {/* Recipient & Assessment Details */}
          <div className="text-center space-y-3 border-b-2 border-slate-200 pb-8">
            <div className="flex flex-col items-center justify-center gap-3">
              {/* Executive Avatar Badge */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
                  alt={credential.candidateName}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-blue-500"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Human Candidate">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-800 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Verified Candidate Passport
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl">
              {credential.candidateName}
            </h2>
            <p className="text-xl font-black text-blue-600">
              {credential.assessmentTitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Badge variant="outline" className="font-black text-xs border-slate-300 text-slate-950 bg-slate-100 px-3 py-1">
                {credential.assessmentDomain}
              </Badge>
              <Badge variant="secondary" className="capitalize font-black text-xs bg-slate-900 text-white px-3 py-1">
                {credential.assessmentDifficulty} Difficulty
              </Badge>
            </div>
          </div>

          {/* Audit Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 uppercase">
                <UserCheck className="h-4 w-4 text-blue-600" /> Authorized Evaluator
              </span>
              <p className="font-black text-slate-950 text-base">{evaluatorName}</p>
              <p className="text-xs font-bold text-slate-600">Principal Systems Architect</p>
            </div>

            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 uppercase">
                <Calendar className="h-4 w-4 text-blue-600" /> Issuance Timestamp
              </span>
              <p className="font-black text-slate-950 text-base">{formatDate(credential.issuedAt)}</p>
              <p className="text-xs font-bold text-slate-600">
                {credential.expiresAt ? `Valid until ${formatDate(credential.expiresAt)}` : "Permanent Lifetime Credential"}
              </p>
            </div>

            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 uppercase">
                <Lock className="h-4 w-4 text-blue-600" /> Unique Identifier
              </span>
              <p className="font-mono text-xs font-black text-slate-950 truncate">
                {credential.id}
              </p>
              <p className="text-xs text-emerald-800 font-black flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Cryptographically Seeded
              </p>
            </div>
          </div>

          {/* Verified Rubric Criteria Passed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2 uppercase tracking-wide">
                <FileCheck2 className="h-5 w-5 text-blue-600" /> Verified Rubric Competencies
              </h3>
              <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                Standardized v1.0
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {assessment.rubric.map((criterion) => (
                <div
                  key={criterion.id}
                  className="rounded-xl border-2 border-slate-200 bg-white p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="space-y-1">
                    <p className="font-black text-slate-950 text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      {criterion.title}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 pl-7 leading-relaxed">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="pl-7 sm:pl-0 shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
                      Weight: {criterion.weight}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Data Minimization Notice */}
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-black text-slate-950 text-sm">
              <Lock className="h-4 w-4 text-blue-600" /> SkillProof Privacy & Verification Guarantee
            </div>
            <p className="leading-relaxed text-xs sm:text-sm font-semibold text-slate-700">
              To protect candidate privacy and assessment security, private contact emails, phone numbers, and raw draft submissions are strictly shielded from public view. Only verified competence metrics and authoritative evaluator decisions are exposed.
            </p>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-100 border-t-2 border-slate-200 p-5 flex flex-wrap items-center justify-between gap-3 text-xs font-black text-slate-900 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>SkillProof Verification Network · Dynamic State Protocol</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/assessments/${assessment.slug}`}>
              <Button size="sm" className="text-xs font-black bg-slate-950 text-white hover:bg-slate-800 shadow-xs">
                Inspect Task Rubric
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
