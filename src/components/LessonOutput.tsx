"use client";

import { LessonPlan } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Lightbulb,
  Clock,
  ClipboardList,
  Presentation,
  MessageSquare,
  Package,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  StickyNote,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface LessonOutputProps {
  plan: LessonPlan;
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function FlowCard({
  section,
  index,
  teacherLabel,
  studentLabel,
  sampleQuestionsLabel,
  transitionLabel,
}: {
  section: { title: string; duration: string; teacherActions: string; studentActions: string; sampleQuestions?: string[]; transitionNote?: string };
  index: number;
  teacherLabel: string;
  studentLabel: string;
  sampleQuestionsLabel: string;
  transitionLabel: string;
}) {
  const colors = [
    "border-l-blue-400",
    "border-l-emerald-400",
    "border-l-amber-400",
    "border-l-purple-400",
    "border-l-rose-400",
  ];
  return (
    <Card className={`border-l-4 ${colors[index]} shadow-none bg-white/50`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{section.title}</h4>
          <Badge variant="secondary" className="text-xs">
            {section.duration}
          </Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">{teacherLabel}</span>{" "}
            {section.teacherActions}
          </p>
          <p>
            <span className="font-medium text-foreground">{studentLabel}</span>{" "}
            {section.studentActions}
          </p>
        </div>
        {section.sampleQuestions && section.sampleQuestions.length > 0 && (
          <div className="mt-3 pt-2 border-t">
            <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-1">
              <HelpCircle className="h-3 w-3" />
              {sampleQuestionsLabel}
            </p>
            <ul className="space-y-1">
              {section.sampleQuestions.map((q, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="shrink-0 mt-1 h-1 w-1 rounded-full bg-primary/60" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
        {section.transitionNote && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <ArrowRight className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
              <span><span className="font-medium text-foreground">{transitionLabel}</span> {section.transitionNote}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LessonOutput({ plan }: LessonOutputProps) {
  const { t } = useLanguage();
  const flowSections = [
    plan.lessonFlow.warmUp,
    plan.lessonFlow.teach,
    plan.lessonFlow.guidedPractice,
    plan.lessonFlow.independentPractice,
    plan.lessonFlow.closure,
  ];

  return (
    <div className="space-y-4">
      {/* Snapshot Banner */}
      <Card className="bg-gradient-to-r from-[#90cdf4]/40 via-[#b1ddff] to-[#d0ecff] border-[#8ecbf5]/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2.5">
            <Badge variant="outline" className="bg-white/80">{plan.snapshot.topic}</Badge>
            <Badge variant="outline" className="bg-white/80">{plan.snapshot.grade}</Badge>
            <Badge variant="outline" className="bg-white/80">
              <Clock className="h-3 w-3 mr-1" />
              {plan.snapshot.duration} min
            </Badge>
            {plan.snapshot.mode && plan.snapshot.mode !== "quick" && (
              <Badge variant="outline" className="bg-white/80">{plan.snapshot.mode}</Badge>
            )}
            {plan.snapshot.backgroundLevel &&
              plan.snapshot.backgroundLevel !== "some" && (
                <Badge variant="outline" className="bg-white/80">
                  {t.outputPriorKnowledge} {plan.snapshot.backgroundLevel}
                </Badge>
              )}
          </div>
          {plan.overview && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {plan.overview}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Objectives */}
      <SectionCard icon={Target} title={t.outputObjectives}>
        <ul className="space-y-2">
          {plan.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="font-semibold text-primary mt-0.5">
                {i + 1}.
              </span>
              {obj}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Key Concepts */}
      <SectionCard icon={Lightbulb} title={t.outputKeyConcepts}>
        <div className="flex flex-wrap gap-2">
          {plan.keyConcepts.map((concept, i) => (
            <Badge key={i} variant="secondary">
              {concept}
            </Badge>
          ))}
        </div>
      </SectionCard>

      {/* Misconceptions */}
      {plan.misconceptions && plan.misconceptions.length > 0 && (
        <SectionCard icon={AlertTriangle} title={t.outputMisconceptions}>
          <ul className="space-y-2">
            {plan.misconceptions.map((m, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                {m}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Lesson Flow */}
      <SectionCard icon={BookOpen} title={t.outputLessonFlow}>
        <div className="space-y-3">
          {flowSections.map((section, i) => (
            <FlowCard key={i} section={section} index={i} teacherLabel={t.outputTeacher} studentLabel={t.outputStudents} sampleQuestionsLabel={t.outputSampleQuestions} transitionLabel={t.outputTransition} />
          ))}
        </div>
      </SectionCard>

      {/* Assessment */}
      <SectionCard icon={ClipboardList} title={t.outputAssessment}>
        <ul className="space-y-2">
          {plan.assessment.map((q, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">Q{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 5-Slide Outline */}
      <SectionCard icon={Presentation} title={t.outputSlides}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plan.slides.map((slide) => (
            <Card key={slide.slideNumber} className="shadow-none bg-white/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                    {slide.slideNumber}
                  </span>
                  {slide.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ul className="space-y-1 mb-2">
                  {slide.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="text-xs italic text-muted-foreground border-t pt-2">
                  🎨 {t.outputVisual} {slide.visualSuggestion}
                </p>
                {slide.speakerNotes && (
                  <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
                    🎤 <span className="font-medium">{t.outputSpeakerNotes}</span> {slide.speakerNotes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      {/* Discussion Questions */}
      <SectionCard icon={MessageSquare} title={t.outputDiscussion}>
        <ul className="space-y-2">
          {plan.discussionQuestions.map((q, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="font-semibold text-primary shrink-0">
                {i + 1}.
              </span>
              {q}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Materials */}
      {plan.materials && plan.materials.length > 0 && (
        <SectionCard icon={Package} title={t.outputMaterials}>
          <ul className="grid grid-cols-2 gap-1">
            {plan.materials.map((m, i) => (
              <li key={i} className="text-sm flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Teaching Strategies */}
      {plan.teachingStrategies && plan.teachingStrategies.length > 0 && (
        <SectionCard icon={GraduationCap} title={t.outputTeachingStrategies}>
          <ul className="space-y-2">
            {plan.teachingStrategies.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                {s}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Support Notes */}
      {plan.supportNotes && plan.supportNotes.length > 0 && (
        <SectionCard icon={ShieldCheck} title={t.outputSupportNotes}>
          <ul className="space-y-2">
            {plan.supportNotes.map((note, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                {note}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Teacher Notes */}
      {plan.teacherNotes && plan.teacherNotes.length > 0 && (
        <SectionCard icon={StickyNote} title={t.outputTeacherNotes}>
          <ul className="space-y-2">
            {plan.teacherNotes.map((note, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                {note}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
