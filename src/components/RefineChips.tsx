"use client";

import { Button } from "@/components/ui/button";
import {
  Type,
  MessageCircle,
  Eye,
  Timer,
  TimerReset,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { RefinementType } from "@/lib/types";
import { useLanguage } from "@/lib/LanguageContext";

const CHIP_ICONS: Record<RefinementType, React.ElementType> = {
  simplify: Type,
  interactive: MessageCircle,
  visual: Eye,
  shorten: Timer,
  lengthen: TimerReset,
  extension: ArrowUpRight,
};

interface RefineChipsProps {
  onRefine: (type: RefinementType) => void;
  isRefining: boolean;
  activeRefinement?: RefinementType;
}

export function RefineChips({
  onRefine,
  isRefining,
  activeRefinement,
}: RefineChipsProps) {
  const { t } = useLanguage();

  const CHIPS: { type: RefinementType; label: string }[] = [
    { type: "simplify", label: t.refineSimplify },
    { type: "interactive", label: t.refineInteractive },
    { type: "visual", label: t.refineVisual },
    { type: "shorten", label: t.refineShorten },
    { type: "lengthen", label: t.refineLengthen },
    { type: "extension", label: t.refineExtension },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {t.refineTitle}
      </p>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const Icon = CHIP_ICONS[chip.type];
          const isActive = isRefining && activeRefinement === chip.type;
          return (
            <Button
              key={chip.type}
              variant="outline"
              size="sm"
              disabled={isRefining}
              onClick={() => onRefine(chip.type)}
              className="text-xs rounded-full"
            >
              {isActive ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <Icon className="h-3 w-3 mr-1.5" />
              )}
              {chip.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
