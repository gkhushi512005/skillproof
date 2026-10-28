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

const DOMAIN_IMAGES: Record<string, string> = {
  "Web Development": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  "Data Engineering": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "Cloud & DevOps": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  "Product Design": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80",
};

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
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">Standardized Assessments</h1>
          <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1">
            Choose a challenge, review the transparent evaluation rubric, and submit practical work evidence.
          </p>
        </div>
        <div className="text-xs font-black text-slate-900 bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-xl self-start md:self-auto shadow-2xs">
          Showing {filteredAssessments.length} practical assessments
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-600" />
          <Input
            placeholder="Search by assessment name, technologies, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-semibold text-slate-900 border-slate-300 focus:border-blue-600 h-10 rounded-xl"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-900 mr-1 uppercase">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                selectedDomain === dom
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-900 mr-1 uppercase">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black capitalize transition-all ${
                selectedDifficulty === diff
                  ? "bg-slate-950 text-white shadow-xs"
                  : "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white">
          <Layers className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-950">No assessments found</h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or removing active filters to see available challenges.
          </p>
          <Button
            size="sm"
            className="mt-4 font-black bg-blue-600 text-white hover:bg-blue-700"
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
          {filteredAssessments.map((assessment) => {
            const bannerImg =
              DOMAIN_IMAGES[assessment.domain] ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";

            return (
              <Card
                key={assessment.id}
                className="flex flex-col justify-between overflow-hidden hover:border-blue-500 transition-all border-2 border-slate-200 bg-white shadow-sm hover:shadow-lg rounded-2xl"
              >
                {/* Visual Header Image Banner */}
                <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={bannerImg}
                    alt={assessment.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="font-black text-xs bg-slate-950/85 backdrop-blur text-white border border-white/20 px-3 py-1">
                      {assessment.domain}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="inline-flex items-center text-xs font-black text-white bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-md border border-white/20">
                      <Clock className="h-3.5 w-3.5 mr-1 text-blue-400" />
                      ~{assessment.estimatedHours}h
                    </span>
                  </div>
                </div>

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                      Standardized Evaluation
                    </span>
                    <Badge
                      className={`capitalize text-[11px] font-black px-2.5 py-0.5 ${
                        assessment.difficulty === "beginner"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : assessment.difficulty === "intermediate"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {assessment.difficulty}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl font-black text-slate-950 hover:text-blue-600 transition-colors">
                    <Link href={`/assessments/${assessment.slug}`}>{assessment.title}</Link>
                  </CardTitle>

                  <CardDescription className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-2 mt-2 leading-relaxed">
                    {assessment.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 pb-4 space-y-3">
                  <div className="rounded-xl bg-slate-50 p-3.5 text-xs space-y-1.5 border border-slate-200">
                    <div className="flex items-center justify-between font-black text-slate-950">
                      <span>Evaluation Rubric:</span>
                      <span className="text-blue-600">{assessment.rubric.length} weighted criteria</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileCode className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">
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

                <CardFooter className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <Link
                    href={`/assessments/${assessment.slug}`}
                    className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    View Details & Rubric <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href={`/dashboard/submit/${assessment.slug}`}>
                    <Button size="sm" className="font-black bg-blue-600 text-white hover:bg-blue-700 shadow-xs">
                      Submit Evidence
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
