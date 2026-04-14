"use client";

import { useState, useRef } from "react";
import { LessonForm } from "@/components/LessonForm";
import { LessonOutput } from "@/components/LessonOutput";
import { GenerationProgress } from "@/components/GenerationProgress";
import { RefineChips } from "@/components/RefineChips";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import Image from "next/image";
import { LessonFormData, LessonPlan, RefinementType, AppState } from "@/lib/types";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { DraggableCharacter } from "@/components/DraggableCharacter";
import { generateLessonPdf } from "@/lib/generatePdf";

function planToMarkdown(plan: LessonPlan): string {
  const lines: string[] = [];
  lines.push(`# Lesson Plan: ${plan.snapshot.topic}`);
  lines.push(`**Grade:** ${plan.snapshot.grade} | **Duration:** ${plan.snapshot.duration} min`);
  if (plan.snapshot.mode) lines.push(`**Mode:** ${plan.snapshot.mode}`);
  lines.push("");

  if (plan.overview) {
    lines.push("## Overview");
    lines.push(plan.overview);
    lines.push("");
  }

  lines.push("## Learning Objectives");
  plan.objectives.forEach((obj, i) => lines.push(`${i + 1}. ${obj}`));
  lines.push("");

  lines.push("## Key Concepts & Vocabulary");
  lines.push(plan.keyConcepts.join(", "));
  lines.push("");

  if (plan.misconceptions && plan.misconceptions.length > 0) {
    lines.push("## Common Misconceptions");
    plan.misconceptions.forEach((m) => lines.push(`- ${m}`));
    lines.push("");
  }

  lines.push("## Lesson Flow");
  const flow = plan.lessonFlow;
  const sections = [flow.warmUp, flow.teach, flow.guidedPractice, flow.independentPractice, flow.closure];
  sections.forEach((s) => {
    lines.push(`### ${s.title} (${s.duration})`);
    lines.push(`- **Teacher:** ${s.teacherActions}`);
    lines.push(`- **Students:** ${s.studentActions}`);
    if (s.sampleQuestions && s.sampleQuestions.length > 0) {
      lines.push(`- **Sample Questions:**`);
      s.sampleQuestions.forEach((q) => lines.push(`  - ${q}`));
    }
    if (s.transitionNote) {
      lines.push(`- **Transition:** ${s.transitionNote}`);
    }
    lines.push("");
  });

  lines.push("## Quick Assessment");
  plan.assessment.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push("");

  lines.push("## 5-Slide Presentation Outline");
  plan.slides.forEach((s) => {
    lines.push(`### Slide ${s.slideNumber}: ${s.title}`);
    s.bullets.forEach((b) => lines.push(`- ${b}`));
    lines.push(`*Visual: ${s.visualSuggestion}*`);
    if (s.speakerNotes) {
      lines.push(`*Speaker Notes: ${s.speakerNotes}*`);
    }
    lines.push("");
  });

  lines.push("## Discussion Questions");
  plan.discussionQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push("");

  if (plan.materials.length > 0) {
    lines.push("## Materials Needed");
    plan.materials.forEach((m) => lines.push(`- ${m}`));
    lines.push("");
  }

  if (plan.teachingStrategies && plan.teachingStrategies.length > 0) {
    lines.push("## Teaching Strategies");
    plan.teachingStrategies.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (plan.supportNotes && plan.supportNotes.length > 0) {
    lines.push("## Learner Support Notes");
    plan.supportNotes.forEach((n) => lines.push(`- ${n}`));
    lines.push("");
  }

  if (plan.teacherNotes && plan.teacherNotes.length > 0) {
    lines.push("## Teacher Notes");
    plan.teacherNotes.forEach((n) => lines.push(`- ${n}`));
  }

  return lines.join("\n");
}

export default function Home() {
  const { language, t } = useLanguage();
  const [appState, setAppState] = useState<AppState>("idle");
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activeRefinement, setActiveRefinement] = useState<RefinementType | undefined>();
  const outputRef = useRef<HTMLDivElement>(null);

  async function handleGenerate(data: LessonFormData) {
    setAppState("generating");
    setError("");
    setLessonPlan(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to generate lesson plan.");
      }

      setLessonPlan(result);
      setAppState("done");
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setAppState("error");
    }
  }

  async function handleRefine(type: RefinementType) {
    if (!lessonPlan) return;
    setIsRefining(true);
    setActiveRefinement(type);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonPlan, refinementType: type, language }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to refine lesson plan.");
      }

      setLessonPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refinement failed.");
    } finally {
      setIsRefining(false);
      setActiveRefinement(undefined);
    }
  }

  async function handleCopy() {
    if (!lessonPlan) return;
    const markdown = planToMarkdown(lessonPlan);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadPdf() {
    if (!lessonPlan) return;
    await generateLessonPdf(lessonPlan, language);
  }

  function handleStartOver() {
    setAppState("idle");
    setLessonPlan(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, rgba(255,184,89,0.10) 0%, rgba(255,184,89,0.04) 12%, #fffeab 28%)" }}>
      <BackgroundDecor />
      {/* Header */}
      <header className="border-b border-[#e5a24e] sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#ffb859" }}>
        <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icons/app-logo.png" alt="" width={44} height={44} className="rounded-xl shadow-sm object-contain" />
            <div>
              <h1 className="font-bold text-2xl leading-tight tracking-tight text-[#3a2200]">
                {t.appTitle}
              </h1>
              <p className="text-xs text-[#5c3a0a]/80 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        {/* Form Section — 2-column desktop */}
        {(appState === "idle" || appState === "error") && (
          <div className="grid grid-cols-1 lg:grid-cols-[760px_1fr] gap-6 items-start">
            <div className="space-y-4 min-w-0">
              <LessonForm onSubmit={handleGenerate} isGenerating={false} />
            </div>

            {/* Preview Sidebar */}
            <Card className="hidden lg:block border-dashed border-[#8ecbf5]/50 overflow-visible sticky top-20">
              <CardContent className="pt-6 space-y-4 overflow-visible">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">{t.previewTitle}</p>
                </div>
                <ul className="space-y-2.5">
                  {t.previewItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary/60 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Assistant Character */}
                <DraggableCharacter />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && error && (
          <Card className="mt-4 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {t.somethingWentWrong}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generating State */}
        {appState === "generating" && (
          <GenerationProgress />
        )}

        {/* Output Section — full width */}
        {appState === "done" && lessonPlan && (
          <div ref={outputRef} className="space-y-4 w-full lg:w-[760px]">
            <LessonOutput plan={lessonPlan} />

            {/* Refine & Actions */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <RefineChips
                  onRefine={handleRefine}
                  isRefining={isRefining}
                  activeRefinement={activeRefinement}
                />

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t.copyAll}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadPdf}
                    className="flex-1"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    {t.downloadPdf}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartOver}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.startOver}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer glow — soft upward radiance */}
      <div aria-hidden="true" className="pointer-events-none relative z-0 h-24 -mb-24" style={{ background: "linear-gradient(to top, rgba(255,247,220,0.55) 0%, rgba(255,247,220,0.25) 40%, transparent 100%)" }} />

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#f0e4c0] mt-auto py-3.5" style={{ backgroundColor: "#fff7dc" }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center text-xs text-muted-foreground">
          {t.footer}
        </div>
      </footer>
    </main>
  );
}