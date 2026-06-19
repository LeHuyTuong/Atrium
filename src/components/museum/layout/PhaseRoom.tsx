"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Map as MapIcon, LayoutGrid, Clock, Sparkles, Layers3 } from "lucide-react";
import { useState } from "react";
import { PHASES, exhibitsByPhase, PhaseId } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { BrandMark, PhaseNumeral, ProgressRing } from "./brand";
import { ExhibitCard } from "@/components/museum/cards/ExhibitCard";
import { VisitorHud } from "@/components/museum/layout/VisitorHud";
import { Timeline } from "@/components/museum/layout/Timeline";

export function PhaseRoom() {
  const currentPhase = useMuseum((s) => s.currentPhase);
  const setStage = useMuseum((s) => s.setStage);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const seenExhibits = useMuseum((s) => s.seenExhibits);

  const [dismissedPhases, setDismissedPhases] = useState<Set<string>>(new Set());

  if (!currentPhase) {
    return (
      <div className="grid min-h-screen place-items-center">
        <button onClick={() => setStage("map")} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">
          Quay về sơ đồ
        </button>
      </div>
    );
  }

  const introDismissed = dismissedPhases.has(currentPhase);
  const dismissIntro = () =>
    setDismissedPhases((prev) => new Set(prev).add(currentPhase));

  const phase = PHASES.find((p) => p.id === currentPhase)!;
  const exhibits = exhibitsByPhase(currentPhase);
  const seenCount = exhibits.filter((e) => seenExhibits.includes(e.id)).length;
  const phaseIdx = PHASES.findIndex((p) => p.id === currentPhase);
  const nextPhase = PHASES[phaseIdx + 1];
  const prevPhase = PHASES[phaseIdx - 1];

  const goPhase = (p: PhaseId) => {
    enterPhase(p);
    setCurrentPhase(p);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-50" />
      <div className="pointer-events-none absolute inset-0 phase-glow" style={{ ["--phase-color" as string]: phase.accent }} />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <VisitorHud />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-32 pt-4 sm:px-6 sm:pb-28">
          {/* era intro header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <PhaseNumeral index={phase.index} accent={phase.accent} />
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">
                    {phase.period}
                  </span>
                </div>
                <h1 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
                  {phase.name}: {phase.era}
                </h1>
              </div>
              <ProgressRing value={seenCount} max={8} accent={phase.accent} size={56} />
            </div>

            <AnimatePresence>
              {!introDismissed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: phase.accent }} />
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-foreground/75">{phase.intro}</p>
                      <p className="mt-2 text-xs italic text-foreground/50">
                        « {phase.curatorQuote} »
                      </p>
                    </div>
                    <button
                      onClick={dismissIntro}
                      className="shrink-0 rounded-full border border-foreground/15 px-2.5 py-1 text-[0.65rem] text-foreground/55 transition hover:border-foreground/30 hover:text-foreground"
                    >
                      Ẩn
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* collection header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[0.7rem] uppercase tracking-[0.3em] text-foreground/55">
              Bộ sưu tập · {seenCount}/8 đã xem
            </h2>
            <span className="hidden items-center gap-2 text-[0.7rem] text-foreground/45 sm:flex">
              <Layers3 className="h-3.5 w-3.5" /> 8 hiện vật
            </span>
          </div>

          {/* exhibit grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {exhibits.map((e, i) => (
              <ExhibitCard key={e.id} exhibit={e} index={i} />
            ))}
          </div>

          {/* room navigation */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
            <button
              onClick={() => setStage("map")}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-2 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Sơ đồ bảo tàng
            </button>

            <div className="flex items-center gap-2">
              {prevPhase && (
                <button
                  onClick={() => goPhase(prevPhase.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-2 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> {prevPhase.label}
                </button>
              )}
              {nextPhase && (
                <button
                  onClick={() => goPhase(nextPhase.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-background transition hover:gap-2.5"
                  style={{ background: nextPhase.accent }}
                >
                  Kỷ nguyên {nextPhase.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {!nextPhase && (
                <button
                  onClick={() => setStage("exit")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:gap-2.5"
                >
                  Kết thúc hành trình
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>

        <Timeline />
      </div>
    </div>
  );
}
