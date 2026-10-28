"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Printer, Share2, Code } from "lucide-react";

interface CredentialActionsProps {
  credentialId: string;
  candidateName: string;
  assessmentTitle: string;
}

export function CredentialActions({
  credentialId,
  candidateName,
  assessmentTitle,
}: CredentialActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const getVerifyUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/verify/${credentialId}`;
    }
    return `https://skillproof.vercel.app/verify/${credentialId}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getVerifyUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const embedCode = `<a href="${getVerifyUrl()}" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/SkillProof-Verified%20${encodeURIComponent(assessmentTitle)}-0ea5e9?style=for-the-badge&logo=shield" alt="SkillProof Verified" />
</a>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2500);
  };

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    getVerifyUrl()
  )}`;

  return (
    <div className="flex flex-col gap-3 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          size="sm"
          className="text-xs font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Copied Verification Link!
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Copy Shareable Link
            </>
          )}
        </Button>

        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="text-xs font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Print / Save PDF
        </Button>

        <Button
          onClick={() => setShowEmbed(!showEmbed)}
          variant="outline"
          size="sm"
          className="text-xs font-bold border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Code className="mr-1.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Embed Badge
        </Button>

        <a
          href={linkedInShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-bold bg-[#0A66C2] hover:bg-[#004182] text-white px-3 py-1.5 rounded-md transition-colors"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share to LinkedIn
        </a>
      </div>

      {showEmbed && (
        <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3.5 text-xs space-y-2 mt-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">HTML Portfolio Embed Snippet:</span>
            <Button
              onClick={handleCopyEmbed}
              size="sm"
              variant="secondary"
              className="h-7 text-[11px] font-bold"
            >
              {embedCopied ? "Copied Snippet!" : "Copy HTML"}
            </Button>
          </div>
          <pre className="p-2.5 rounded bg-slate-200 dark:bg-slate-950 font-mono text-[11px] text-slate-900 dark:text-slate-200 overflow-x-auto select-all">
            {embedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
