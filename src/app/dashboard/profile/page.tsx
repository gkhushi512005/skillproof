"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2, Lock, AlertCircle, Globe } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
import { updateProfileAction } from "@/actions/profile";
import { createClient } from "@/lib/supabase/client";

export default function CandidateProfilePage() {
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [role, setRole] = useState("candidate");
  const [userId, setUserId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setHeadline(profile.headline || "");
          setBio(profile.bio || "");
          setGithubUrl(profile.github_url || "");
          setLinkedinUrl(profile.linkedin_url || "");
          setRole(profile.role || "candidate");
        } else {
          setFullName(user.user_metadata?.full_name || "");
          setRole(user.user_metadata?.role || "candidate");
        }
      } else {
        // Fallback for visual preview before logging in
        setFullName("Alex Rivera");
        setHeadline("Senior Full-Stack Engineer | TypeScript & Cloud Architecture");
        setBio("Passionate about building resilient distributed systems, accessible web interfaces, and high-performance serverless backends.");
        setGithubUrl("https://github.com/alexrivera-dev");
        setLinkedinUrl("https://linkedin.com/in/alexrivera-dev");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("headline", headline);
    formData.append("bio", bio);
    formData.append("githubUrl", githubUrl);
    formData.append("linkedinUrl", linkedinUrl);

    const result = await updateProfileAction(formData);

    setIsSaving(false);
    if (!result.success) {
      setError(result.error || "Failed to update profile.");
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Candidate Profile</h1>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
          Manage your verified identity, professional headline, and links shown on your verified credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-950 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Core Identity Card */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-primary" /> Verified Identity
              </CardTitle>
              <Badge variant="secondary" className="gap-1 text-xs font-bold border-slate-300">
                <Lock className="h-3.5 w-3.5 text-slate-700" /> Role: {role.toUpperCase()} (Locked)
              </Badge>
            </div>
            <CardDescription className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Account roles are enforced strictly on the server and cannot be edited via browser requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-primary">
                {fullName ? fullName.substring(0, 2).toUpperCase() : "SP"}
              </div>
              <div>
                <p className="text-base font-black text-foreground">{fullName || "SkillProof User"}</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ID: {userId ? userId.substring(0, 18) + "..." : "cand_alex_001"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Full Legal / Display Name</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="font-medium text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Professional Headline</label>
              <Input
                type="text"
                placeholder="e.g. Senior Frontend Engineer | TypeScript & Cloud Architecture"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="font-medium text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Professional Bio</label>
              <Textarea
                rows={3}
                placeholder="Brief summary of your technical focus..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="font-medium text-foreground text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verified Links */}
        <Card className="border-slate-300 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold">Professional Profiles</CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Displayed alongside your verified credentials for employers to review your public contributions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <GithubIcon className="h-4 w-4 text-slate-800 dark:text-slate-200" /> GitHub Profile URL
              </label>
              <Input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="font-medium text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <LinkedinIcon className="h-4 w-4 text-blue-600" /> LinkedIn Profile URL
              </label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="font-medium text-foreground"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 py-3.5">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Profile updated successfully!
              </span>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isSaving} size="sm" className="font-bold shadow-xs">
              {isSaving ? "Saving Changes..." : "Save Profile Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
