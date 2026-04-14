"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { LessonFormData } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

const GRADES = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "University",
];

const DURATIONS = ["15", "30", "45", "60", "90"];

interface LessonFormProps {
  onSubmit: (data: LessonFormData) => void;
  isGenerating: boolean;
}

export function LessonForm({ onSubmit, isGenerating }: LessonFormProps) {
  const { t } = useLanguage();
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [backgroundKnowledge, setBackgroundKnowledge] = useState<
    "new" | "some" | "strong" | undefined
  >(undefined);
  const [lessonMode, setLessonMode] = useState<
    "quick" | "interactive" | "practice" | "inclusive" | undefined
  >(undefined);
  const [learnerSupports, setLearnerSupports] = useState<string[]>([]);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showSupports, setShowSupports] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!topic.trim()) newErrors.topic = t.errorTopic;
    if (!grade) newErrors.grade = t.errorGrade;
    if (!duration) newErrors.duration = t.errorDuration;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      topic: topic.trim(),
      grade,
      duration,
      learningGoal: learningGoal.trim() || undefined,
      backgroundKnowledge,
      lessonMode,
      learnerSupports: learnerSupports.length > 0 ? learnerSupports : undefined,
    });
  }

  function toggleSupport(id: string) {
    setLearnerSupports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const LESSON_MODES = [
    { value: "quick" as const, label: t.modeQuickLabel, description: t.modeQuickDesc, iconSrc: "/icons/quick-clear.png" },
    { value: "interactive" as const, label: t.modeInteractiveLabel, description: t.modeInteractiveDesc, iconSrc: "/icons/interactive-icon.png" },
    { value: "practice" as const, label: t.modePracticeLabel, description: t.modePracticeDesc, iconSrc: "/icons/practice focused.png" },
    { value: "inclusive" as const, label: t.modeInclusiveLabel, description: t.modeInclusiveDesc, iconSrc: "/icons/inclusive.png" },
  ];

  const LEARNER_SUPPORTS = [
    { id: "simplified-language", label: t.supportSimplifiedLanguage },
    { id: "visual-support", label: t.supportVisualSupport },
    { id: "step-by-step", label: t.supportStepByStep },
    { id: "hands-on", label: t.supportHandsOn },
    { id: "extension-challenge", label: t.supportExtensionChallenge },
    { id: "ell-support", label: t.supportEllSupport },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card 1: Core Details */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-1.5">
              <Image src="/icons/core-details.png" alt="" width={24} height={24} className="object-contain" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">{t.sectionCoreTitle}</CardTitle>
              <p className="text-xs text-muted-foreground">{t.sectionCoreHelper}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div>
            <Label htmlFor="topic" className="text-[0.9rem] font-semibold text-foreground">
              {t.topicLabel}
            </Label>
            <Input
              id="topic"
              placeholder={t.topicPlaceholder}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (errors.topic) setErrors((p) => ({ ...p, topic: "" }));
              }}
              className="mt-1.5"
            />
            {errors.topic && (
              <p className="text-sm text-destructive mt-1">{errors.topic}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade" className="text-[0.9rem] font-semibold text-foreground">
                {t.gradeLabel}
              </Label>
              <Select
                value={grade}
                onValueChange={(v) => {
                  if (v) setGrade(v);
                  if (errors.grade) setErrors((p) => ({ ...p, grade: "" }));
                }}
              >
                <SelectTrigger id="grade" className="mt-1.5">
                  {grade ? (
                    <span data-slot="select-value" className="flex flex-1 text-left">
                      {t.grades[GRADES.indexOf(grade)]}
                    </span>
                  ) : (
                    <SelectValue placeholder={t.gradePlaceholder} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g, i) => (
                    <SelectItem key={g} value={g}>
                      {t.grades[i]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.grade && (
                <p className="text-sm text-destructive mt-1">{errors.grade}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration" className="text-[0.9rem] font-semibold text-foreground">
                {t.durationLabel}
              </Label>
              <Select
                value={duration}
                onValueChange={(v) => {
                  if (v) setDuration(v);
                  if (errors.duration) setErrors((p) => ({ ...p, duration: "" }));
                }}
              >
                <SelectTrigger id="duration" className="mt-1.5">
                  {duration ? (
                    <span data-slot="select-value" className="flex flex-1 text-left">
                      {duration} {t.minutes}
                    </span>
                  ) : (
                    <SelectValue placeholder={t.durationPlaceholder} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d} {t.minutes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-destructive mt-1">{errors.duration}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Customize */}
      <Card>
        <button
          type="button"
          onClick={() => setShowCustomize(!showCustomize)}
          className="w-full"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <Image src="/icons/customize.png" alt="" width={24} height={24} className="object-contain" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-xl font-semibold">{t.sectionCustomizeTitle}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {showCustomize
                      ? t.sectionCustomizeHelper
                      : (learningGoal || backgroundKnowledge || lessonMode)
                        ? `${[learningGoal ? t.learningGoalLabel : null, backgroundKnowledge ? t.backgroundKnowledgeLabel : null, lessonMode ? t.lessonModeLabel : null].filter(Boolean).join(" · ")}`
                        : t.noCustomizations}
                  </p>
                </div>
              </div>
              {showCustomize ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </button>

        {showCustomize && (
          <CardContent className="space-y-5 pt-0">
            {/* Learning Goal */}
            <div>
              <Label htmlFor="learningGoal" className="text-[0.9rem] font-semibold text-foreground">
                {t.learningGoalLabel}
              </Label>
              <Textarea
                id="learningGoal"
                placeholder={t.learningGoalPlaceholder}
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            {/* Background Knowledge */}
            <div>
              <Label className="text-[0.9rem] font-semibold text-foreground">
                {t.backgroundKnowledgeLabel}
              </Label>
              <div className="flex gap-2 mt-1.5">
                {(
                  [
                    { value: "new", label: t.bgNew },
                    { value: "some", label: t.bgSome },
                    { value: "strong", label: t.bgStrong },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setBackgroundKnowledge(
                        backgroundKnowledge === option.value
                          ? undefined
                          : option.value
                      )
                    }
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      backgroundKnowledge === option.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-input bg-background hover:bg-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Mode */}
            <div>
              <Label className="text-[0.9rem] font-semibold text-foreground">{t.lessonModeLabel}</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {LESSON_MODES.map((mode) => {
                  return (
                    <Card
                      key={mode.value}
                      className={`cursor-pointer transition-all ${
                        lessonMode === mode.value
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "bg-white/50 hover:border-muted-foreground/30 hover:bg-white/70"
                      }`}
                      onClick={() =>
                        setLessonMode(
                          lessonMode === mode.value ? undefined : mode.value
                        )
                      }
                    >
                      <CardContent className="p-3 flex items-start gap-2.5">
                        <Image src={mode.iconSrc} alt="" width={22} height={22} className="mt-0.5 shrink-0 object-contain" />
                        <div>
                          <p className="text-base font-medium">{mode.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {mode.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Card 3: Learner Supports */}
      <Card>
        <button
          type="button"
          onClick={() => setShowSupports(!showSupports)}
          className="w-full"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-lg p-1.5">
                  <Image src="/icons/learner-supports.png" alt="" width={24} height={24} className="object-contain" />
                </div>
                <div className="text-left">
                  <CardTitle className="text-xl font-semibold">{t.sectionSupportsTitle}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {showSupports
                      ? t.sectionSupportsHelper
                      : learnerSupports.length > 0
                        ? `${learnerSupports.length} ${t.supportsSelected}`
                        : t.noneSelected}
                  </p>
                </div>
              </div>
              {showSupports ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </button>

        {showSupports && (
          <CardContent className="space-y-3 pt-0">
            {LEARNER_SUPPORTS.map((support) => (
              <div key={support.id} className="flex items-center gap-2">
                <Checkbox
                  id={support.id}
                  checked={learnerSupports.includes(support.id)}
                  onCheckedChange={() => toggleSupport(support.id)}
                />
                <Label
                  htmlFor={support.id}
                  className="text-sm cursor-pointer font-medium text-foreground"
                >
                  {support.label}
                </Label>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
      <Button
        type="submit"
        size="lg"
        className="text-base px-8 font-semibold shadow-md hover:brightness-105"
        style={{ backgroundColor: "#ffb859", color: "#3a2200" }}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
            {t.generating}
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            {t.generateLessonPlan}
          </>
        )}
      </Button>
      </div>
    </form>
  );
}