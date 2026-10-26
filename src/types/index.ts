export type UserRole = "candidate" | "evaluator" | "admin";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected";

export type CredentialStatus = "valid" | "expired" | "revoked";

export type AssessmentDifficulty = "beginner" | "intermediate" | "advanced";

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  headline?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  weight: number; // e.g. 25 (%)
  maxPoints: number; // e.g. 5
}

export interface Assessment {
  id: string;
  slug: string;
  title: string;
  domain: "Web Development" | "Data Engineering" | "Cloud & DevOps" | "Product Design";
  difficulty: AssessmentDifficulty;
  estimatedHours: number;
  summary: string;
  instructionsMarkdown: string;
  submissionRequirements: {
    requiresRepoUrl: boolean;
    requiresLiveUrl: boolean;
    requiresExplanation: boolean;
    requiresFileUpload: boolean;
    allowedMimeTypes?: string[];
  };
  rubric: RubricCriterion[];
  createdAt: string;
}

export interface Submission {
  id: string;
  candidateId: string;
  assessmentId: string;
  status: SubmissionStatus;
  repoUrl?: string;
  liveUrl?: string;
  notesText?: string;
  fileAttachmentPath?: string;
  fileAttachmentName?: string;
  submittedAt?: string;
  updatedAt: string;
}

export interface EvaluationScore {
  criterionId: string;
  pointsAwarded: number;
  comments?: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  evaluatorId: string;
  evaluatorName: string;
  decision: "approved" | "rejected" | "revision_requested";
  totalScore: number; // e.g. 88 (%)
  scores: EvaluationScore[];
  generalFeedback: string;
  evaluatedAt: string;
}

export interface Credential {
  id: string; // Public identifier: skp_live_...
  candidateId: string;
  candidateName: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentDomain: string;
  assessmentDifficulty: AssessmentDifficulty;
  evaluationId: string;
  status: CredentialStatus;
  issuedAt: string;
  expiresAt: string | null;
  verificationUrl: string;
}
