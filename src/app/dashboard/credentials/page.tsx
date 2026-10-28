"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCandidateCredentialsData } from "@/actions/submissions";
import { MOCK_CREDENTIALS } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Award,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function CandidateCredentialsPage() {
  const [credentials, setCredentials] = useState<any[]>(MOCK_CREDENTIALS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadCreds = async () => {
      const data = await getCandidateCredentialsData();
      if (data && data.length > 0) {
        setCredentials(data);
      }
    };
    loadCreds();
  }, []);

  const handleCopyLink = (credId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const fullUrl = `${origin}/verify/${credId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(credId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black text-primary mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Portable Skills Passport</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Verified Credentials</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">
          Cryptographically issued credentials backed by authorized human rubric evaluations. Share these links directly with employers.
        </p>
      </div>

      {credentials.length === 0 ? (
        <Card className="p-10 text-center border-slate-300">
          <Award className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <CardTitle className="text-base font-bold">No Credentials Issued Yet</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-700 mt-1">
            Complete and pass an assessment to earn your first verified skills credential.
          </CardDescription>
          <Link href="/assessments">
            <Button size="sm" className="mt-4 font-bold">
              Browse Assessments
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((credential) => (
            <Card
              key={credential.id}
              className="relative overflow-hidden border-2 border-slate-300 dark:border-slate-800 bg-card shadow-sm"
            >
              {/* Top Accent Ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100 dark:bg-slate-800">
                    {credential.assessmentDomain}
                  </Badge>
                  <StatusBadge status={credential.status} />
                </div>

                <CardTitle className="text-xl font-bold text-foreground leading-snug">
                  {credential.assessmentTitle}
                </CardTitle>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Recipient: <strong className="text-foreground font-black">{credential.candidateName}</strong></span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                {/* Meta details */}
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 text-xs space-y-2 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" /> Issued Date:
                    </span>
                    <span className="font-bold text-foreground">{formatDate(credential.issuedAt)}</span>
                  </div>
                  {credential.expiresAt && (
                    <div className="flex items-center justify-between text-slate-700 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" /> Valid Until:
                      </span>
                      <span className="font-bold text-foreground">{formatDate(credential.expiresAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-700 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-bold">Credential ID:</span>
                    <span className="font-mono text-xs font-black text-slate-900 truncate max-w-[170px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {credential.id}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(credential.id)}
                  className="text-xs font-bold gap-1.5 border-slate-300 text-slate-800"
                >
                  {copiedId === credential.id ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" /> Copied Link!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Link
                    </>
                  )}
                </Button>

                <Link href={`/verify/${credential.id}`} target="_blank">
                  <Button size="sm" className="text-xs gap-1.5 font-bold">
                    Public Verification Page <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
