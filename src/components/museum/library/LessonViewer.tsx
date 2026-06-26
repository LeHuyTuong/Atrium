"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Bookmark, Volume2, Square, Loader2, CheckCircle2, Sparkles, Lightbulb, Clock, ListChecks } from "lucide-react";
import { CHAPTERS, lessonById, LessonSection } from "@/lib/knowledge-data";
import { useMuseum } from "@/lib/store";
import { toast } from "sonner";
import { InteractiveRenderer } from "./InteractiveRenderer";

export function LessonViewer() {
  const currentLessonId = useMuseum((s) => s.currentLessonId);
  const setStage = useMuseum((s) => s.setStage);
  const setCurrentLessonId = useMuseum((s) => s.setCurrentLessonId);
  const completeLesson = useMuseum((s) => s.completeLesson);
  const completedLessons = useMuseum((s) => s.completedLessons);
  const bookmarkedLessons = useMuseum((s) => s.bookmarkedLessons);
  const toggleLessonBookmark = useMuseum((s) => s.toggleLessonBookmark);

  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [narrating, setNarrating] = useState(false);
  const [narrLoading, setNarrLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const lesson = currentLessonId ? lessonById(currentLessonId) : undefined;
  const chapter = lesson ? CHAPTERS.find((c) => c.id === lesson.chapterId) : undefined;

  const allLessons = useMemo(() => CHAPTERS.flatMap((c) => c.lessons), []);
  const currentIdx = lesson ? allLessons.findIndex((l) => l.id === lesson.id) : -1;
  const nextLesson = currentIdx >= 0 ? allLessons[currentIdx + 1] : undefined;
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : undefined;

  useEffect(() => {
    setOpenSections(new Set([0]));
    if (audio) {
      audio.pause();
      setAudio(null);
      setNarrating(false);
    }
  }, [currentLessonId, audio]);

  if (!lesson || !chapter) {
    return (
      <div className="grid min-h-screen place-items-center">
        <button onClick={() => setStage("library")} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">Quay về thư viện</button>
      </div>
    );
  }

  const isCompleted = completedLessons.includes(lesson.id);
  const isBookmarked = bookmarkedLessons.includes(lesson.id);

  const toggleSection = (i: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleComplete = () => {
    completeLesson(lesson.id);
    toast.success("Đã đánh dấu hoàn thành bài học!");
    if (nextLesson) {
      setTimeout(() => setCurrentLessonId(nextLesson.id), 800);
    } else {
      setTimeout(() => setStage("library-quiz"), 800);
    }
  };

  const narrateText = async () => {
    if (narrating && audio) { audio.pause(); setNarrating(false); return; }
    if (audio) { audio.play(); setNarrating(true); return; }
    setNarrLoading(true);
    try {
      const text = lesson.sections.map((s) => `${s.heading}. ${s.body}`).join(" ");
      const res = await fetch("/api/narrate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error("narrate failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const el = new Audio(url);
      el.onended = () => { setNarrating(false); URL.revokeObjectURL(url); };
      el.onerror = () => { setNarrating(false); URL.revokeObjectURL(url); toast.error("Không thể phát âm thanh."); };
      setAudio(el);
      await el.play();
      setNarrating(true);
    } catch {
      toast.error("Giọng đọc tạm thời không sẵn sàng.");
    } finally {
      setNarrLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-40" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setStage("library")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Thư viện</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: chapter.accent }}>Chương {chapter.index}</span>
              <span className="text-foreground/30">·</span>
              <span className="text-xs text-foreground/55">Bài {currentIdx + 1}/{allLessons.length}</span>
            </div>
            <div className="flex-1" />
            <button onClick={toggleLessonBookmark} className="grid h-8 w-8 place-items-center rounded-full border border-foreground/12 transition hover:border-foreground/30" style={{ borderColor: isBookmarked ? chapter.accent : "oklch(0.5 0.02 60 / 0.18)", background: isBookmarked ? `${chapter.accent}14` : "transparent" }} aria-label="Đánh dấu bài học">
              <Bookmark className="h-3.5 w-3.5" style={{ color: isBookmarked ? chapter.accent : "currentColor", fill: isBookmarked ? chapter.accent : "transparent" }} />
            </button>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Đã xong</span>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-2 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
              <span style={{ color: chapter.accent }}>{chapter.title}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.duration}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">{lesson.title}</h1>
            <p className="mt-2 font-serif text-base italic text-foreground/55 sm:text-lg">{lesson.subtitle}</p>
            <button onClick={narrateText} className="mt-4 inline-flex items-center gap-2 rounded-full border bg-foreground/[0.03] px-4 py-2 text-xs font-medium transition hover:bg-foreground/[0.06]" style={{ borderColor: narrating ? chapter.accent : "oklch(0.5 0.02 60 / 0.18)", color: narrating ? chapter.accent : "oklch(0.5 0.02 60 / 0.88)" }}>
              {narrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : narrating ? <Square className="h-3.5 w-3.5" style={{ fill: chapter.accent }} /> : <Volume2 className="h-3.5 w-3.5" />}
              {narrating ? "Đang đọc — dừng" : narrLoading ? "Đang tải giọng đọc" : "Đọc bằng giọng nói"}
            </button>
          </motion.div>
          <div className="mt-8 space-y-3">
            {lesson.sections.map((section, i) => (
              <LessonAccordion key={i} section={section} index={i} isOpen={openSections.has(i)} onToggle={() => toggleSection(i)} accent={chapter.accent} />
            ))}
          </div>
          {lesson.interactive && <InteractiveRenderer block={lesson.interactive} accent={chapter.accent} />}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-8 rounded-2xl border p-5" style={{ borderColor: `${chapter.accent}33`, background: `${chapter.accent}0a` }}>
            <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: chapter.accent }}><Sparkles className="h-3.5 w-3.5" /> Điểm cần nhớ</div>
            <ul className="mt-3 space-y-2">
              {lesson.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85"><Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: chapter.accent }} /><span>{t}</span></li>
              ))}
            </ul>
          </motion.div>
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-foreground/10 pt-6">
            <button onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)} disabled={!prevLesson} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-xs text-foreground/65 transition hover:border-foreground/30 disabled:opacity-30">
              <ArrowLeft className="h-3.5 w-3.5" /> Bài trước
            </button>
            <button onClick={handleComplete} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-background transition hover:gap-3" style={{ background: chapter.accent }}>
              {isCompleted ? <><CheckCircle2 className="h-3.5 w-3.5" /> Đã xong — Bài tiếp</> : <><ListChecks className="h-3.5 w-3.5" /> Hoàn thành bài học</>}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function LessonAccordion({ section, index, isOpen, onToggle, accent }: { section: LessonSection; index: number; isOpen: boolean; onToggle: () => void; accent: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-foreground/[0.02] transition" style={{ borderColor: isOpen ? `${accent}44` : "oklch(0.5 0.02 60 / 0.18)" }}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-foreground/[0.02]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border font-serif text-sm font-bold" style={{ borderColor: `${accent}44`, color: accent, background: `${accent}10` }}>{index + 1}</span>
        <span className="flex-1 text-sm font-semibold text-foreground/90">{section.heading}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-foreground/50 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-4 pb-4 pl-14">
              <HighlightText text={section.body} keywords={section.keywords} accent={accent} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HighlightText({ text, keywords, accent }: { text: string; keywords?: string[]; accent: string }) {
  if (!keywords || keywords.length === 0) return <p className="text-sm leading-relaxed text-foreground/80">{text}</p>;
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <p className="text-sm leading-relaxed text-foreground/80">
      {parts.map((part, i) => {
        const isKeyword = keywords.some((k) => k.toLowerCase() === part.toLowerCase());
        if (isKeyword) return <mark key={i} className="rounded px-1 py-0.5 font-medium" style={{ background: `${accent}22`, color: accent, boxShadow: `inset 0 -1px 0 ${accent}44` }}>{part}</mark>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
