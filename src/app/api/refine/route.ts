import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildRefinementPrompt } from "@/lib/prompts";
import { LessonPlan, RefinementType } from "@/lib/types";
import { Language } from "@/lib/i18n";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      lessonPlan: LessonPlan;
      refinementType: RefinementType;
      language?: Language;
    };
    const language: Language = body.language === "tr" ? "tr" : "en";

    if (!body.lessonPlan || !body.refinementType) {
      return NextResponse.json(
        { error: "Lesson plan and refinement type are required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "API key is not configured." },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(language);
    const refinementPrompt = buildRefinementPrompt(body.refinementType, language);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the current lesson plan:\n${JSON.stringify(body.lessonPlan, null, 2)}\n\n${refinementPrompt}`,
        },
      ],
      temperature: 0.6,
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
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Refinement error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
