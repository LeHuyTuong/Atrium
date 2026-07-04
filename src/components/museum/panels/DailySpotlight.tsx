"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Star } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { Exhibit, phaseById } from "@/lib/museum-data";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

interface SpotlightData {
  exhibit: Exhibit;
  spotlight: { dateKey: string; curatorNote: string | null };
}

export function DailySpotlight() {
  const stage = useMuseum((s) => s.stage);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const [data, setData] = useState<SpotlightData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (stage !== "room" && stage !== "map") return;
    if (dismissed) return;
    let active = true;
    fetch("/api/daily-spotlight")
      .then((r) => r.json())
      .then((d) => {
        if (active && d.exhibit) setData(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [stage, dismissed]);

  if (!data || dismissed || (stage !== "room" && stage !== "map")) return null;
  const phase = phaseById(data.exhibit.phase)!;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 right-4 z-20 w-[300px] max-w-[calc(100vw-2rem)] sm:bottom-24 sm:right-6"
      >
        <div
          className="relative overflow-hidden rounded-xl border bg-card/95 p-3 shadow-2xl backdrop-blur-md"
          style={{ borderColor: `${phase.accent}44` }}
        >
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${phase.accent}, transparent)` }} />
          <div className="flex items-start gap-2.5">
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border"
              style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}12`, color: phase.accent }}
            >
              <Star className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.18em]" style={{ color: phase.accent }}>
                <Sparkles className="h-3 w-3" /> Hiện vật nổi bật hôm nay
              </div>
              <div className="mt-0.5 truncate font-serif text-sm font-bold text-foreground">
                {data.exhibit.name}
              </div>
              <div className="text-[0.65rem] text-foreground/50">
                {data.exhibit.year} · Industry {phase.label}
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-foreground/40 transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Ẩn"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {data.spotlight.curatorNote && (
            <p className="mt-2 line-clamp-2 text-[0.7rem] leading-relaxed text-foreground/65">
              {data.spotlight.curatorNote}
            </p>
          )}
          <button
            onClick={() => openExhibit(data.exhibit.id)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold transition hover:gap-2.5"
            style={{ color: phase.accent }}
          >
            Mở hiện vật <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
