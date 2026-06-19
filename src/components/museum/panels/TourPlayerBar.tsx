"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Route, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { exhibitById, phaseById } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";

/**
 * TourPlayerBar — floating playback bar shown while a tour is active.
 *
 * Renders only when `activeTour` is set in the store. Sits below the
 * VisitorHud (top-16), drives prev/next through the tour's exhibit list,
 * and offers an exit button that returns the visitor to the museum map.
 */
export function TourPlayerBar() {
  const activeTour = useMuseum((s) => s.activeTour);
  const advanceTourStep = useMuseum((s) => s.advanceTourStep);
  const retreatTourStep = useMuseum((s) => s.retreatTourStep);
  const clearActiveTour = useMuseum((s) => s.clearActiveTour);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const closeExhibit = useMuseum((s) => s.closeExhibit);
  const setStage = useMuseum((s) => s.setStage);

  const [finishing, setFinishing] = useState(false);

  const step = activeTour?.currentStep ?? 0;
  const exhibitIds = activeTour?.exhibitIds ?? [];
  const total = exhibitIds.length;
  const currentId = exhibitIds[step];
  const exhibit = currentId ? exhibitById(currentId) : undefined;
  const phase = exhibit ? phaseById(exhibit.phase) : undefined;
  const accent = phase?.accent ?? "#e89446";

  const isFirst = step <= 0;
  const isLast = total > 0 && step >= total - 1;
  const progressPct = total > 0 ? ((step + 1) / total) * 100 : 0;

  const onNext = () => {
    if (!activeTour || finishing) return;
    if (isLast) {
      setFinishing(true);
      toast.success("Hoàn thành tour! Cảm ơn bạn đã đồng hành.");
      closeExhibit();
      window.setTimeout(() => {
        clearActiveTour();
        setFinishing(false);
      }, 2000);
      return;
    }
    const nextId = exhibitIds[step + 1];
    if (nextId) {
      openExhibit(nextId);
      advanceTourStep();
    }
  };

  const onPrev = () => {
    if (!activeTour || isFirst) return;
    const prevId = exhibitIds[step - 1];
    if (prevId) {
      openExhibit(prevId);
      retreatTourStep();
    }
  };

  const onExit = () => {
    closeExhibit();
    clearActiveTour();
    setStage("map");
  };

  return (
    <AnimatePresence>
      {activeTour && (
        <motion.div
          role="region"
          aria-label="Trình phát tour"
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -28, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed left-0 right-0 top-16 z-20 mx-auto my-2 max-w-3xl px-3"
        >
          <div className="flex flex-col gap-2.5 rounded-2xl border border-foreground/15 bg-card/90 p-2.5 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:gap-3 sm:p-3">
            {/* Left: tour identity */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                style={{ background: `${accent}1f`, color: accent }}
              >
                <Route className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[0.82rem] font-semibold text-foreground">
                  {activeTour.title}
                </div>
                <div className="hidden truncate text-[0.62rem] text-foreground/45 sm:block">
                  Tour của {activeTour.author}
                </div>
              </div>
            </div>

            {/* Right: progress + controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* progress bar (compact on mobile, wider on desktop) */}
              <div
                className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-foreground/10 sm:w-28"
                role="progressbar"
                aria-valuenow={step + 1}
                aria-valuemin={1}
                aria-valuemax={Math.max(1, total)}
                aria-label={`Bước ${step + 1} trên ${total}`}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: accent }}
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                />
              </div>

              {/* prev */}
              <button
                onClick={onPrev}
                disabled={isFirst}
                aria-label="Bước trước"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-foreground/15 text-foreground/70 transition hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="shrink-0 text-[0.7rem] font-medium tabular-nums text-foreground/70">
                Bước <span className="font-bold text-foreground">{step + 1}</span>
                <span className="text-foreground/40">/{total}</span>
              </span>

              {/* next / finish */}
              <button
                onClick={onNext}
                disabled={finishing}
                aria-label={isLast ? "Hoàn thành tour" : "Bước sau"}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[0.7rem] font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
                style={{ background: accent }}
              >
                {isLast ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      {finishing ? "Đã xong" : "Hoàn thành"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* exit */}
              <button
                onClick={onExit}
                aria-label="Thoát tour"
                title="Thoát tour"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-foreground/15 text-foreground/60 transition hover:border-foreground/30 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
