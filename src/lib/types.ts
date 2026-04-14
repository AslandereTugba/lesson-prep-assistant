export interface LessonFormData {
  topic: string;
  grade: string;
  duration: string;
  learningGoal?: string;
  backgroundKnowledge?: "new" | "some" | "strong";
  lessonMode?: "quick" | "interactive" | "practice" | "inclusive";
  learnerSupports?: string[];
}

export interface SlideOutline {
  slideNumber: number;
  title: string;
  bullets: string[];
  visualSuggestion: string;
  speakerNotes?: string;
}

export interface LessonFlowSection {
  title: string;
  duration: string;
  teacherActions: string;
  studentActions: string;
  sampleQuestions?: string[];
  transitionNote?: string;
}

export interface LessonPlan {
  snapshot: {
    topic: string;
    grade: string;
    duration: string;
    mode: string;
    backgroundLevel: string;
  };
  objectives: string[];
  keyConcepts: string[];
  lessonFlow: {
    warmUp: LessonFlowSection;
    teach: LessonFlowSection;
    guidedPractice: LessonFlowSection;
    independentPractice: LessonFlowSection;
    closure: LessonFlowSection;
  };
  assessment: string[];
  materials: string[];
  slides: SlideOutline[];
  discussionQuestions: string[];
  supportNotes?: string[];
  overview?: string;
  misconceptions?: string[];
  teacherNotes?: string[];
  teachingStrategies?: string[];
}

export type RefinementType =
  | "simplify"
  | "interactive"
  | "visual"
  | "shorten"
  | "lengthen"
  | "extension";

export type AppState = "idle" | "generating" | "done" | "error";
