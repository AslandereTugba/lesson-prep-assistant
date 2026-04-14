import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { LessonFormData, LessonPlan } from "@/lib/types";
import { Language } from "@/lib/i18n";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function validateLessonPlan(data: unknown): data is LessonPlan {
  if (!data || typeof data !== "object") return false;
  const plan = data as Record<string, unknown>;
  return (
    !!plan.snapshot &&
    Array.isArray(plan.objectives) &&
    Array.isArray(plan.keyConcepts) &&
    !!plan.lessonFlow &&
    Array.isArray(plan.assessment) &&
    Array.isArray(plan.materials) &&
    Array.isArray(plan.slides) &&
    plan.slides.length === 5 &&
    Array.isArray(plan.discussionQuestions)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LessonFormData & { language?: Language };
    const language: Language = body.language === "tr" ? "tr" : "en";

    if (!body.topic || !body.grade || !body.duration) {
      return NextResponse.json(
        { error: "Topic, grade, and duration are required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "API key is not configured. Please set GROQ_API_KEY in your .env.local file." },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt(body);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response received from AI model." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    if (!validateLessonPlan(parsed)) {
      // Retry once with stricter instruction
      const retryCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt + "\n\nIMPORTANT: You MUST return exactly 5 slides in the slides array. Follow the JSON schema EXACTLY." },
        ],
        temperature: 0.5,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });

      const retryContent = retryCompletion.choices[0]?.message?.content;
      if (!retryContent) {
        return NextResponse.json(
          { error: "Failed to generate lesson plan. Please try again." },
          { status: 500 }
        );
      }

      const retryParsed = JSON.parse(retryContent);
      if (!validateLessonPlan(retryParsed)) {
        return NextResponse.json(
          { error: "Generated lesson plan has an unexpected format. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(retryParsed);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
