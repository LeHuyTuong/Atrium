"use client";

import { motion } from "framer-motion";
import { History as TimelineIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { EXHIBITS, PHASES, phaseById } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

function yearNum(y: string): number {
  const m = y.match(/\d{3,4}/);
  return m ? parseInt(m[0], 10) : 0;
}

export function HistoricalTimeline() {
  const open = useMuseum((s) => s.timelineOpen);
  const setOpen = useMuseum((s) => s.setTimelineOpen);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const seen = useMuseum((s) => s.seenExhibits);

  const sorted = [...EXHIBITS].sort((a, b) => yearNum(a.year) - yearNum(b.year));
  const minYear = yearNum(sorted[0]?.year ?? "1760");
  const maxYear = 2030;
  const span = maxYear - minYear;

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-6xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-6xl">
        <DialogTitle className="sr-only">Dòng thời gian lịch sử</DialogTitle>
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TimelineIcon className="h-4 w-4" style={{ color: "#00d4aa" }} />
            Dòng thời gian · 1760 → nay
          </div>
          <span className="text-[0.65rem] text-foreground/45">32 hiện vật theo năm</span>
        </div>

        <div className="max-h-[70vh] overflow-auto elegant-scroll p-5">
          {/* phase bands */}
          <div className="relative mb-3 h-6">
            {PHASES.map((p) => {
              const [start] = p.period.split("–");
              const s = yearNum(start.trim());
              const e = p.id === "industry-4" ? maxYear : yearNum(p.period.split("–")[1]?.trim() ?? "2010");
              const left = ((s - minYear) / span) * 100;
              const width = ((e - s) / span) * 100;
              return (
                <div
                  key={p.id}
                  className="absolute top-0 flex h-6 items-center rounded-full px-2 text-[0.55rem] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: `${p.accent}1a`,
                    color: p.accent,
                    border: `1px solid ${p.accent}33`,
                  }}
                >
                  {p.label}
                </div>
              );
            })}
          </div>

          {/* timeline line */}
          <div className="relative ml-2 min-h-[420px]">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/15" />
            {sorted.map((e, i) => {
              const phase = phaseById(e.phase)!;
              const y = yearNum(e.year);
              const left = ((y - minYear) / span) * 100;
              const isSeen = seen.includes(e.id);
              return (
                <motion.button
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => {
                    openExhibit(e.id);
                    setOpen(false);
                  }}
                  className="group relative mb-3 flex items-center gap-3 rounded-lg border border-transparent p-2 text-left transition hover:border-foreground/15 hover:bg-foreground/[0.03]"
                  style={{ marginLeft: `${left}%` }}
                >
                  {/* node */}
                  <span
                    className="absolute -left-[9px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
                    style={{
                      background: isSeen ? phase.accent : "#1a0f08",
                      borderColor: phase.accent,
                      boxShadow: isSeen ? `0 0 8px ${phase.accent}` : "none",
                    }}
                  />
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border"
                    style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}10`, color: phase.accent }}
                  >
                    <MotifIcon motif={e.motif} className="h-4 w-4" strokeWidth={1.4} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[0.7rem] font-bold" style={{ color: phase.accent }}>{e.year}</span>
                      <span className="truncate text-sm font-medium text-foreground/90">{e.name}</span>
                    </div>
                    <div className="truncate text-[0.65rem] text-foreground/45">
                      {e.inventor} · Industry {phase.label}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* year axis */}
          <div className="ml-2 mt-2 flex justify-between border-t border-foreground/10 pt-2 text-[0.6rem] text-foreground/40">
            {[1760, 1840, 1870, 1970, 2010, 2025].map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
