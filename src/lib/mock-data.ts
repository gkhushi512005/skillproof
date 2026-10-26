import { Assessment, Submission, Evaluation, Credential, Profile } from "@/types";

export const MOCK_CANDIDATE: Profile = {
  id: "cand_alex_001",
  role: "candidate",
  fullName: "Alex Rivera",
  headline: "Senior Full-Stack Engineer | TypeScript & Cloud Architecture",
  bio: "Passionate about building resilient distributed systems, accessible web interfaces, and high-performance serverless backends.",
  githubUrl: "https://github.com/alexrivera-dev",
  linkedinUrl: "https://linkedin.com/in/alexrivera-dev",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  createdAt: "2026-01-15T09:00:00Z",
  updatedAt: "2026-03-01T12:00:00Z",
};

export const MOCK_EVALUATOR: Profile = {
  id: "eval_dr_chen_042",
  role: "evaluator",
  fullName: "Dr. Marcus Chen",
  headline: "Principal Systems Architect · Authorized SkillProof Reviewer",
  bio: "15+ years in enterprise infrastructure, author of distributed systems patterns, verified reviewer for SkillProof Web & Cloud domains.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  createdAt: "2025-10-10T08:00:00Z",
  updatedAt: "2026-02-14T11:00:00Z",
};

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "asm_nextjs_01",
    slug: "nextjs-fullstack-dashboard",
    title: "Next.js Production Dashboard & Server Actions",
    domain: "Web Development",
    difficulty: "intermediate",
    estimatedHours: 6,
    summary:
      "Design and implement a responsive analytics dashboard with server-side data fetching, optimistic UI mutations, and role-based access control.",
    instructionsMarkdown: `
### Task Overview
Build a resilient web dashboard in Next.js App Router that ingests mock analytical data and renders real-time metric cards, interactive chart filters, and server action mutations.

### Technical Deliverables
1. **Responsive Layout:** Must support mobile viewport (375px), tablet (768px), and widescreen desktop (1440px) without horizontal scrollbar.
2. **Server Actions & Mutations:** Implement form mutations using Server Actions with optimistic state updates and Zod validation.
3. **Data Fetching & Caching:** Use React Server Components with proper streaming, suspense boundaries, and error fallbacks.
4. **Clean Code & Typings:** TypeScript strict mode enabled with zero \`any\` types.
`,
    submissionRequirements: {
      requiresRepoUrl: true,
      requiresLiveUrl: true,
      requiresExplanation: true,
      requiresFileUpload: true,
      allowedMimeTypes: ["application/pdf", "image/png", "image/jpeg"],
    },
    rubric: [
      {
        id: "rub_arch",
        title: "Architectural Pattern & Clean Code",
        description: "Idiomatic use of Next.js App Router, separation of client/server concerns, strict TypeScript.",
        weight: 30,
        maxPoints: 5,
      },
      {
        id: "rub_responsive",
        title: "Responsive Design & Accessibility",
        description: "Flawless UI hierarchy at 375px, 768px, and 1440px, semantic HTML, and ARIA labels.",
        weight: 25,
        maxPoints: 5,
      },
      {
        id: "rub_data",
        title: "State Management & Server Actions",
        description: "Optimistic UI updates, server validation using Zod, graceful error boundaries.",
        weight: 25,
        maxPoints: 5,
      },
      {
        id: "rub_perf",
        title: "Performance & Evidence Documentation",
        description: "Clear architectural explanation in submission, clean git commit history, and live preview.",
        weight: 20,
        maxPoints: 5,
      },
    ],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "asm_postgres_02",
    slug: "postgres-etl-pipeline",
    title: "PostgreSQL Data Pipeline & Performance Tuning",
    domain: "Data Engineering",
    difficulty: "advanced",
    estimatedHours: 8,
    summary:
      "Construct a resilient SQL ETL pipeline capable of batching 500k event logs, creating normalized partition tables, and optimizing query latency under 15ms.",
    instructionsMarkdown: `
### Task Overview
Design an idempotent ETL migration pipeline in PostgreSQL that ingests raw telemetry JSON data, deduplicates records, and maintains analytical aggregates.

### Technical Deliverables
1. **Schema Design:** Normalized third normal form (3NF) relational tables with appropriate composite keys and foreign keys.
2. **Query Optimization:** Provide \`EXPLAIN ANALYZE\` logs demonstrating index utilization on high-cardinality lookups.
3. **Transaction Safety:** Wrap ingestion in atomic transactions with rollback triggers upon schema mismatch.
`,
    submissionRequirements: {
      requiresRepoUrl: true,
      requiresLiveUrl: false,
      requiresExplanation: true,
      requiresFileUpload: true,
      allowedMimeTypes: ["application/pdf"],
    },
    rubric: [
      {
        id: "rub_pg_schema",
        title: "Schema Normalization & Constraints",
        description: "Effective table structures, constraint enforcement, and partition strategy.",
        weight: 35,
        maxPoints: 5,
      },
      {
        id: "rub_pg_perf",
        title: "Index Efficiency & Latency",
        description: "Query plan analysis, proper B-Tree / GIN indexing, execution time under target.",
        weight: 35,
        maxPoints: 5,
      },
      {
        id: "rub_pg_robustness",
        title: "Idempotency & Error Recovery",
        description: "Safe re-runs without duplicate insertion or data corruption.",
        weight: 30,
        maxPoints: 5,
      },
    ],
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "asm_cloud_03",
    slug: "cloud-zero-trust-auth",
    title: "Zero-Trust Multi-Tenant Auth Service",
    domain: "Cloud & DevOps",
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Implement a zero-trust authentication boundary using JWT with asymmetric signature verification, role-based access control, and rate limiting.",
    instructionsMarkdown: `
### Task Overview
Create a hardened API gateway authentication filter that inspects incoming cryptographic tokens, validates tenant claims, and enforces granular permission scopes.
`,
    submissionRequirements: {
      requiresRepoUrl: true,
      requiresLiveUrl: true,
      requiresExplanation: true,
      requiresFileUpload: false,
    },
    rubric: [
      {
        id: "rub_jwt_sec",
        title: "Cryptographic Integrity",
        description: "Proper public key caching, expiration enforcement, and token rejection tests.",
        weight: 40,
        maxPoints: 5,
      },
      {
        id: "rub_rbac",
        title: "Role Enforcement & Tenant Isolation",
        description: "Zero cross-tenant data leakage or privilege escalation potential.",
        weight: 40,
        maxPoints: 5,
      },
      {
        id: "rub_rate_limit",
        title: "Abuse Mitigation",
        description: "Sliding window rate-limiting implementation.",
        weight: 20,
        maxPoints: 5,
      },
    ],
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "asm_design_04",
    slug: "accessible-design-system",
    title: "Accessible Component System & WCAG 2.1 AAA",
    domain: "Product Design",
    difficulty: "intermediate",
    estimatedHours: 4,
    summary:
      "Build a polished design token library and primitive component suite guaranteeing full keyboard navigation, screen reader compatibility, and 7:1 contrast.",
    instructionsMarkdown: `
### Task Overview
Deliver 6 core component primitives (Dialog, Combobox, Tabs, Data Table, Toast, Slider) following WAI-ARIA authoring practices.
`,
    submissionRequirements: {
      requiresRepoUrl: true,
      requiresLiveUrl: true,
      requiresExplanation: true,
      requiresFileUpload: true,
      allowedMimeTypes: ["application/pdf", "image/png"],
    },
    rubric: [
      {
        id: "rub_a11y",
        title: "Keyboard & Screen Reader Accessibility",
        description: "Focus trapping, Esc key dismissal, correct aria-expanded / aria-controls attributes.",
        weight: 50,
        maxPoints: 5,
      },
      {
        id: "rub_token_sys",
        title: "Design Token Architecture",
        description: "Consistent spacing, color contrast adhering to WCAG 2.1 AAA standards.",
        weight: 30,
        maxPoints: 5,
      },
      {
        id: "rub_doc",
        title: "Storybook / Visual Documentation",
        description: "Clear interactive component playground and usage guidelines.",
        weight: 20,
        maxPoints: 5,
      },
    ],
    createdAt: "2026-02-15T00:00:00Z",
  },
];

export const MOCK_SUBMISSIONS: (Submission & { assessment: Assessment; evaluation?: Evaluation })[] = [
  {
    id: "sub_alex_001",
    candidateId: "cand_alex_001",
    assessmentId: "asm_nextjs_01",
    status: "approved",
    repoUrl: "https://github.com/alexrivera-dev/nextjs-analytics-dashboard",
    liveUrl: "https://analytics-dashboard-alex.vercel.app",
    notesText:
      "Implemented using Next.js 16 App Router with React Server Components. Used Tailwind CSS with strict semantic tokens, Zod for all form mutations, and Vitest for unit validation.",
    fileAttachmentName: "architecture-diagram-and-lighthouse-audit.pdf",
    submittedAt: "2026-03-02T14:22:00Z",
    updatedAt: "2026-03-04T10:15:00Z",
    assessment: MOCK_ASSESSMENTS[0],
    evaluation: {
      id: "eval_chen_101",
      submissionId: "sub_alex_001",
      evaluatorId: "eval_dr_chen_042",
      evaluatorName: "Dr. Marcus Chen",
      decision: "approved",
      totalScore: 94,
      scores: [
        { criterionId: "rub_arch", pointsAwarded: 5, comments: "Exceptional server/client component boundaries." },
        { criterionId: "rub_responsive", pointsAwarded: 5, comments: "Fluid layout behaves cleanly across all breakpoints." },
        { criterionId: "rub_data", pointsAwarded: 4.5, comments: "Very clean Zod error parsing in Server Actions." },
        { criterionId: "rub_perf", pointsAwarded: 4.5, comments: "100/100 Lighthouse performance score verified on live link." },
      ],
      generalFeedback:
        "Outstanding submission. The candidate demonstrated mastery over modern App Router paradigms, optimistic UI state handling, and accessible HTML semantics. Strong recommendation for senior frontend engineering roles.",
      evaluatedAt: "2026-03-04T10:15:00Z",
    },
  },
  {
    id: "sub_alex_002",
    candidateId: "cand_alex_001",
    assessmentId: "asm_postgres_02",
    status: "changes_requested",
    repoUrl: "https://github.com/alexrivera-dev/postgres-telemetry-etl",
    liveUrl: undefined,
    notesText:
      "Raw telemetry ingestion script with transaction rollback and monthly table partitioning. Includes sample migration files.",
    fileAttachmentName: "query-execution-plan-v1.pdf",
    submittedAt: "2026-03-08T18:40:00Z",
    updatedAt: "2026-03-10T09:30:00Z",
    assessment: MOCK_ASSESSMENTS[1],
    evaluation: {
      id: "eval_chen_102",
      submissionId: "sub_alex_002",
      evaluatorId: "eval_dr_chen_042",
      evaluatorName: "Dr. Marcus Chen",
      decision: "revision_requested",
      totalScore: 68,
      scores: [
        { criterionId: "rub_pg_schema", pointsAwarded: 4, comments: "Partition strategy by range is sound." },
        { criterionId: "rub_pg_perf", pointsAwarded: 2.5, comments: "Missing composite index on (tenant_id, timestamp_utc) causes sequential scan." },
        { criterionId: "rub_pg_robustness", pointsAwarded: 4, comments: "Idempotent ON CONFLICT logic correctly handles duplicates." },
      ],
      generalFeedback:
        "Good foundational pipeline architecture. However, on high-cardinality aggregate queries, the EXPLAIN plan reveals sequential table scans exceeding 180ms. Please add the recommended composite index, re-run EXPLAIN ANALYZE, and submit the updated execution plan.",
      evaluatedAt: "2026-03-10T09:30:00Z",
    },
  },
  {
    id: "sub_alex_003",
    candidateId: "cand_alex_001",
    assessmentId: "asm_design_04",
    status: "under_review",
    repoUrl: "https://github.com/alexrivera-dev/wcag-accessible-primitives",
    liveUrl: "https://accessible-ui-storybook.vercel.app",
    notesText:
      "Built 6 WCAG 2.1 AAA accessible primitives with keyboard navigation focus traps and Storybook documentation.",
    fileAttachmentName: "axe-core-automated-a11y-report.pdf",
    submittedAt: "2026-03-12T11:00:00Z",
    updatedAt: "2026-03-12T11:00:00Z",
    assessment: MOCK_ASSESSMENTS[3],
  },
];

export const MOCK_CREDENTIALS: Credential[] = [
  {
    id: "skp_live_9f83a1b4c102",
    candidateId: "cand_alex_001",
    candidateName: "Alex Rivera",
    assessmentId: "asm_nextjs_01",
    assessmentTitle: "Next.js Production Dashboard & Server Actions",
    assessmentDomain: "Web Development",
    assessmentDifficulty: "intermediate",
    evaluationId: "eval_chen_101",
    status: "valid",
    issuedAt: "2026-03-04T10:15:00Z",
    expiresAt: "2028-03-04T10:15:00Z",
    verificationUrl: "/verify/skp_live_9f83a1b4c102",
  },
  {
    id: "skp_demo_expired_2024",
    candidateId: "cand_sarah_009",
    candidateName: "Sarah Connor",
    assessmentId: "asm_cloud_03",
    assessmentTitle: "Zero-Trust Multi-Tenant Auth Service",
    assessmentDomain: "Cloud & DevOps",
    assessmentDifficulty: "advanced",
    evaluationId: "eval_expired_001",
    status: "expired",
    issuedAt: "2024-01-10T08:00:00Z",
    expiresAt: "2026-01-10T08:00:00Z",
    verificationUrl: "/verify/skp_demo_expired_2024",
  },
  {
    id: "skp_revoked_plagiarism_99",
    candidateId: "cand_bad_actor_099",
    candidateName: "Jordan Smith",
    assessmentId: "asm_postgres_02",
    assessmentTitle: "PostgreSQL Data Pipeline & Performance Tuning",
    assessmentDomain: "Data Engineering",
    assessmentDifficulty: "advanced",
    evaluationId: "eval_revoked_099",
    status: "revoked",
    issuedAt: "2025-11-20T12:00:00Z",
    expiresAt: "2027-11-20T12:00:00Z",
    verificationUrl: "/verify/skp_revoked_plagiarism_99",
  },
];
