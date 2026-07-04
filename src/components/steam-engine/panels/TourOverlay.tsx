"use client";

import { useEffect, useRef, useState } from "react";
import { useEngineStore, TOUR_STEPS } from "../useEngineStore";
import { t } from "../i18n";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Bottom-center narration card shown during the guided tour. Auto-advances
 *  through TOUR_STEPS, flying the camera and highlighting each part. Provides
 *  prev/next/play controls + a progress bar. */
export function TourOverlay({ className }: { className?: string }) {
  const tourActive = useEngineStore((s) => s.tourActive);
  const tourStep = useEngineStore((s) => s.tourStep);
  const running = useEngineStore((s) => s.running);
  const toggle = useEngineStore((s) => s.toggle);
  const stopTour = useEngineStore((s) => s.stopTour);
  const nextTourStep = useEngineStore((s) => s.nextTourStep);
  const prevTourStep = useEngineStore((s) => s.prevTourStep);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  const stepTimer = useRef(0);
  const lastStep = useRef(-1);
  const [progress, setProgress] = useState(0);

  // Auto-advance timer — runs only while the tour is active.
  useEffect(() => {
    if (!tourActive) {
      stepTimer.current = 0;
      lastStep.current = -1;
      return;
    }
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = (now - last) / 1000;
      last = now;
      const st = useEngineStore.getState();
      // Reset timer when the step index changes
      if (st.tourStep !== lastStep.current) {
        lastStep.current = st.tourStep;
        stepTimer.current = 0;
        setProgress(0);
      }
      if (st.running) {
        stepTimer.current += dt;
        const step = TOUR_STEPS[st.tourStep];
        if (step) {
          setProgress(Math.min(100, (stepTimer.current / step.duration) * 100));
          if (stepTimer.current >= step.duration) {
            stepTimer.current = 0;
            if (st.tourStep + 1 >= TOUR_STEPS.length) {
              st.stopTour();
            } else {
              st.nextTourStep();
            }
          }
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tourActive]);

  if (!tourActive) return null;
  const step = TOUR_STEPS[tourStep];
  if (!step) return null;
  const stepNum = tourStep + 1;
  const total = TOUR_STEPS.length;

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-20 left-1/2 z-40 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2",
        className,
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-stone-900/95 to-stone-950/95 shadow-2xl shadow-black/50 ring-1 ring-amber-500/10 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 ring-1 ring-amber-500/30">
            <Compass className="h-4 w-4 text-amber-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                {tr("tourTitle")}
              </span>
              <span className="rounded-full bg-stone-800 px-1.5 text-[10px] text-stone-300">
                {stepNum} / {total}
              </span>
            </div>
            <h3 className="text-sm font-bold text-amber-100">
              {language === "en" ? step.titleEn : step.title}
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 rounded-full p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={stopTour}
            aria-label={tr("tourTitle")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed text-stone-200">
            {language === "en" ? step.narrationEn : step.narration}
          </p>

          {/* Progress */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>{tr("tourStep")} {stepNum}/{total}</span>
              <span>{step.duration.toFixed(0)}s</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5 bg-stone-800 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500"
            />
          </div>

          {/* Controls */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-amber-500/25 bg-transparent px-2.5 text-xs text-stone-300 hover:bg-amber-500/10 hover:text-amber-100"
                onClick={prevTourStep}
                disabled={tourStep === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {tr("tourPrev")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 border-amber-500/25 bg-transparent px-2.5 text-xs text-stone-300 hover:bg-amber-500/10 hover:text-amber-100"
                onClick={nextTourStep}
                disabled={tourStep >= total - 1}
              >
                {tr("tourNext")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button
              size="sm"
              onClick={toggle}
              className="h-8 gap-1 bg-stone-700 px-2.5 text-xs text-stone-100 hover:bg-stone-600"
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {running ? tr("pause") : tr("tourContinue")}
            </Button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 border-t border-amber-500/10 bg-stone-950/40 px-4 py-2">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => useEngineStore.getState().setTourStep(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === tourStep
                  ? "w-6 bg-amber-400"
                  : i < tourStep
                    ? "w-1.5 bg-amber-600"
                    : "w-1.5 bg-stone-700 hover:bg-stone-600",
              )}
              aria-label={`Bước ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
