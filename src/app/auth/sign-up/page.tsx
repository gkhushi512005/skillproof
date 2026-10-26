"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCheck, Award, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { signUpAction } from "@/actions/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<"candidate" | "evaluator">("candidate");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessNotice(null);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const result = await signUpAction(formData);

    if (!result.success) {
      setError(result.error || "Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (result.redirectTo?.includes("registered=true")) {
      setSuccessNotice("Account created! Please check your email to confirm your account, then sign in.");
      setIsLoading(false);
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-lg shadow-md border-slate-300 dark:border-slate-800">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">Create your SkillProof Account</CardTitle>
          <CardDescription className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Join the verified skills network and build tamper-evident trust.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border-2 border-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-bold text-rose-950 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successNotice && (
            <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Select Your Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 p-3.5 text-center transition-all ${
                    role === "candidate"
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary"
                      : "border-slate-300 bg-card text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <UserCheck className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-black text-foreground">Candidate</span>
                  <span className="text-[11px] font-medium text-slate-600">Take challenges & earn proof</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("evaluator")}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 p-3.5 text-center transition-all ${
                    role === "evaluator"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-2 ring-indigo-600"
                      : "border-slate-300 bg-card text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Award className="h-6 w-6 mb-1.5" />
                  <span className="text-xs font-black text-foreground">Evaluator</span>
                  <span className="text-[11px] font-medium text-slate-600">Grade rubric evidence</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Full Legal / Professional Name</label>
              <Input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Email Address</label>
              <Input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Password (min 8 characters)</label>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-medium"
              />
            </div>

            <Button type="submit" className="w-full font-bold shadow-xs mt-2" disabled={isLoading}>
              {isLoading ? "Creating Account..." : `Register as ${role === "candidate" ? "Candidate" : "Evaluator"}`}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-200 dark:border-slate-800 py-4 text-xs font-medium text-slate-700 dark:text-slate-300">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary font-bold hover:underline ml-1">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
