"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Github, Linkedin, CheckCircle2, Lock, AlertCircle } from "lucide-react";
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
                <Github className="h-4 w-4 text-slate-800 dark:text-slate-200" /> GitHub Profile URL
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
                <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn Profile URL
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
