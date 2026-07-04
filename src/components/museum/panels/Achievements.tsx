"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Footprints,
  Eye,
  Compass,
  Bookmark,
  GraduationCap,
  Network,
  CheckCircle2,
  Columns2,
  Search,
  Route,
  PenLine,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { ACHIEVEMENTS, AchievementState } from "@/lib/achievements";
import { EXHIBITS, PHASES } from "@/lib/museum-data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Eye,
  Compass,
  Bookmark,
  GraduationCap,
  Award,
  Network,
  CheckCircle2,
  Columns2,
  Search,
  Route,
  PenLine,
};

const TIER_COLORS: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c8",
  gold: "#e8b53a",
  platinum: "#7fd4e8",
};

export function Achievements() {
  const open = useMuseum((s) => s.achievementsOpen);
  const setOpen = useMuseum((s) => s.setAchievementsOpen);

  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const phasesEntered = useMuseum((s) => s.phasesEntered);
  const quizzesPassed = useMuseum((s) => s.quizzesPassed);

  const state: AchievementState = useMemo(
    () => ({
      seenExhibits: new Set(seenExhibits),
      bookmarkedExhibits: new Set(bookmarks),
      phasesEntered: new Set(phasesEntered),
      quizzesPassed,
      connectionsExplored: new Set(),
      tourCompleted: false,
      guestbookSigned: false,
      exhibitsCompared: false,
      searchUsed: false,
      compareCount: 0,
    }),
    [seenExhibits, bookmarks, phasesEntered, quizzesPassed]
  );

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(state));
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-3xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-3xl">
        <DialogTitle className="sr-only">Huy hiệu thành tựu</DialogTitle>
        <div className="border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Award className="h-4 w-4" style={{ color: "#e8b53a" }} /> Huy hiệu thành tựu
            </div>
            <span className="text-[0.65rem] text-foreground/50">
              {unlocked.length}/{ACHIEVEMENTS.length} đã mở · {pct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #cd7f32, #e8b53a, #7fd4e8)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto elegant-scroll p-4 sm:grid-cols-2">
          {ACHIEVEMENTS.map((a, i) => {
            const got = a.check(state);
            const Icon = ICONS[a.icon] ?? Award;
            const color = TIER_COLORS[a.tier];
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="flex items-start gap-3 rounded-xl border p-3 transition"
                style={{
                  borderColor: got ? `${color}44` : "oklch(0.5 0.02 60 / 0.12)",
                  background: got ? `${color}0d` : "oklch(0.5 0.02 60 / 0.04)",
                  opacity: got ? 1 : 0.55,
                }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border"
                  style={{
                    borderColor: got ? color : "oklch(0.5 0.02 60 / 0.22)",
                    background: got ? `${color}18` : "transparent",
                    color: got ? color : "oklch(0.5 0.02 60 / 0.5)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground/90">{a.name}</span>
                    <span className="text-[0.5rem] uppercase tracking-[0.15em]" style={{ color }}>
                      {a.tier}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground/55">{a.description}</p>
                </div>
                {got && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color }} />}
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
