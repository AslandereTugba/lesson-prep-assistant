"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Language } from "@/lib/i18n";

function FlagUK({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
      <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </svg>
  );
}

function FlagTR({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#E30A17" d="M0 0h640v480H0z" />
      <circle cx="280" cy="240" r="120" fill="#FFF" />
      <circle cx="310" cy="240" r="96" fill="#E30A17" />
      <polygon fill="#FFF" points="388,240 340,260 356,216 340,220 340,260 388,240 340,220 356,264 340,220" transform="rotate(18 388 240)" />
      <path fill="#FFF" d="M388 240l-48.7-16.5 19 46.4-1.6-49.7-30 39.8z" />
    </svg>
  );
}

const OPTIONS: { value: Language; label: string; Flag: React.FC<{ className?: string }> }[] = [
  { value: "en", label: "English", Flag: FlagUK },
  { value: "tr", label: "Türkçe", Flag: FlagTR },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/30 rounded-full p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          aria-label={opt.label}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === opt.value
              ? "bg-white text-[#3a2200] shadow-sm"
              : "text-[#5c3a0a] hover:text-[#3a2200]"
          }`}
        >
          <opt.Flag className="h-4 w-5 rounded-[2px] shrink-0 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]" />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
