"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, ArrowRight, Layers, FileCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AssessmentCataloguePage() {
  const [assessments, setAssessments] = useState<any[]>(MOCK_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("assessments")
          .select(`
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
            allowed_mime_types,
            assessment_rubrics (
              id,
              criterion_id,
              title,
              description,
              weight,
              max_points
            )
          `);

        if (data && data.length > 0) {
          const mapped = data.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            domain: a.domain,
            difficulty: a.difficulty,
            estimatedHours: a.estimated_hours,
            summary: a.summary,
            instructionsMarkdown: a.instructions_markdown,
            submissionRequirements: {
              requiresRepoUrl: a.requires_repo_url,
              requiresLiveUrl: a.requires_live_url,
              requiresExplanation: a.requires_explanation,
              requiresFileUpload: a.requires_file_upload,
              allowedMimeTypes: a.allowed_mime_types,
            },
            rubric: (a.assessment_rubrics || []).map((r: any) => ({
              id: r.criterion_id,
              title: r.title,
              description: r.description,
              weight: Number(r.weight),
              maxPoints: Number(r.max_points),
            })),
          }));
          setAssessments(mapped);
        }
      } catch (err) {
        console.warn("Using fallback assessments:", err);
      }
    };

    loadAssessments();
  }, []);

  const domains = ["All", "Web Development", "Data Engineering", "Cloud & DevOps", "Product Design"];
  const difficulties = ["All", "beginner", "intermediate", "advanced"];

  const filteredAssessments = assessments.filter((asm) => {
    const matchesSearch =
      asm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asm.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All" || asm.domain === selectedDomain;
    const matchesDifficulty = selectedDifficulty === "All" || asm.difficulty === selectedDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Standardized Assessments</h1>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Choose a challenge, review the evaluation rubric, and submit practical work evidence.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-md self-start md:self-auto">
          Showing {filteredAssessments.length} practical assessments
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-card p-4 shadow-2xs mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
          <Input
            placeholder="Search by assessment name, technologies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 font-medium"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mr-1 uppercase">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                selectedDomain === dom
                  ? "bg-primary text-white font-black shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mr-1 uppercase">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded-md px-3 py-1 text-xs font-bold capitalize transition-colors ${
                selectedDifficulty === diff
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <Layers className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">No assessments found</h3>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or removing active filters to see available challenges.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 font-bold border-slate-300"
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("All");
              setSelectedDifficulty("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="flex flex-col justify-between hover:border-primary transition-all border border-slate-300 dark:border-slate-800 shadow-2xs hover:shadow-xs"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-900 bg-slate-100 dark:bg-slate-800">
                    {assessment.domain}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      ~{assessment.estimatedHours} hrs
                    </span>
                    <Badge
                      variant={
                        assessment.difficulty === "beginner"
                          ? "success"
                          : assessment.difficulty === "intermediate"
                          ? "info"
                          : "warning"
                      }
                      className="capitalize text-[11px] font-bold"
                    >
                      {assessment.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
                  <Link href={`/assessments/${assessment.slug}`}>{assessment.title}</Link>
                </CardTitle>

                <CardDescription className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {assessment.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-3 text-xs space-y-1.5 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Evaluation Criteria:</span>
                    <span>{assessment.rubric.length} weighted rubrics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                    <FileCode className="h-3.5 w-3.5 text-primary" />
                    <span>
                      Requires:{" "}
                      {[
                        assessment.submissionRequirements.requiresRepoUrl && "Code Repo",
                        assessment.submissionRequirements.requiresLiveUrl && "Live Demo",
                        assessment.submissionRequirements.requiresFileUpload && "Architecture PDF",
                      ]
                        .filter(Boolean)
                        .join(" + ")}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={`/assessments/${assessment.slug}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View Details & Rubric <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/dashboard/submit/${assessment.slug}`}>
                  <Button size="sm" className="font-bold">Submit Evidence</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
