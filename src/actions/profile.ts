"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  headline: z.string().max(150).optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
  githubUrl: z
    .string()
    .url("Please provide a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Please provide a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
});

export interface ProfileActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Updates candidate or evaluator profile details.
 * Security enforcement: Strictly prohibits altering the 'role' column.
 */
export async function updateProfileAction(formData: FormData): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to update your profile.",
    };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    headline: formData.get("headline") || "",
    bio: formData.get("bio") || "",
    githubUrl: formData.get("githubUrl") || "",
    linkedinUrl: formData.get("linkedinUrl") || "",
  };

  const parsed = UpdateProfileSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid profile data",
    };
  }

  const { fullName, headline, bio, githubUrl, linkedinUrl } = parsed.data;

  // Perform database update with server-side RLS enforcement
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      headline: headline || null,
      bio: bio || null,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
    })
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
