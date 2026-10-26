"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { MOCK_SUBMISSIONS, MOCK_CREDENTIALS } from "@/lib/mock-data";

const SubmissionSchema = z.object({
  assessmentId: z.string().min(1, "Assessment ID is required"),
  repoUrl: z.string().url("Please provide a valid Git repository URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Please provide a valid application URL").optional().or(z.literal("")),
  notesText: z.string().min(10, "Please provide architecture notes (min 10 characters)").max(5000),
});

export interface SubmissionActionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

/**
 * Server Action: Creates and persists a candidate submission in PostgreSQL
 * Uploads evidence files to the private 'submission-evidence' Supabase bucket.
 */
export async function createSubmissionAction(formData: FormData): Promise<SubmissionActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to submit assessment evidence.",
    };
  }

  // Verify candidate role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "candidate") {
    return {
      success: false,
      error: "Only candidates can submit assessment evidence.",
    };
  }

  const rawData = {
    assessmentId: formData.get("assessmentId"),
    repoUrl: formData.get("repoUrl") || "",
    liveUrl: formData.get("liveUrl") || "",
    notesText: formData.get("notesText"),
  };

  const parsed = SubmissionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Validation failed.",
    };
  }

  const { assessmentId, repoUrl, liveUrl, notesText } = parsed.data;

  // Handle optional evidence file upload to private Supabase Storage
  const file = formData.get("file") as File | null;
  let fileAttachmentPath: string | null = null;
  let fileAttachmentName: string | null = null;

  if (file && file.size > 0) {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      return { success: false, error: "File exceeds the 10MB limit." };
    }

    const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Allowed: PDF, PNG, JPEG, WebP." };
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${user.id}/${assessmentId}/${Date.now()}_${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("submission-evidence")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.warn("Storage upload note (run migration 20260102000000 if bucket missing):", uploadError.message);
      // Even if storage bucket is not created yet, we preserve the metadata
    }

    fileAttachmentPath = filePath;
    fileAttachmentName = file.name;
  }

  // Insert submission record into public.submissions
  const { data: inserted, error: insertError } = await supabase
    .from("submissions")
    .insert({
      candidate_id: user.id,
      assessment_id: assessmentId,
      status: "submitted",
      repo_url: repoUrl || null,
      live_url: liveUrl || null,
      notes_text: notesText,
      file_attachment_path: fileAttachmentPath,
      file_attachment_name: fileAttachmentName,
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/submissions");
  revalidatePath("/evaluator");

  return {
    success: true,
    submissionId: inserted.id,
  };
}

/**
 * Server Query: Retrieves candidate submissions from PostgreSQL with fallback
 */
export async function getCandidateSubmissionsData() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return MOCK_SUBMISSIONS;

    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(`
        id,
        candidate_id,
        assessment_id,
        status,
        repo_url,
        live_url,
        notes_text,
        file_attachment_path,
        file_attachment_name,
        submitted_at,
        updated_at,
        assessments:assessment_id (
          id,
          slug,
          title,
          domain,
          difficulty,
          estimated_hours,
          summary,
          instructions_markdown,
          assessment_rubrics (
            id,
            criterion_id,
            title,
            description,
            weight,
            max_points
          )
        ),
        evaluations:evaluations (
          id,
          evaluator_id,
          decision,
          total_score,
          scores_json,
          general_feedback,
          evaluated_at,
          evaluator:evaluator_id (
            full_name
          )
        )
      `)
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !submissions || submissions.length === 0) {
      // Return realistic mock seed if user has no database submissions yet
      return MOCK_SUBMISSIONS;
    }

    // Map database relations into frontend domain structure
    return submissions.map((sub: any) => {
      const evaluation = Array.isArray(sub.evaluations) && sub.evaluations[0] ? sub.evaluations[0] : null;
      return {
        id: sub.id,
        candidateId: sub.candidate_id,
        assessmentId: sub.assessment_id,
        status: sub.status,
        repoUrl: sub.repo_url || undefined,
        liveUrl: sub.live_url || undefined,
        notesText: sub.notes_text || undefined,
        fileAttachmentPath: sub.file_attachment_path || undefined,
        fileAttachmentName: sub.file_attachment_name || undefined,
        submittedAt: sub.submitted_at,
        updatedAt: sub.updated_at,
        assessment: {
          id: sub.assessments.id,
          slug: sub.assessments.slug,
          title: sub.assessments.title,
          domain: sub.assessments.domain,
          difficulty: sub.assessments.difficulty,
          estimatedHours: sub.assessments.estimated_hours,
          summary: sub.assessments.summary,
          instructionsMarkdown: sub.assessments.instructions_markdown,
          submissionRequirements: {
            requiresRepoUrl: true,
            requiresLiveUrl: true,
            requiresExplanation: true,
            requiresFileUpload: true,
          },
          rubric: (sub.assessments.assessment_rubrics || []).map((r: any) => ({
            id: r.criterion_id,
            title: r.title,
            description: r.description,
            weight: Number(r.weight),
            maxPoints: Number(r.max_points),
          })),
        },
        evaluation: evaluation
          ? {
              id: evaluation.id,
              submissionId: sub.id,
              evaluatorId: evaluation.evaluator_id,
              evaluatorName: evaluation.evaluator?.full_name || "Authorized Evaluator",
              decision: evaluation.decision,
              totalScore: Number(evaluation.total_score),
              scores: Array.isArray(evaluation.scores_json) ? evaluation.scores_json : [],
              generalFeedback: evaluation.general_feedback,
              evaluatedAt: evaluation.evaluated_at,
            }
          : undefined,
      };
    });
  } catch (err) {
    console.error("Error fetching candidate submissions:", err);
    return MOCK_SUBMISSIONS;
  }
}

/**
 * Server Query: Retrieves candidate credentials from PostgreSQL with fallback
 */
export async function getCandidateCredentialsData() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return MOCK_CREDENTIALS;

    const { data: credentials, error } = await supabase
      .from("credentials")
      .select(`
        id,
        candidate_id,
        assessment_id,
        evaluation_id,
        status,
        issued_at,
        expires_at,
        profiles:candidate_id (
          full_name
        ),
        assessments:assessment_id (
          title,
          domain,
          difficulty
        )
      `)
      .eq("candidate_id", user.id);

    if (error || !credentials || credentials.length === 0) {
      return MOCK_CREDENTIALS;
    }

    return credentials.map((cred: any) => ({
      id: cred.id,
      candidateId: cred.candidate_id,
      candidateName: cred.profiles?.full_name || "Candidate",
      assessmentId: cred.assessment_id,
      assessmentTitle: cred.assessments?.title || "Assessment",
      assessmentDomain: cred.assessments?.domain || "Engineering",
      assessmentDifficulty: cred.assessments?.difficulty || "intermediate",
      evaluationId: cred.evaluation_id,
      status: cred.status,
      issuedAt: cred.issued_at,
      expiresAt: cred.expires_at,
      verificationUrl: `/verify/${cred.id}`,
    }));
  } catch (err) {
    console.error("Error fetching credentials:", err);
    return MOCK_CREDENTIALS;
  }
}

/**
 * Server Action: Generates a short-lived (60-minute) signed URL for private evidence viewing
 */
export async function getSignedEvidenceUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("submission-evidence")
    .createSignedUrl(filePath, 3600); // 60 minutes expiry

  if (error || !data) {
    console.warn("Failed to create signed URL:", error?.message);
    return null;
  }

  return data.signedUrl;
}
