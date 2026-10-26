import * as React from "react";
import { SubmissionStatus, CredentialStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileEdit,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface StatusBadgeProps {
  status: SubmissionStatus | CredentialStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    // Submission Statuses
    case "draft":
      return (
        <Badge variant="secondary" className={`font-bold border-slate-300 text-slate-800 ${className}`}>
          <FileEdit className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
          Draft
        </Badge>
      );
    case "submitted":
      return (
        <Badge variant="info" className={`font-bold ${className}`}>
          <Clock className="mr-1.5 h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
          Submitted
        </Badge>
      );
    case "under_review":
      return (
        <Badge variant="info" className={`bg-blue-100 border-blue-300 text-blue-950 dark:bg-blue-950 dark:text-blue-200 font-bold ${className}`}>
          <Clock className="mr-1.5 h-3.5 w-3.5 text-blue-700 animate-pulse" />
          Under Review
        </Badge>
      );
    case "changes_requested":
      return (
        <Badge variant="warning" className={`bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-950 dark:text-amber-200 font-bold ${className}`}>
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-amber-700" />
          Changes Requested
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="success" className={`bg-emerald-100 border-emerald-400 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 font-bold ${className}`}>
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-700" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className={`bg-rose-100 border-rose-400 text-rose-950 dark:bg-rose-950 dark:text-rose-200 font-bold ${className}`}>
          <XCircle className="mr-1.5 h-3.5 w-3.5 text-rose-700" />
          Rejected
        </Badge>
      );

    // Credential Statuses
    case "valid":
      return (
        <Badge variant="success" className={`bg-emerald-100 border-emerald-400 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 font-bold ${className}`}>
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-700" />
          Verified Active
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="secondary" className={`bg-slate-200 border-slate-300 text-slate-800 font-bold ${className}`}>
          <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-700" />
          Expired
        </Badge>
      );
    case "revoked":
      return (
        <Badge variant="destructive" className={`bg-rose-100 border-rose-400 text-rose-950 dark:bg-rose-950 dark:text-rose-200 font-bold ${className}`}>
          <ShieldAlert className="mr-1.5 h-3.5 w-3.5 text-rose-700" />
          Revoked
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
