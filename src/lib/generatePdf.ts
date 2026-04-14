import jsPDF from "jspdf";
import { LessonPlan } from "./types";

// ── Font loading ──
let fontName = "helvetica";
let cachedFonts: { regular: string; bold: string } | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function loadFonts(doc: jsPDF): Promise<string> {
  try {
    if (!cachedFonts) {
      const [regBuf, boldBuf] = await Promise.all([
        fetch("/fonts/Roboto-Regular.ttf").then((r) => {
          if (!r.ok) throw new Error("Font fetch failed");
          return r.arrayBuffer();
        }),
        fetch("/fonts/Roboto-Bold.ttf").then((r) => {
          if (!r.ok) throw new Error("Font fetch failed");
          return r.arrayBuffer();
        }),
      ]);
      cachedFonts = {
        regular: arrayBufferToBase64(regBuf),
        bold: arrayBufferToBase64(boldBuf),
      };
    }
    doc.addFileToVFS("Roboto-Regular.ttf", cachedFonts.regular);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", cachedFonts.bold);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
    return "Roboto";
  } catch {
    return "helvetica";
  }
}

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const PAGE_WIDTH = 210; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const LINE_HEIGHT = 6;
const SECTION_GAP = 10;

interface PdfContext {
  doc: jsPDF;
  y: number;
}

function checkPageBreak(ctx: PdfContext, needed: number = 20) {
  if (ctx.y + needed > 280) {
    ctx.doc.addPage();
    ctx.y = 20;
  }
}

function addTitle(ctx: PdfContext, text: string) {
  checkPageBreak(ctx, 20);
  ctx.doc.setFontSize(20);
  ctx.doc.setFont(fontName, "bold");
  ctx.doc.setTextColor(75, 55, 160);
  ctx.doc.text(text, MARGIN_LEFT, ctx.y);
  ctx.y += 10;
}

function addSectionHeading(ctx: PdfContext, text: string) {
  checkPageBreak(ctx, 16);
  ctx.y += SECTION_GAP;
  ctx.doc.setFontSize(13);
  ctx.doc.setFont(fontName, "bold");
  ctx.doc.setTextColor(75, 55, 160);
  ctx.doc.text(text, MARGIN_LEFT, ctx.y);
  ctx.y += 2;
  ctx.doc.setDrawColor(75, 55, 160);
  ctx.doc.setLineWidth(0.4);
  ctx.doc.line(MARGIN_LEFT, ctx.y, MARGIN_LEFT + CONTENT_WIDTH, ctx.y);
  ctx.y += 6;
}

function addSubHeading(ctx: PdfContext, text: string) {
  checkPageBreak(ctx, 12);
  ctx.doc.setFontSize(11);
  ctx.doc.setFont(fontName, "bold");
  ctx.doc.setTextColor(40, 40, 40);
  ctx.doc.text(text, MARGIN_LEFT, ctx.y);
  ctx.y += LINE_HEIGHT;
}

function addBody(ctx: PdfContext, text: string, indent: number = 0) {
  ctx.doc.setFontSize(10);
  ctx.doc.setFont(fontName, "normal");
  ctx.doc.setTextColor(50, 50, 50);
  const lines = ctx.doc.splitTextToSize(text, CONTENT_WIDTH - indent);
  for (const line of lines) {
    checkPageBreak(ctx);
    ctx.doc.text(line, MARGIN_LEFT + indent, ctx.y);
    ctx.y += LINE_HEIGHT;
  }
}

function addBullet(ctx: PdfContext, text: string, indent: number = 4) {
  ctx.doc.setFontSize(10);
  ctx.doc.setFont(fontName, "normal");
  ctx.doc.setTextColor(50, 50, 50);
  const lines = ctx.doc.splitTextToSize(text, CONTENT_WIDTH - indent - 4);
  for (let i = 0; i < lines.length; i++) {
    checkPageBreak(ctx);
    if (i === 0) {
      ctx.doc.text("\u2022", MARGIN_LEFT + indent, ctx.y);
    }
    ctx.doc.text(lines[i], MARGIN_LEFT + indent + 4, ctx.y);
    ctx.y += LINE_HEIGHT;
  }
}

function addNumbered(ctx: PdfContext, num: number, text: string, indent: number = 4) {
  ctx.doc.setFontSize(10);
  ctx.doc.setFont(fontName, "normal");
  ctx.doc.setTextColor(50, 50, 50);
  const prefix = `${num}. `;
  const lines = ctx.doc.splitTextToSize(text, CONTENT_WIDTH - indent - 8);
  for (let i = 0; i < lines.length; i++) {
    checkPageBreak(ctx);
    if (i === 0) {
      ctx.doc.setFont(fontName, "bold");
      ctx.doc.text(prefix, MARGIN_LEFT + indent, ctx.y);
      ctx.doc.setFont(fontName, "normal");
    }
    ctx.doc.text(lines[i], MARGIN_LEFT + indent + 8, ctx.y);
    ctx.y += LINE_HEIGHT;
  }
}

function addLabeledLine(ctx: PdfContext, label: string, value: string, indent: number = 4) {
  ctx.doc.setFontSize(10);
  ctx.doc.setFont(fontName, "bold");
  ctx.doc.setTextColor(50, 50, 50);
  checkPageBreak(ctx);
  const labelWidth = ctx.doc.getTextWidth(label + " ");
  ctx.doc.text(label, MARGIN_LEFT + indent, ctx.y);
  ctx.doc.setFont(fontName, "normal");
  const valueLines = ctx.doc.splitTextToSize(value, CONTENT_WIDTH - indent - labelWidth);
  for (let i = 0; i < valueLines.length; i++) {
    if (i === 0) {
      ctx.doc.text(valueLines[i], MARGIN_LEFT + indent + labelWidth, ctx.y);
    } else {
      checkPageBreak(ctx);
      ctx.doc.text(valueLines[i], MARGIN_LEFT + indent, ctx.y);
    }
    ctx.y += LINE_HEIGHT;
  }
}

interface PdfLabels {
  lessonPlan: string;
  overview: string;
  objectives: string;
  keyConcepts: string;
  misconceptions: string;
  materials: string;
  lessonFlow: string;
  teacher: string;
  students: string;
  sampleQuestions: string;
  transition: string;
  teachingStrategies: string;
  assessment: string;
  slides: string;
  visual: string;
  speakerNotes: string;
  discussion: string;
  supportNotes: string;
  teacherNotes: string;
  grade: string;
  duration: string;
  mode: string;
  priorKnowledge: string;
}

const LABELS_EN: PdfLabels = {
  lessonPlan: "Lesson Plan",
  overview: "Lesson Overview",
  objectives: "Learning Objectives",
  keyConcepts: "Key Concepts & Vocabulary",
  misconceptions: "Common Misconceptions",
  materials: "Materials & Preparation",
  lessonFlow: "Detailed Lesson Flow",
  teacher: "Teacher:",
  students: "Students:",
  sampleQuestions: "Sample Questions:",
  transition: "Transition:",
  teachingStrategies: "Teaching Strategies",
  assessment: "Assessment & Evaluation",
  slides: "5-Slide Presentation Plan",
  visual: "Visual:",
  speakerNotes: "Speaker Notes:",
  discussion: "Discussion Questions",
  supportNotes: "Differentiation & Support",
  teacherNotes: "Teacher Notes",
  grade: "Grade:",
  duration: "Duration:",
  mode: "Mode:",
  priorKnowledge: "Prior Knowledge:",
};

const LABELS_TR: PdfLabels = {
  lessonPlan: "Ders Plan\u0131",
  overview: "Ders \u00d6zeti",
  objectives: "\u00d6\u011frenme Hedefleri",
  keyConcepts: "Temel Kavramlar ve Kelimeler",
  misconceptions: "Yayg\u0131n Yan\u0131lg\u0131lar",
  materials: "Materyaller ve Haz\u0131rl\u0131k",
  lessonFlow: "Detayl\u0131 Ders Ak\u0131\u015f\u0131",
  teacher: "\u00d6\u011fretmen:",
  students: "\u00d6\u011frenciler:",
  sampleQuestions: "\u00d6rnek Sorular:",
  transition: "Ge\u00e7i\u015f:",
  teachingStrategies: "\u00d6\u011fretim Stratejileri",
  assessment: "De\u011ferlendirme",
  slides: "5 Slaytl\u0131k Sunum Plan\u0131",
  visual: "G\u00f6rsel:",
  speakerNotes: "Konu\u015fmac\u0131 Notlar\u0131:",
  discussion: "Tart\u0131\u015fma Sorular\u0131",
  supportNotes: "Farkl\u0131la\u015ft\u0131rma ve Destek",
  teacherNotes: "\u00d6\u011fretmen Notlar\u0131",
  grade: "S\u0131n\u0131f:",
  duration: "S\u00fcre:",
  mode: "Mod:",
  priorKnowledge: "\u00d6n Bilgi:",
};

export async function generateLessonPdf(plan: LessonPlan, language: "en" | "tr" = "en") {
  const labels = language === "tr" ? LABELS_TR : LABELS_EN;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  fontName = await loadFonts(doc);
  const ctx: PdfContext = { doc, y: 25 };

  // ── Title ──
  addTitle(ctx, `${labels.lessonPlan}: ${plan.snapshot.topic}`);

  // ── Meta badges ──
  ctx.doc.setFontSize(10);
  ctx.doc.setFont(fontName, "normal");
  ctx.doc.setTextColor(100, 100, 100);
  const meta = [
    `${labels.grade} ${plan.snapshot.grade}`,
    `${labels.duration} ${plan.snapshot.duration} min`,
    plan.snapshot.mode && plan.snapshot.mode !== "quick"
      ? `${labels.mode} ${plan.snapshot.mode}`
      : "",
    plan.snapshot.backgroundLevel && plan.snapshot.backgroundLevel !== "some"
      ? `${labels.priorKnowledge} ${plan.snapshot.backgroundLevel}`
      : "",
  ]
    .filter(Boolean)
    .join("  |  ");
  ctx.doc.text(meta, MARGIN_LEFT, ctx.y);
  ctx.y += 8;

  // ── Overview ──
  if (plan.overview) {
    addSectionHeading(ctx, labels.overview);
    addBody(ctx, plan.overview);
  }

  // ── Objectives ──
  addSectionHeading(ctx, labels.objectives);
  plan.objectives.forEach((obj, i) => addNumbered(ctx, i + 1, obj));

  // ── Key Concepts ──
  addSectionHeading(ctx, labels.keyConcepts);
  plan.keyConcepts.forEach((c) => addBullet(ctx, c));

  // ── Misconceptions ──
  if (plan.misconceptions && plan.misconceptions.length > 0) {
    addSectionHeading(ctx, labels.misconceptions);
    plan.misconceptions.forEach((m) => addBullet(ctx, m));
  }

  // ── Materials ──
  if (plan.materials.length > 0) {
    addSectionHeading(ctx, labels.materials);
    plan.materials.forEach((m) => addBullet(ctx, m));
  }

  // ── Teaching Strategies ──
  if (plan.teachingStrategies && plan.teachingStrategies.length > 0) {
    addSectionHeading(ctx, labels.teachingStrategies);
    plan.teachingStrategies.forEach((s) => addBullet(ctx, s));
  }

  // ── Lesson Flow ──
  addSectionHeading(ctx, labels.lessonFlow);
  const flowSections = [
    plan.lessonFlow.warmUp,
    plan.lessonFlow.teach,
    plan.lessonFlow.guidedPractice,
    plan.lessonFlow.independentPractice,
    plan.lessonFlow.closure,
  ];
  flowSections.forEach((section) => {
    checkPageBreak(ctx, 30);
    addSubHeading(ctx, `${section.title} (${section.duration})`);
    addLabeledLine(ctx, labels.teacher, section.teacherActions, 6);
    addLabeledLine(ctx, labels.students, section.studentActions, 6);
    if (section.sampleQuestions && section.sampleQuestions.length > 0) {
      ctx.doc.setFontSize(10);
      ctx.doc.setFont(fontName, "bold");
      ctx.doc.setTextColor(50, 50, 50);
      checkPageBreak(ctx);
      ctx.doc.text(labels.sampleQuestions, MARGIN_LEFT + 6, ctx.y);
      ctx.y += LINE_HEIGHT;
      section.sampleQuestions.forEach((q) => addBullet(ctx, q, 10));
    }
    if (section.transitionNote) {
      addLabeledLine(ctx, labels.transition, section.transitionNote, 6);
    }
    ctx.y += 3;
  });

  // ── Assessment ──
  addSectionHeading(ctx, labels.assessment);
  plan.assessment.forEach((q, i) => addNumbered(ctx, i + 1, q));

  // ── Slides ──
  addSectionHeading(ctx, labels.slides);
  plan.slides.forEach((slide) => {
    checkPageBreak(ctx, 25);
    addSubHeading(ctx, `${slide.slideNumber}. ${slide.title}`);
    slide.bullets.forEach((b) => addBullet(ctx, b, 6));
    addLabeledLine(ctx, labels.visual, slide.visualSuggestion, 6);
    if (slide.speakerNotes) {
      addLabeledLine(ctx, labels.speakerNotes, slide.speakerNotes, 6);
    }
    ctx.y += 2;
  });

  // ── Discussion ──
  addSectionHeading(ctx, labels.discussion);
  plan.discussionQuestions.forEach((q, i) => addNumbered(ctx, i + 1, q));

  // ── Support Notes ──
  if (plan.supportNotes && plan.supportNotes.length > 0) {
    addSectionHeading(ctx, labels.supportNotes);
    plan.supportNotes.forEach((n) => addBullet(ctx, n));
  }

  // ── Teacher Notes ──
  if (plan.teacherNotes && plan.teacherNotes.length > 0) {
    addSectionHeading(ctx, labels.teacherNotes);
    plan.teacherNotes.forEach((n) => addBullet(ctx, n));
  }

  // ── Footer on each page ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(fontName, "normal");
    doc.setTextColor(160, 160, 160);
    doc.text(`${plan.snapshot.topic} — ${labels.lessonPlan}`, MARGIN_LEFT, 290);
    doc.text(`${i} / ${pageCount}`, PAGE_WIDTH - MARGIN_RIGHT, 290, {
      align: "right",
    });
  }

  // ── Save ──
  const safeName = plan.snapshot.topic
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  doc.save(`${safeName}_Lesson_Plan.pdf`);
}
