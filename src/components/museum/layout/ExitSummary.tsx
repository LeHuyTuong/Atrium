"use client";

import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, BookOpen, Award, Share2, Sparkles } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { EXHIBITS, PHASES, TOTAL_EXHIBITS } from "@/lib/museum-data";
import { BrandMark, ProgressRing } from "./brand";
import { ThemeToggle } from "./ThemeToggle";

export function ExitSummary() {
  const setStage = useMuseum((s) => s.setStage);
  const reset = useMuseum((s) => s.reset);
  const setGuestbookOpen = useMuseum((s) => s.setGuestbookOpen);
  const setAchievementsOpen = useMuseum((s) => s.setAchievementsOpen);
  const setTourBuilderOpen = useMuseum((s) => s.setTourBuilderOpen);
  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const phasesEntered = useMuseum((s) => s.phasesEntered);
  const quizzesPassed = useMuseum((s) => s.quizzesPassed);
  const startedAt = useMuseum((s) => s.startedAt);
  const mode = useMuseum((s) => s.mode);

  const elapsed = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const pct = Math.round((seenExhibits.length / EXHIBITS.length) * 100);

  const farewell =
    pct === 100
      ? "Bạn đã đi khắp bảo tàng. Từ tiếng rít hơi nước đến những mạng nơ-ron — cả bốn kỷ nguyên đều đã mở ra với bạn."
      : pct >= 50
      ? "Bạn đã đi được nửa hành trình. Những hiện vật còn lại vẫn đang chờ trong phòng tối."
      : "Bạn mới chạm vào ngưỡng của bảo tàng. Khi nào sẵn sàng, cánh cửa vẫn mở.";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-70" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark />
          <ThemeToggle compact />
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <div className="relative mx-auto grid h-20 w-20 place-items-center">
              <ProgressRing value={seenExhibits.length} max={EXHIBITS.length} accent="#e89446" size={80} />
              <span className="absolute font-serif text-lg font-bold text-foreground">{pct}%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              Cánh cửa khép lại
            </div>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground sm:text-5xl text-balance">
              Cảm ơn bạn đã thăm Atrium
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/65 sm:text-base">
              {farewell}
            </p>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <Stat label="Hiện vật" value={`${seenExhibits.length}/${TOTAL_EXHIBITS}`} accent="#e89446" />
            <Stat label="Phòng" value={`${phasesEntered.length}/4`} accent="#4ade80" />
            <Stat label="Trắc nghiệm" value={quizzesPassed} accent="#e8b53a" />
            <Stat label="Thời gian" value={`${mm}:${ss}`} accent="#00d4aa" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              onClick={() => setGuestbookOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:gap-3"
            >
              <BookOpen className="h-4 w-4" /> Ký sổ khách
            </button>
            <button
              onClick={() => setAchievementsOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2.5 text-sm text-foreground/75 transition hover:border-foreground/30"
            >
              <Award className="h-4 w-4" /> Huy hiệu
            </button>
            <button
              onClick={() => setTourBuilderOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2.5 text-sm text-foreground/75 transition hover:border-foreground/30"
            >
              <Share2 className="h-4 w-4" /> Tạo tour
            </button>
            <button
              onClick={() => {
                reset();
                setStage("landing");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2.5 text-sm text-foreground/75 transition hover:border-foreground/30"
            >
              <RotateCcw className="h-4 w-4" /> Tham quan lại
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-10 flex items-center gap-2 text-xs italic text-foreground/40"
          >
            <Sparkles className="h-3 w-3" />
            « Bảo tàng không khép cửa — nó chỉ tắt đèn, chờ bạn quay lại. »
          </motion.p>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-3">
      <div className="font-serif text-2xl font-bold" style={{ color: accent }}>{value}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.15em] text-foreground/45">{label}</div>
    </div>
  );
}
