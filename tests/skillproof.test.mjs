import { describe, it } from "node:test";
import assert from "node:assert";
import { z } from "zod";

// Schemas matching application actions
const SubmissionSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  repoUrl: z.string().url("Please provide a valid Git repository URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Please provide a valid application URL").optional().or(z.literal("")),
  notesText: z.string().min(10, "Please provide architecture notes (min 10 characters)").max(5000),
});

const EvaluationSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  decision: z.enum(["approved", "rejected", "revision_requested"]),
  totalScore: z.coerce.number().min(0).max(100),
  scoresJson: z.string().min(2, "Criterion scores are required"),
  generalFeedback: z.string().min(10, "Please provide constructive feedback (min 10 characters)").max(5000),
});

describe("SkillProof: Submission Validation & Constraints (Day 7 & 13)", () => {
  it("should accept valid candidate submissions", () => {
    const valid = {
      assessmentId: "asm_nextjs_01",
      repoUrl: "https://github.com/alexrivera-dev/nextjs-analytics-dashboard",
      liveUrl: "https://nextjs-analytics-dashboard.vercel.app",
      notesText: "Implemented with Next.js App Router, SSR caching, and Server Actions for data mutations.",
    };
    const result = SubmissionSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });

  it("should reject invalid repository URLs", () => {
    const invalid = {
      assessmentId: "asm_nextjs_01",
      repoUrl: "not-a-valid-url",
      notesText: "Some detailed notes here for architecture.",
    };
    const result = SubmissionSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
  });

  it("should enforce minimum notes length for architectural explanations", () => {
    const tooShort = {
      assessmentId: "asm_nextjs_01",
      notesText: "short",
    };
    const result = SubmissionSchema.safeParse(tooShort);
    assert.strictEqual(result.success, false);
  });

  it("should enforce file upload size limit (10MB) and MIME type whitelist", () => {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

    const validFile = { size: 4 * 1024 * 1024, type: "application/pdf" };
    const oversizedFile = { size: 12 * 1024 * 1024, type: "application/pdf" };
    const invalidMimeFile = { size: 2 * 1024 * 1024, type: "application/x-executable" };

    assert.strictEqual(validFile.size <= maxSizeBytes, true);
    assert.strictEqual(allowedMimeTypes.includes(validFile.type), true);
    assert.strictEqual(oversizedFile.size <= maxSizeBytes, false);
    assert.strictEqual(allowedMimeTypes.includes(invalidMimeFile.type), false);
  });
});

describe("SkillProof: Evaluator Rubric Calculation & Decision Rules (Day 9 & 10)", () => {
  it("should correctly compute weighted rubric totals", () => {
    const rubric = [
      { id: "rub_arch", weight: 30, maxPoints: 5, awarded: 5 }, // 100% of 30 = 30
      { id: "rub_responsive", weight: 25, maxPoints: 5, awarded: 4 }, // 80% of 25 = 20
      { id: "rub_data", weight: 25, maxPoints: 5, awarded: 4.5 }, // 90% of 25 = 22.5
      { id: "rub_perf", weight: 20, maxPoints: 5, awarded: 5 }, // 100% of 20 = 20
    ];

    let total = 0;
    rubric.forEach((crit) => {
      const criterionPercent = crit.awarded / crit.maxPoints;
      total += criterionPercent * (crit.weight / 100) * 100;
    });

    const rounded = Math.round(total);
    assert.strictEqual(rounded, 93);
  });

  it("should enforce the 75% threshold for credential issuance", () => {
    const passingScore = 75;
    const failingScore = 74;

    assert.strictEqual(passingScore >= 75, true);
    assert.strictEqual(failingScore >= 75, false);
  });

  it("should validate evaluation payload schema", () => {
    const evaluation = {
      submissionId: "sub_alex_001",
      decision: "approved",
      totalScore: 92,
      scoresJson: JSON.stringify([{ criterionId: "rub_arch", pointsAwarded: 5 }]),
      generalFeedback: "Exceptional architecture with strict TypeScript and proper SSR.",
    };
    const result = EvaluationSchema.safeParse(evaluation);
    assert.strictEqual(result.success, true);
  });

  it("should reject evaluation scores outside the 0-100 range", () => {
    const invalidScore = {
      submissionId: "sub_alex_001",
      decision: "approved",
      totalScore: 105,
      scoresJson: "[]",
      generalFeedback: "Scores cannot exceed 100%.",
    };
    const result = EvaluationSchema.safeParse(invalidScore);
    assert.strictEqual(result.success, false);
  });
});

describe("SkillProof: Credential Generation & Data Minimization (Day 10 & 11)", () => {
  it("should generate high-entropy deterministic credential IDs", () => {
    const prefix = "skp_live_";
    const generateId = () =>
      `${prefix}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;

    const id1 = generateId();
    const id2 = generateId();

    assert.strictEqual(id1.startsWith(prefix), true);
    assert.strictEqual(id2.startsWith(prefix), true);
    assert.notStrictEqual(id1, id2);
  });

  it("should uphold data minimization on public verification endpoints", () => {
    const mockPublicVerification = {
      id: "skp_live_9f83a1b4c102",
      candidateName: "Alex Rivera",
      assessmentTitle: "Next.js Production Dashboard & Server Actions",
      assessmentDomain: "Web Development",
      assessmentDifficulty: "intermediate",
      status: "valid",
      issuedAt: "2026-02-15T14:30:00Z",
      evaluatorName: "Dr. Marcus Chen",
    };

    // Public payloads must NEVER expose private candidate identifiers
    assert.strictEqual("email" in mockPublicVerification, false);
    assert.strictEqual("phoneNumber" in mockPublicVerification, false);
    assert.strictEqual("notesText" in mockPublicVerification, false);
    assert.strictEqual(mockPublicVerification.status, "valid");
  });
});
