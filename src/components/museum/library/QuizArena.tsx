"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Clock, Check, X, RotateCcw, Star, Award, Timer } from "lucide-react";
import { KNOWLEDGE_QUESTIONS, TOTAL_KNOWLEDGE_QUESTIONS } from "@/lib/knowledge-quiz";
import { useMuseum } from "@/lib/store";
import { toast } from "sonner";

export function QuizArena() {
  const setStage = useMuseum((s) => s.setStage);
  const recordKnowledgeQuiz = useMuseum((s) => s.recordKnowledgeQuiz);
  const bestScore = useMuseum((s) => s.knowledgeQuizScore);
  const [phase, setPhase] = useState<"intro" | "question" | "results">("intro");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || phase !== "question") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [started, phase]);

  const questions = useMemo(() => KNOWLEDGE_QUESTIONS, []);
  const q = questions[idx];
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;

  const start = () => { setPhase("question"); setIdx(0); setSelected(null); setAnswers([]); setElapsed(0); setStarted(true); };

  const submit = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    if (idx + 1 < questions.length) { setIdx(idx + 1); setSelected(null); }
    else {
      const correct = next.filter((a, i) => a === questions[i].answer).length;
      recordKnowledgeQuiz(correct);
      setPhase("results");
      setStarted(false);
      if (correct >= 8) toast.success(`Xuất sắc! ${correct}/${TOTAL_KNOWLEDGE_QUESTIONS} — Huy hiệu Vàng!`);
      else if (correct >= 5) toast.success(`Khá tốt! ${correct}/${TOTAL_KNOWLEDGE_QUESTIONS}`);
      else toast.message(`Cần cố gắng hơn — ${correct}/${TOTAL_KNOWLEDGE_QUESTIONS}`);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const badge = correctCount >= 8 ? "gold" : correctCount >= 5 ? "silver" : "bronze";
  const badgeColor = badge === "gold" ? "#e8b53a" : badge === "silver" ? "#c0c0c8" : "#cd7f32";
  const badgeLabel = badge === "gold" ? "Huy hiệu Vàng" : badge === "silver" ? "Huy hiệu Bạc" : "Huy hiệu Đồng";

  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-50" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setStage("library")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Thư viện</span>
            </button>
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4" style={{ color: "#e8b53a" }} /><span className="text-sm font-semibold text-foreground/85">Kiểm tra kiến thức</span></div>
            <div className="flex-1" />
            {phase === "question" && (
              <>
                <div className="flex items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-2.5 py-1.5 font-mono text-xs text-foreground/70"><Timer className="h-3 w-3" />{mm}:{ss}</div>
                <div className="text-xs text-foreground/55"><span className="font-bold text-foreground/80">{idx + 1}</span>/{TOTAL_KNOWLEDGE_QUESTIONS}</div>
              </>
            )}
            {bestScore !== null && phase === "intro" && (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-xs">
                <Award className="h-3.5 w-3.5 text-amber-300" /><span className="text-foreground/55">Best:</span><span className="font-bold text-amber-300">{bestScore}/10</span>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border" style={{ borderColor: "#e8b53a44", background: "#e8b53a12" }}><Trophy className="h-9 w-9" style={{ color: "#e8b53a" }} /></div>
                <h2 className="mt-6 font-serif text-3xl font-bold text-foreground sm:text-4xl">Kiểm tra kiến thức</h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-foreground/60">{TOTAL_KNOWLEDGE_QUESTIONS} câu trắc nghiệm về cách mạng công nghiệp, công nghiệp hóa Việt Nam, và hội nhập kinh tế quốc tế.</p>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-foreground/55">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> ~5 phút</span>
                  <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> Huy hiệu Vàng/Bạc/Đồng</span>
                </div>
                <button onClick={start} className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-background transition hover:gap-3" style={{ background: "#e8b53a" }}>Bắt đầu trắc nghiệm</button>
                {bestScore !== null && <p className="mt-4 text-xs text-foreground/45">Điểm tốt nhất của bạn: <span className="font-bold text-amber-300">{bestScore}/10</span></p>}
              </motion.div>
            )}
            {phase === "question" && q && (
              <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div className="h-full rounded-full" style={{ background: "#e8b53a" }} animate={{ width: `${(idx / TOTAL_KNOWLEDGE_QUESTIONS) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
                <div className="mb-3 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">Câu {idx + 1} / {TOTAL_KNOWLEDGE_QUESTIONS}</div>
                <h3 className="font-serif text-xl font-bold leading-snug text-foreground sm:text-2xl text-balance">{q.prompt}</h3>
                <div className="mt-6 space-y-2">
                  {q.options.map((opt, i) => {
                    const isSel = selected === i;
                    return (
                      <button key={i} onClick={() => setSelected(i)} className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition" style={{ borderColor: isSel ? "#e8b53a" : "oklch(0.5 0.02 60 / 0.18)", background: isSel ? "#e8b53a14" : "oklch(0.5 0.02 60 / 0.04)", color: isSel ? "#fff" : "oklch(0.5 0.02 60 / 0.88)" }}>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.65rem] font-bold" style={{ borderColor: isSel ? "#e8b53a" : "oklch(0.5 0.02 60 / 0.28)", color: isSel ? "#e8b53a" : "oklch(0.5 0.02 60 / 0.65)" }}>{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={submit} disabled={selected === null} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-background transition disabled:opacity-40" style={{ background: "#e8b53a" }}>{idx + 1 < TOTAL_KNOWLEDGE_QUESTIONS ? "Câu tiếp" : "Xem kết quả"}</button>
                </div>
              </motion.div>
            )}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mx-auto grid h-24 w-24 place-items-center rounded-full border-2" style={{ borderColor: badgeColor, background: `${badgeColor}1a` }}>
                  <Trophy className="h-12 w-12" style={{ color: badgeColor }} />
                </motion.div>
                <div className="mt-4 font-serif text-5xl font-bold" style={{ color: badgeColor }}>{correctCount}/{TOTAL_KNOWLEDGE_QUESTIONS}</div>
                <div className="mt-2 text-sm font-semibold" style={{ color: badgeColor }}>{badgeLabel}</div>
                <p className="mx-auto mt-3 max-w-md text-sm text-foreground/60">
                  {correctCount >= 8 ? "Xuất sắc! Bạn đã nắm vững kiến thức về công nghiệp hóa và hội nhập." : correctCount >= 5 ? "Khá tốt! Bạn hiểu cơ bản. Xem lại các bài học để vững hơn." : "Cần cố gắng hơn. Đọc lại các bài học rồi làm lại nhé."}
                </p>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-foreground/55">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {mm}:{ss}</span>
                  <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" style={{ color: badgeColor, fill: badgeColor }} /> {badgeLabel}</span>
                </div>
                <div className="mt-8 space-y-2 text-left">
                  <div className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/45">Xem lại đáp án</div>
                  {questions.map((qq, i) => {
                    const ok = answers[i] === qq.answer;
                    return (
                      <div key={qq.id} className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
                        <div className="flex items-start gap-2">
                          <span className={ok ? "text-emerald-400" : "text-rose-400"}>{ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-foreground/85">{qq.prompt}</div>
                            <div className="mt-1 text-[0.7rem] text-foreground/55">Đúng: <span style={{ color: "#e8b53a" }}>{qq.options[qq.answer]}</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-center gap-2">
                  <button onClick={start} className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2.5 text-xs text-foreground/70 transition hover:border-foreground/30"><RotateCcw className="h-3.5 w-3.5" /> Làm lại</button>
                  <button onClick={() => setStage("library")} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background">Về thư viện</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
