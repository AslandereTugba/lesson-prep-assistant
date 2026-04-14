import { LessonFormData, RefinementType } from "./types";
import { Language } from "./i18n";

const BACKGROUND_KNOWLEDGE_RULES: Record<string, string> = {
  new: "Students have no prior exposure to this topic. Include a warm-up that introduces foundational vocabulary. Use simpler language. Provide more teacher scaffolding. Break concepts into smaller steps.",
  some: "Students have basic awareness of this topic. Include a brief recap before new content. Balance explanation with hands-on practice.",
  strong:
    "Students have solid background knowledge. Keep introduction brief. Focus on application, analysis, and transfer. Include discussion and challenging tasks.",
};

const LESSON_MODE_RULES: Record<string, string> = {
  quick:
    "Teacher-led instruction with efficient pacing, clear explanations, and minimal group work. Prioritize direct instruction and clarity.",
  interactive:
    "Discussion-heavy lesson with questioning strategies, think-pair-share activities, and significant student voice. Include collaborative learning moments.",
  practice:
    "Emphasis on guided and independent practice, worked examples, and formative checks for understanding. Focus on skill building.",
  inclusive:
    "Built-in differentiation with multiple representations, flexible grouping, and visual supports. Address diverse learner needs throughout.",
};

export function buildSystemPrompt(language: Language = "en"): string {
  const langInstruction = language === "tr"
    ? "\n9. ALL content in the JSON (titles, descriptions, objectives, questions, actions, vocabulary, slide content, visual suggestions, materials, support notes) MUST be written in Turkish (Türkçe). Do NOT use English for any content field."
    : "\n9. ALL content must be written in English.";

  return `You are an experienced instructional designer and teacher assistant. Your job is to generate structured, classroom-ready lesson plans with rich, actionable detail.

CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON matching the exact schema below. No markdown, no explanation, no wrapping.
2. Learning objectives MUST use measurable Bloom's taxonomy verbs (analyze, compare, explain, create, evaluate, identify, describe, demonstrate). NEVER use vague verbs like "understand", "learn about", or "know".
3. Language complexity MUST match the specified grade level.
4. All content must be directly usable in a classroom without further editing.
5. Visual suggestions for slides must be instructional (diagrams, charts, labeled illustrations, concept maps) NOT decorative.
6. Each slide must have a clear pedagogical purpose. Include speakerNotes for each slide with what the teacher should say or emphasize while presenting.
7. Lesson flow sections should include specific teacher actions (with sample teacher language in quotes) and concrete student actions (what students physically do). Include 2-3 sampleQuestions the teacher can ask during each section, and a transitionNote explaining how to bridge to the next section.
8. Assessment should include varied formats: quick checks, exit tickets, observation prompts — not just questions.
9. The "overview" field should be a concise 2-3 sentence summary of the lesson's purpose and approach.
10. Include common student misconceptions about the topic in "misconceptions".
11. Provide practical "teacherNotes" — timing tips, common pitfalls, preparation reminders, classroom management suggestions.
12. Include recommended "teachingStrategies" — specific pedagogical approaches suited to this lesson (e.g., scaffolding, modeling, think-aloud, jigsaw, Socratic questioning).${langInstruction}

JSON SCHEMA:
{
  "snapshot": { "topic": string, "grade": string, "duration": string, "mode": string, "backgroundLevel": string },
  "overview": string,              // 2-3 sentence lesson summary
  "objectives": [string, string],  // 2-3 measurable objectives
  "keyConcepts": [string, ...],    // 3-6 key concepts or vocabulary terms
  "misconceptions": [string, ...], // 2-4 common student misconceptions
  "lessonFlow": {
    "warmUp": { "title": string, "duration": string, "teacherActions": string, "studentActions": string, "sampleQuestions": [string, ...], "transitionNote": string },
    "teach": { "title": string, "duration": string, "teacherActions": string, "studentActions": string, "sampleQuestions": [string, ...], "transitionNote": string },
    "guidedPractice": { "title": string, "duration": string, "teacherActions": string, "studentActions": string, "sampleQuestions": [string, ...], "transitionNote": string },
    "independentPractice": { "title": string, "duration": string, "teacherActions": string, "studentActions": string, "sampleQuestions": [string, ...], "transitionNote": string },
    "closure": { "title": string, "duration": string, "teacherActions": string, "studentActions": string, "sampleQuestions": [string, ...], "transitionNote": string }
  },
  "assessment": [string, string],   // 2-3 varied assessment items (exit tickets, quick checks, observation prompts)
  "materials": [string, ...],       // list of needed materials
  "slides": [
    { "slideNumber": 1, "title": string, "bullets": [string, string, string], "visualSuggestion": string, "speakerNotes": string },
    // ... 5 slides total
  ],
  "discussionQuestions": [string, string, string],  // 2-3 discussion questions
  "supportNotes": [string, ...],    // only if learner supports were specified, otherwise empty array
  "teachingStrategies": [string, ...], // 2-4 recommended pedagogical strategies
  "teacherNotes": [string, ...]     // 2-4 practical tips for the teacher
}`;
}

export function buildUserPrompt(data: LessonFormData): string {
  const lines: string[] = [
    `Create a lesson plan with these parameters:`,
    `- Topic: ${data.topic}`,
    `- Grade/Level: ${data.grade}`,
    `- Duration: ${data.duration} minutes`,
  ];

  if (data.learningGoal) {
    lines.push(`- Learning Goal: ${data.learningGoal}`);
  }

  if (data.backgroundKnowledge) {
    lines.push(
      `- Student Background Knowledge: ${data.backgroundKnowledge} (${BACKGROUND_KNOWLEDGE_RULES[data.backgroundKnowledge]})`
    );
  } else {
    lines.push(
      `- Student Background Knowledge: some (${BACKGROUND_KNOWLEDGE_RULES.some})`
    );
  }

  if (data.lessonMode) {
    lines.push(
      `- Lesson Mode: ${data.lessonMode} (${LESSON_MODE_RULES[data.lessonMode]})`
    );
  } else {
    lines.push(
      `- Lesson Mode: quick (${LESSON_MODE_RULES.quick})`
    );
  }

  if (data.learnerSupports && data.learnerSupports.length > 0) {
    lines.push(
      `- Learner Support Needs: ${data.learnerSupports.join(", ")}. Include relevant support notes in the supportNotes array addressing each of these needs.`
    );
  } else {
    lines.push(`- No specific learner support needs. Set supportNotes to an empty array.`);
  }

  return lines.join("\n");
}

export function buildRefinementPrompt(
  refinementType: RefinementType,
  language: Language = "en"
): string {
  const instructions: Record<RefinementType, string> = {
    simplify:
      "Simplify the language throughout the lesson plan. Use shorter sentences, simpler vocabulary, and more scaffolding. Reduce complexity while keeping the core learning objectives intact.",
    interactive:
      "Make the lesson more interactive. Add more student discussion opportunities, pair/group work, questioning strategies, and think-pair-share activities. Reduce teacher-led time.",
    visual:
      "Add more visual support throughout. Include additional visual suggestions, graphic organizers, diagrams, and visual cues in the lesson flow. Update slide visual suggestions to be more detailed.",
    shorten:
      "Shorten the lesson to fit a tighter timeframe. Remove non-essential activities, streamline transitions, and focus on the most critical learning moments. Reduce the duration of each section proportionally.",
    lengthen:
      "Lengthen and expand the lesson to fill more time. Add deeper explanations, additional practice activities, richer discussion moments, and more detailed guided practice. Increase the duration of each section proportionally and add supplementary content where appropriate.",
    extension:
      "Add extension and challenge tasks throughout the lesson. Include deeper thinking questions, enrichment activities, and challenge problems for advanced learners. Add complexity to assessment questions.",
  };

  const langNote = language === "tr"
    ? " All content must remain in Turkish (Türkçe)."
    : " All content must remain in English.";

  return `Apply this refinement to the lesson plan: ${instructions[refinementType]}${langNote}

Return the COMPLETE updated lesson plan in the exact same JSON format. Keep the overall structure intact — including overview, misconceptions, teachingStrategies, teacherNotes, speakerNotes on slides, sampleQuestions and transitionNote on flow sections — but apply the requested changes throughout.`;
}
