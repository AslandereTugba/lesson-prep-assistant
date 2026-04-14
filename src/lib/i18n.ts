export type Language = "en" | "tr";

export const translations = {
  en: {
    // Header
    appTitle: "Lesson Prep Assistant",
    appSubtitle: "Create a classroom-ready lesson draft in minutes",

    // Form labels
    topicLabel: "Topic",
    topicPlaceholder: "e.g., Photosynthesis, Fractions, World War II",
    gradeLabel: "Grade / Level",
    gradePlaceholder: "Select grade",
    durationLabel: "Duration",
    durationPlaceholder: "Select duration",
    minutes: "minutes",
    customizeLesson: "Customize your lesson",
    learningGoalLabel: "Learning Goal",
    learningGoalPlaceholder:
      "What should students know or be able to do by the end?",
    backgroundKnowledgeLabel: "Background Knowledge",
    lessonModeLabel: "Lesson Mode",
    supportLearnerNeeds: "Support learner needs",

    // Background knowledge options
    bgNew: "New to topic",
    bgSome: "Some familiarity",
    bgStrong: "Strong knowledge",

    // Lesson modes
    modeQuickLabel: "Quick & Clear",
    modeQuickDesc: "Teacher-led, efficient pacing",
    modeInteractiveLabel: "Interactive",
    modeInteractiveDesc: "Discussion & collaboration",
    modePracticeLabel: "Practice-Focused",
    modePracticeDesc: "Guided & independent practice",
    modeInclusiveLabel: "Inclusive",
    modeInclusiveDesc: "Differentiated & accessible",

    // Learner supports
    supportSimplifiedLanguage: "Simplified language",
    supportVisualSupport: "Visual support",
    supportStepByStep: "Step-by-step instructions",
    supportHandsOn: "Hands-on activities",
    supportExtensionChallenge: "Extension / challenge",
    supportEllSupport: "English language support",

    // Form buttons & states
    generating: "Creating your lesson...",
    generateLessonPlan: "Create my lesson plan",

    // Validation
    errorTopic: "Please enter a topic",
    errorGrade: "Please select a grade level",
    errorDuration: "Please select a duration",

    // Error state
    somethingWentWrong: "Something went wrong",

    // Actions
    copied: "Copied!",
    copyAll: "Copy All",
    downloadPdf: "Download PDF",
    startOver: "Start Over",

    // Footer
    footer: "Made for teachers, with care ·  Powered by AI",

    // Generation progress
    progressStep1: "Understanding your class...",
    progressStep2: "Building lesson flow...",
    progressStep3: "Drafting activities and slides...",
    progressStep4: "Finalizing your lesson plan...",

    // Refine chips
    refineTitle: "Refine your lesson",
    refineSimplify: "Simplify",
    refineInteractive: "Make Interactive",
    refineVisual: "Add Visuals",
    refineShorten: "Shorten",
    refineLengthen: "Lengthen",
    refineExtension: "Add Extension",

    // Output sections
    outputObjectives: "Learning Objectives",
    outputKeyConcepts: "Key Concepts & Vocabulary",
    outputLessonFlow: "Lesson Flow",
    outputTeacher: "Teacher:",
    outputStudents: "Students:",
    outputAssessment: "Quick Assessment",
    outputSlides: "5-Slide Presentation Outline",
    outputVisual: "Visual:",
    outputDiscussion: "Discussion Questions",
    outputMaterials: "Materials Needed",
    outputSupportNotes: "Learner Support Notes",
    outputPriorKnowledge: "Prior knowledge:",
    outputOverview: "Lesson Overview",
    outputMisconceptions: "Common Misconceptions",
    outputTeacherNotes: "Teacher Notes",
    outputTeachingStrategies: "Teaching Strategies",
    outputSpeakerNotes: "Speaker Notes:",
    outputSampleQuestions: "Sample Questions",
    outputTransition: "Transition:",

    // Grades
    grades: [
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
    ],

    // Section card headings
    sectionCoreTitle: "Core Details",
    sectionCoreHelper: "Tell us the basics about your lesson",
    sectionCustomizeTitle: "Customize",
    sectionCustomizeHelper: "Fine-tune how the lesson is delivered",
    sectionSupportsTitle: "Learner Supports",
    sectionSupportsHelper: "Extra help for diverse classrooms",

    // Preview sidebar
    previewTitle: "What you'll get",
    previewItems: [
      "Lesson objectives",
      "Step-by-step flow",
      "5-slide outline",
      "Assessment questions",
      "Discussion prompts",
    ] as readonly string[],

    // Progress heading
    progressHeading: "Building your lesson plan...",

    // Misc
    noCustomizations: "No customizations",
    supportsSelected: "supports selected",
    noneSelected: "None selected",
  },
  tr: {
    // Header
    appTitle: "Ders Hazırlık Asistanı",
    appSubtitle: "Birkaç dakikada sınıfa hazır ders taslağı oluşturun",

    // Form labels
    topicLabel: "Konu",
    topicPlaceholder: "ör. Fotosentez, Kesirler, Dünya Savaşları",
    gradeLabel: "Sınıf / Seviye",
    gradePlaceholder: "Sınıf seçin",
    durationLabel: "Süre",
    durationPlaceholder: "Süre seçin",
    minutes: "dakika",
    customizeLesson: "Dersinizi özelleştirin",
    learningGoalLabel: "Öğrenme Hedefi",
    learningGoalPlaceholder:
      "Öğrenciler dersin sonunda ne bilmeli veya yapabilmeli?",
    backgroundKnowledgeLabel: "Ön Bilgi Düzeyi",
    lessonModeLabel: "Ders Modu",
    supportLearnerNeeds: "Öğrenci destek ihtiyaçları",

    // Background knowledge options
    bgNew: "Konuya yeni",
    bgSome: "Biraz aşina",
    bgStrong: "Güçlü bilgi",

    // Lesson modes
    modeQuickLabel: "Hızlı ve Net",
    modeQuickDesc: "Öğretmen merkezli, verimli tempo",
    modeInteractiveLabel: "Etkileşimli",
    modeInteractiveDesc: "Tartışma ve iş birliği",
    modePracticeLabel: "Uygulama Odaklı",
    modePracticeDesc: "Rehberli ve bağımsız uygulama",
    modeInclusiveLabel: "Kapsayıcı",
    modeInclusiveDesc: "Farklılaştırılmış ve erişilebilir",

    // Learner supports
    supportSimplifiedLanguage: "Sadeleştirilmiş dil",
    supportVisualSupport: "Görsel destek",
    supportStepByStep: "Adım adım yönergeler",
    supportHandsOn: "Uygulamalı etkinlikler",
    supportExtensionChallenge: "Ek çalışma / zorluk",
    supportEllSupport: "Dil öğrenimi desteği",

    // Form buttons & states
    generating: "Ders oluşturuluyor...",
    generateLessonPlan: "Ders planımı oluştur",

    // Validation
    errorTopic: "Lütfen bir konu girin",
    errorGrade: "Lütfen sınıf seviyesi seçin",
    errorDuration: "Lütfen süre seçin",

    // Error state
    somethingWentWrong: "Bir şeyler yanlış gitti",

    // Actions
    copied: "Kopyalandı!",
    copyAll: "Tümünü Kopyala",
    downloadPdf: "PDF İndir",
    startOver: "Baştan Başla",

    // Footer
    footer: "Öğretmenler için, özenle yapıldı · Yapay zeka destekli",

    // Generation progress
    progressStep1: "Sınıfınız anlaşılıyor...",
    progressStep2: "Ders akışı oluşturuluyor...",
    progressStep3: "Etkinlikler ve slaytlar hazırlanıyor...",
    progressStep4: "Ders planınız tamamlanıyor...",

    // Refine chips
    refineTitle: "Dersinizi iyileştirin",
    refineSimplify: "Sadeleştir",
    refineInteractive: "Etkileşimli Yap",
    refineVisual: "Görsel Ekle",
    refineShorten: "Kısalt",
    refineLengthen: "Uzat",
    refineExtension: "Ek Etkinlik Ekle",

    // Output sections
    outputObjectives: "Öğrenme Hedefleri",
    outputKeyConcepts: "Temel Kavramlar ve Kelimeler",
    outputLessonFlow: "Ders Akışı",
    outputTeacher: "Öğretmen:",
    outputStudents: "Öğrenciler:",
    outputAssessment: "Hızlı Değerlendirme",
    outputSlides: "5 Slaytlık Sunum Taslağı",
    outputVisual: "Görsel:",
    outputDiscussion: "Tartışma Soruları",
    outputMaterials: "Gerekli Materyaller",
    outputSupportNotes: "Öğrenci Destek Notları",
    outputPriorKnowledge: "Ön bilgi:",
    outputOverview: "Ders Özeti",
    outputMisconceptions: "Yaygın Yanılgılar",
    outputTeacherNotes: "Öğretmen Notları",
    outputTeachingStrategies: "Öğretim Stratejileri",
    outputSpeakerNotes: "Konuşmacı Notları:",
    outputSampleQuestions: "Örnek Sorular",
    outputTransition: "Geçiş:",

    // Grades
    grades: [
      "Okul Öncesi",
      "Ana Sınıfı",
      "1. Sınıf",
      "2. Sınıf",
      "3. Sınıf",
      "4. Sınıf",
      "5. Sınıf",
      "6. Sınıf",
      "7. Sınıf",
      "8. Sınıf",
      "9. Sınıf",
      "10. Sınıf",
      "11. Sınıf",
      "12. Sınıf",
      "Üniversite",
    ],

    // Section card headings
    sectionCoreTitle: "Temel Bilgiler",
    sectionCoreHelper: "Dersiniz hakkında bize temel bilgileri verin",
    sectionCustomizeTitle: "Özelleştir",
    sectionCustomizeHelper: "Dersin nasıl sunulacağını ayarlayın",
    sectionSupportsTitle: "Öğrenci Destekleri",
    sectionSupportsHelper: "Farklı sınıflar için ek yardımlar",

    // Preview sidebar
    previewTitle: "Neler alacaksınız",
    previewItems: [
      "Ders hedefleri",
      "Adım adım akış",
      "5 slaytlık taslak",
      "Değerlendirme soruları",
      "Tartışma soruları",
    ] as readonly string[],

    // Progress heading
    progressHeading: "Ders planınız hazırlanıyor...",

    // Misc
    noCustomizations: "Özelleştirme yok",
    supportsSelected: "destek seçildi",
    noneSelected: "Seçilmedi",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function getTranslations(lang: Language) {
  return translations[lang];
}
