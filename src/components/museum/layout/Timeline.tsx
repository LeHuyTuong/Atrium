"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PHASES } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";

export function Timeline() {
  const currentPhase = useMuseum((s) => s.currentPhase);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const setStage = useMuseum((s) => s.setStage);
  const seenExhibits = useMuseum((s) => s.seenExhibits);

  return (
    <nav data-onboarding="timeline" className="fixed bottom-0 left-0 right-0 z-30 border-t border-foreground/10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-3 py-2 sm:gap-2 sm:px-6 sm:py-2.5">
        <button
          onClick={() => setStage("map")}
          className="hidden shrink-0 rounded-full border border-foreground/12 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-foreground/55 transition hover:border-foreground/30 hover:text-foreground sm:block"
        >
          Sơ đồ
        </button>
        <div className="flex flex-1 items-stretch gap-1 sm:gap-2">
          {PHASES.map((p, i) => {
            const active = currentPhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  enterPhase(p.id);
                  setCurrentPhase(p.id);
                  setStage("room");
                }}
                className="group relative flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-1.5 transition-all"
                style={{
                  borderColor: active ? p.accent : "rgba(255,255,255,0.08)",
                  background: active ? `${p.accent}14` : "transparent",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-serif text-sm font-bold leading-none"
                    style={{ color: active ? p.accent : "rgba(255,255,255,0.5)" }}
                  >
                    {p.label}
                  </span>
                  {i === PHASES.length - 1 && (
                    <span className="hidden text-[0.55rem] uppercase tracking-[0.12em] text-foreground/35 md:inline">
                      hiện tại
                    </span>
                  )}
                </div>
                <div className="hidden text-[0.6rem] text-foreground/45 sm:block">
                  {p.period}
                </div>
                {active && (
                  <motion.div
                    layoutId="timeline-active"
                    className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full"
                    style={{ background: p.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
