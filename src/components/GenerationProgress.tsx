"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export function GenerationProgress() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const STEPS = [t.progressStep1, t.progressStep2, t.progressStep3, t.progressStep4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, [STEPS.length]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">{t.progressHeading}</p>
          <div className="space-y-3 w-full max-w-xs">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  i < currentStep
                    ? "text-muted-foreground"
                    : i === currentStep
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/40"
                }`}
              >
                {i < currentStep ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ml-1 transition-colors duration-500 ${
                      i === currentStep
                        ? "bg-primary animate-pulse"
                        : "bg-muted"
                    }`}
                  />
                )}
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
