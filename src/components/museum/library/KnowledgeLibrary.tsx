"use client";

import { motion } from "framer-motion";
import { Library, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Trophy, Bookmark } from "lucide-react";
import { CHAPTERS, TOTAL_LESSONS } from "@/lib/knowledge-data";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";

export function KnowledgeLibrary() {
  const setStage = useMuseum((s) => s.setStage);
  const completedLessons = useMuseum((s) => s.completedLessons);
  const bookmarkedLessons = useMuseum((s) => s.bookmarkedLessons);
  const knowledgeQuizScore = useMuseum((s) => s.knowledgeQuizScore);
  const setCurrentLessonId = useMuseum((s) => s.setCurrentLessonId);
  const progressPct = Math.round((completedLessons.length / TOTAL_LESSONS) * 100);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-50" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setStage("landing")} className="shrink-0"><BrandMark size="sm" /></button>
            <div className="hidden h-6 w-px bg-foreground/15 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <Library className="h-4 w-4" style={{ color: "#e8b53a" }} />
              <span className="text-sm font-semibold text-foreground/85">Thư viện tri thức</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground/[0.03] px-3 py-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45">Tiến độ</span>
              <span className="text-xs font-semibold text-foreground/80"><span className="font-bold text-foreground">{completedLessons.length}</span>/{TOTAL_LESSONS}</span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-foreground/10">
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #e89446, #e8b53a, #4ade80)" }} initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <span className="font-mono text-[0.65rem] text-foreground/55">{progressPct}%</span>
            </div>
            {knowledgeQuizScore !== null && (
              <div className="hidden items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-xs sm:flex">
                <Trophy className="h-3.5 w-3.5 text-amber-300" /><span className="font-semibold text-amber-300">{knowledgeQuizScore}/10</span>
              </div>
            )}
            <button onClick={() => setStage("portal")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Bảo tàng</span>
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 text-center">
            <div className="mb-2 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">Bên trong bảo tàng</div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-5xl text-balance">Thư viện tri thức</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/60 sm:text-base">
              Học lý thuyết về « Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam » — ba chương, mười lăm bài học, mười câu trắc nghiệm.
            </p>
          </motion.div>

          {/* Special entry: History room */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <button
              onClick={() => setStage("library-history")}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all hover:bg-foreground/[0.05]"
              style={{ borderColor: "rgba(232,180,58,0.3)", background: "rgba(232,180,58,0.04)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a, transparent)" }} />
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border" style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}>
                <Library className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">Phòng đặc biệt · Khái quát CMCN</div>
                <div className="mt-0.5 font-serif text-lg font-bold text-foreground">Phòng thư viện lịch sử</div>
                <p className="mt-0.5 text-xs text-foreground/60">Timeline 4 cuộc cách mạng + lesson cards + mini quiz — không gian đọc với ánh sáng vàng ấm.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-amber-300 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CHAPTERS.map((ch, i) => {
              const chLessons = ch.lessons.length;
              const chCompleted = ch.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const chBookmarked = ch.lessons.filter((l) => bookmarkedLessons.includes(l.id)).length;
              return (
                <motion.div key={ch.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}>
                  <ChapterCard chapter={ch} completed={chCompleted} total={chLessons} bookmarked={chBookmarked} onClick={() => { setStage("library-lesson"); const firstLesson = ch.lessons[0]; if (firstLesson) setCurrentLessonId(firstLesson.id); }} />
                </motion.div>
              );
            })}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 3 * 0.08, duration: 0.5 }}>
              <button onClick={() => setStage("library-quiz")} className="group relative w-full overflow-hidden rounded-2xl border p-6 text-left transition-all hover:bg-foreground/[0.05]" style={{ borderColor: "rgba(232,180,58,0.3)", background: "rgba(232,180,58,0.05)" }}>
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a, transparent)" }} />
                <div className="absolute -right-4 -top-6 font-serif text-[7rem] font-bold leading-none opacity-[0.07]" style={{ color: "#e8b53a" }}>4</div>
                <div className="relative flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border" style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}><Trophy className="h-6 w-6" /></div>
                  {knowledgeQuizScore !== null && <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">{knowledgeQuizScore}/10</span>}
                </div>
                <div className="relative mt-4">
                  <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">Chương 4</div>
                  <h3 className="mt-1 font-serif text-xl font-bold text-foreground sm:text-2xl">Kiểm tra kiến thức</h3>
                  <p className="mt-2 text-sm text-foreground/60">10 câu trắc nghiệm — có tính điểm, đồng hồ đếm giờ, badge thành tích.</p>
                </div>
                <div className="relative mt-5 flex items-center justify-between">
                  <span className="text-xs text-foreground/55">10 câu · ~5 phút</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all group-hover:gap-2.5" style={{ background: "#e8b53a1a", color: "#e8b53a", border: "1px solid #e8b53a44" }}>
                    {knowledgeQuizScore !== null ? "Làm lại" : "Bắt đầu"}<ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            </motion.div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-3 text-xs text-foreground/45">
            <Bookmark className="h-3.5 w-3.5" /><span>Đánh dấu bài học để đọc sau · Hoàn thành để mở khóa huy hiệu</span>
          </div>
        </main>
      </div>
    </div>
  );
}

function ChapterCard({ chapter, completed, total, bookmarked, onClick }: { chapter: typeof CHAPTERS[0]; completed: number; total: number; bookmarked: number; onClick: () => void }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <button onClick={onClick} className="group relative w-full overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.025] p-6 text-left transition-all hover:border-foreground/30 hover:bg-foreground/[0.05] sm:p-7" style={{ ["--phase-color" as string]: chapter.accent }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${chapter.accent}, transparent)` }} />
      <div className="absolute -right-4 -top-6 font-serif text-[7rem] font-bold leading-none opacity-[0.07]" style={{ color: chapter.accent }}>{chapter.index}</div>
      <div className="relative flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl border" style={{ borderColor: `${chapter.accent}44`, background: `${chapter.accent}14`, color: chapter.accent }}><BookOpen className="h-6 w-6" /></div>
        {pct === 100 && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Hoàn thành</span>}
      </div>
      <div className="relative mt-4">
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">Chương {chapter.index}</div>
        <h3 className="mt-1 font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl">{chapter.title}</h3>
        <p className="mt-2 text-sm text-foreground/60">{chapter.subtitle}</p>
      </div>
      <div className="relative mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.12em] text-foreground/50">
          <span>{completed}/{total} bài học</span><span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: chapter.accent }} /></div>
      </div>
      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-foreground/55">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {chapter.lessons.reduce((s, l) => s + parseInt(l.duration), 0)} phút</span>
          {bookmarked > 0 && <span className="flex items-center gap-1" style={{ color: chapter.accent }}><Bookmark className="h-3 w-3" style={{ fill: chapter.accent }} /> {bookmarked}</span>}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all group-hover:gap-2.5" style={{ background: `${chapter.accent}1a`, color: chapter.accent, border: `1px solid ${chapter.accent}44` }}>
          {pct > 0 ? "Tiếp tục" : "Bắt đầu"}<ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
