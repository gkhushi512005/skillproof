-- ====================================================================
-- SkillProof: Seed Data for Assessments and Rubrics
-- ====================================================================

-- 1. Assessment: Web Development
INSERT INTO public.assessments (
  id,
  slug,
  title,
  domain,
  difficulty,
  estimated_hours,
  summary,
  instructions_markdown,
  requires_repo_url,
  requires_live_url,
  requires_explanation,
  requires_file_upload,
  allowed_mime_types
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'nextjs-fullstack-dashboard',
  'Next.js Production Dashboard & Server Actions',
  'Web Development',
  'intermediate',
  6,
  'Design and implement a responsive analytics dashboard with server-side data fetching, optimistic UI mutations, and role-based access control.',
  '### Task Overview
Build a resilient web dashboard in Next.js App Router that ingests mock analytical data and renders real-time metric cards, interactive chart filters, and server action mutations.

### Technical Deliverables
1. **Responsive Layout:** Must support mobile viewport (375px), tablet (768px), and widescreen desktop (1440px) without horizontal scrollbar.
2. **Server Actions & Mutations:** Implement form mutations using Server Actions with optimistic state updates and Zod validation.
3. **Data Fetching & Caching:** Use React Server Components with proper streaming, suspense boundaries, and error fallbacks.
4. **Clean Code & Typings:** TypeScript strict mode enabled with zero `any` types.',
  true,
  true,
  true,
  true,
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
) ON CONFLICT (slug) DO NOTHING;

-- Rubrics for Next.js Assessment
INSERT INTO public.assessment_rubrics (
  assessment_id,
  version,
  criterion_id,
  title,
  description,
  weight,
  max_points
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  1,
  'rub_arch',
  'Architectural Pattern & Clean Code',
  'Idiomatic use of Next.js App Router, separation of client/server concerns, strict TypeScript.',
  30.00,
  5.00
),
(
  '11111111-1111-1111-1111-111111111111',
  1,
  'rub_responsive',
  'Responsive Design & Accessibility',
  'Fluid UI hierarchy across breakpoints (375px, 768px, 1440px), semantic HTML, and ARIA labels.',
  25.00,
  5.00
),
(
  '11111111-1111-1111-1111-111111111111',
  1,
  'rub_data',
  'State Management & Server Actions',
  'Optimistic UI updates, server validation using Zod, graceful error boundaries.',
  25.00,
  5.00
),
(
  '11111111-1111-1111-1111-111111111111',
  1,
  'rub_perf',
  'Performance & Evidence Documentation',
  'Clear architectural explanation in submission, clean git commit history, and live preview.',
  20.00,
  5.00
) ON CONFLICT (assessment_id, version, criterion_id) DO NOTHING;

-- 2. Assessment: Data Engineering
INSERT INTO public.assessments (
  id,
  slug,
  title,
  domain,
  difficulty,
  estimated_hours,
  summary,
  instructions_markdown,
  requires_repo_url,
  requires_live_url,
  requires_explanation,
  requires_file_upload,
  allowed_mime_types
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'postgres-etl-pipeline',
  'PostgreSQL Data Pipeline & Performance Tuning',
  'Data Engineering',
  'advanced',
  8,
  'Construct a resilient SQL ETL pipeline capable of batching 500k event logs, creating normalized partition tables, and optimizing query latency under 15ms.',
  '### Task Overview
Design an idempotent ETL migration pipeline in PostgreSQL that ingests raw telemetry JSON data, deduplicates records, and maintains analytical aggregates.

### Technical Deliverables
1. **Schema Design:** Normalized third normal form (3NF) relational tables with appropriate composite keys and foreign keys.
2. **Query Optimization:** Provide EXPLAIN ANALYZE logs demonstrating index utilization on high-cardinality lookups.
3. **Transaction Safety:** Wrap ingestion in atomic transactions with rollback triggers upon schema mismatch.',
  true,
  false,
  true,
  true,
  ARRAY['application/pdf']
) ON CONFLICT (slug) DO NOTHING;

-- Rubrics for PostgreSQL Assessment
INSERT INTO public.assessment_rubrics (
  assessment_id,
  version,
  criterion_id,
  title,
  description,
  weight,
  max_points
) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  1,
  'rub_pg_schema',
  'Schema Normalization & Constraints',
  'Effective table structures, constraint enforcement, and partition strategy.',
  35.00,
  5.00
),
(
  '22222222-2222-2222-2222-222222222222',
  1,
  'rub_pg_perf',
  'Index Efficiency & Latency',
  'Query plan analysis, proper B-Tree / GIN indexing, execution time under target.',
  35.00,
  5.00
),
(
  '22222222-2222-2222-2222-222222222222',
  1,
  'rub_pg_robustness',
  'Idempotency & Error Recovery',
  'Safe re-runs without duplicate insertion or data corruption.',
  30.00,
  5.00
) ON CONFLICT (assessment_id, version, criterion_id) DO NOTHING;

-- 3. Assessment: Cloud & DevOps
INSERT INTO public.assessments (
  id,
  slug,
  title,
  domain,
  difficulty,
  estimated_hours,
  summary,
  instructions_markdown,
  requires_repo_url,
  requires_live_url,
  requires_explanation,
  requires_file_upload,
  allowed_mime_types
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'cloud-zero-trust-auth',
  'Zero-Trust Multi-Tenant Auth Service',
  'Cloud & DevOps',
  'advanced',
  10,
  'Implement a zero-trust authentication boundary using JWT with asymmetric signature verification, role-based access control, and rate limiting.',
  '### Task Overview
Create a hardened API gateway authentication filter that inspects incoming cryptographic tokens, validates tenant claims, and enforces granular permission scopes.',
  true,
  true,
  true,
  false,
  ARRAY['application/pdf']
) ON CONFLICT (slug) DO NOTHING;

-- Rubrics for Cloud Assessment
INSERT INTO public.assessment_rubrics (
  assessment_id,
  version,
  criterion_id,
  title,
  description,
  weight,
  max_points
) VALUES
(
  '33333333-3333-3333-3333-333333333333',
  1,
  'rub_jwt_sec',
  'Cryptographic Integrity',
  'Proper public key caching, expiration enforcement, and token rejection tests.',
  40.00,
  5.00
),
(
  '33333333-3333-3333-3333-333333333333',
  1,
  'rub_rbac',
  'Role Enforcement & Tenant Isolation',
  'Zero cross-tenant data leakage or privilege escalation potential.',
  40.00,
  5.00
),
(
  '33333333-3333-3333-3333-333333333333',
  1,
  'rub_rate_limit',
  'Abuse Mitigation',
  'Sliding window rate-limiting implementation.',
  20.00,
  5.00
) ON CONFLICT (assessment_id, version, criterion_id) DO NOTHING;

-- 4. Assessment: Product Design
INSERT INTO public.assessments (
  id,
  slug,
  title,
  domain,
  difficulty,
  estimated_hours,
  summary,
  instructions_markdown,
  requires_repo_url,
  requires_live_url,
  requires_explanation,
  requires_file_upload,
  allowed_mime_types
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'accessible-design-system',
  'Accessible Component System & WCAG 2.1 AAA',
  'Product Design',
  'intermediate',
  4,
  'Build a polished design token library and primitive component suite guaranteeing full keyboard navigation, screen reader compatibility, and 7:1 contrast.',
  '### Task Overview
Deliver 6 core component primitives (Dialog, Combobox, Tabs, Data Table, Toast, Slider) following WAI-ARIA authoring practices.',
  true,
  true,
  true,
  true,
  ARRAY['application/pdf', 'image/png']
) ON CONFLICT (slug) DO NOTHING;

-- Rubrics for Product Design Assessment
INSERT INTO public.assessment_rubrics (
  assessment_id,
  version,
  criterion_id,
  title,
  description,
  weight,
  max_points
) VALUES
(
  '44444444-4444-4444-4444-444444444444',
  1,
  'rub_a11y',
  'Keyboard & Screen Reader Accessibility',
  'Focus trapping, Esc key dismissal, correct aria-expanded / aria-controls attributes.',
  50.00,
  5.00
),
(
  '44444444-4444-4444-4444-444444444444',
  1,
  'rub_token_sys',
  'Design Token Architecture',
  'Consistent spacing, color contrast adhering to WCAG 2.1 AAA standards.',
  30.00,
  5.00
),
(
  '44444444-4444-4444-4444-444444444444',
  1,
  'rub_doc',
  'Storybook / Visual Documentation',
  'Clear interactive component playground and usage guidelines.',
  20.00,
  5.00
) ON CONFLICT (assessment_id, version, criterion_id) DO NOTHING;
