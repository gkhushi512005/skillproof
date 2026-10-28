"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { signInAction } from "@/actions/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signInAction(formData);

    if (!result.success) {
      setError(result.error || "Authentication failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-md border-slate-300 dark:border-slate-800">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">Sign in to SkillProof</CardTitle>
          <CardDescription className="text-xs font-semibold text-slate-700">
            Access your skills passport, submit evidence, or conduct rubric reviews.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg border-2 border-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-bold text-rose-950 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Work Email Address</label>
              <Input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
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
              {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>

          {/* Development Quick-Fill Helper */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] font-semibold text-slate-600">
              Need a test account? Register as a <strong>Candidate</strong> or <strong>Evaluator</strong> in seconds.
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-200 dark:border-slate-800 py-4 text-xs font-medium text-slate-700">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/sign-up" className="text-primary font-bold hover:underline ml-1">
            Create an Account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
