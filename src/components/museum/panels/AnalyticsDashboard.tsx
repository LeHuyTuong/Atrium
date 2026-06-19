"use client";

import { motion } from "framer-motion";
import { BarChart3, Eye, Bookmark, Compass, GraduationCap, Clock, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { EXHIBITS, PHASES } from "@/lib/museum-data";

export function AnalyticsDashboard() {
  const open = useMuseum((s) => s.analyticsOpen);
  const setOpen = useMuseum((s) => s.setAnalyticsOpen);
  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const phasesEntered = useMuseum((s) => s.phasesEntered);
  const quizzesPassed = useMuseum((s) => s.quizzesPassed);
  const startedAt = useMuseum((s) => s.startedAt);

  const elapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const byPhase = PHASES.map((p) => {
    const ids = EXHIBITS.filter((e) => e.phase === p.id).map((e) => e.id);
    const seen = ids.filter((id) => seenExhibits.includes(id)).length;
    return { phase: p, seen, total: ids.length };
  });

  const completionPct = Math.round((seenExhibits.length / EXHIBITS.length) * 100);

  const stats = [
    { icon: Eye, label: "Hiện vật đã xem", value: `${seenExhibits.length}/${EXHIBITS.length}`, color: "#e89446" },
    { icon: Bookmark, label: "Yêu thích", value: bookmarks.length, color: "#ff9eb5" },
    { icon: Compass, label: "Phòng đã vào", value: `${phasesEntered.length}/4`, color: "#4ade80" },
    { icon: GraduationCap, label: "Trắc nghiệm vượt qua", value: quizzesPassed, color: "#e8b53a" },
    { icon: Clock, label: "Thời gian tham quan", value: `${mm}:${ss}`, color: "#00d4aa" },
    { icon: TrendingUp, label: "Hoàn thành", value: `${completionPct}%`, color: "#e879f9" },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-2xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Số liệu tham quan</DialogTitle>
        <div className="border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4" style={{ color: "#00d4aa" }} /> Số liệu tham quan của bạn
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto elegant-scroll p-5">
          {/* stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4"
              >
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <div className="mt-2 font-serif text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* per-phase progress */}
          <div className="mt-6">
            <div className="mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/45">
              Tiến độ theo kỷ nguyên
            </div>
            <div className="space-y-2">
              {byPhase.map(({ phase, seen, total }) => {
                const pct = Math.round((seen / total) * 100);
                return (
                  <div key={phase.id} className="flex items-center gap-3">
                    <span className="w-8 font-serif text-sm font-bold" style={{ color: phase.accent }}>{phase.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: phase.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="w-16 text-right text-[0.7rem] text-foreground/55">{seen}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* overall completion ring */}
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
            <div className="relative grid h-16 w-16 place-items-center">
              <svg className="-rotate-90" width={64} height={64}>
                <circle cx={32} cy={32} r={28} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
                <circle
                  cx={32}
                  cy={32}
                  r={28}
                  fill="none"
                  stroke="#e89446"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - completionPct / 100)}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <span className="absolute font-serif text-sm font-bold text-foreground">{completionPct}%</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Hoàn thành bộ sưu tập</div>
              <div className="text-xs text-foreground/55">
                Bạn đã xem {seenExhibits.length} trên 32 hiện vật.{" "}
                {completionPct === 100
                  ? "Bạn đã đi khắp bảo tàng — xin chúc mừng!"
                  : `Còn ${EXHIBITS.length - seenExhibits.length} hiện vật để khám phá.`}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
