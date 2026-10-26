"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { Profile, UserRole } from "@/types";

// Input validation schemas
const SignUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["candidate", "evaluator"]),
});

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Server Action: Registers a new user with Supabase Auth
 * Automatically creates a row in public.profiles via the database trigger.
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const parsed = SignUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { fullName, email, password, role } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // If user session is immediately created (email confirmation disabled in Supabase)
  if (data.session) {
    revalidatePath("/", "layout");
    const destination = role === "evaluator" ? "/evaluator" : "/dashboard";
    return {
      success: true,
      redirectTo: destination,
    };
  }

  // If email confirmation is required
  return {
    success: true,
    redirectTo: "/auth/sign-in?registered=true",
  };
}

/**
 * Server Action: Authenticates an existing user and determines role-based redirect
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = SignInSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid credentials",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message === "Invalid login credentials"
        ? "Invalid email or password. Please verify your credentials."
        : error.message,
    };
  }

  // Fetch verified profile role strictly from PostgreSQL
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  revalidatePath("/", "layout");

  const destination = profile?.role === "evaluator" ? "/evaluator" : "/dashboard";
  return {
    success: true,
    redirectTo: destination,
  };
}

/**
 * Server Action: Signs out the active user and invalidates session cookies
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Server Query: Retrieves the current authenticated user's profile
 * Returns null if unauthenticated.
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) return null;

    return {
      id: profile.id,
      role: profile.role as UserRole,
      fullName: profile.full_name,
      headline: profile.headline || undefined,
      bio: profile.bio || undefined,
      githubUrl: profile.github_url || undefined,
      linkedinUrl: profile.linkedin_url || undefined,
      avatarUrl: profile.avatar_url || undefined,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  } catch (err) {
    console.error("Failed to retrieve current user profile:", err);
    return null;
  }
}
