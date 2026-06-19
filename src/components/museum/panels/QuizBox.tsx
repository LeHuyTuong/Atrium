"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Check, X, Star, RotateCcw, ArrowRight, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { questionsForPhase } from "@/lib/quiz-data";
import { phaseById } from "@/lib/museum-data";

export function QuizModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentPhase = useMuseum((s) => s.currentPhase);
  const recordQuizPass = useMuseum((s) => s.recordQuizPass);

  const questions = currentPhase ? questionsForPhase(currentPhase) : [];
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const phase = currentPhase ? phaseById(currentPhase) : null;

  const reset = () => {
    setStarted(false);
    setIdx(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  if (!phase || questions.length === 0) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="!max-w-md">
          <DialogTitle className="sr-only">Trắc nghiệm</DialogTitle>
          <div className="py-8 text-center text-sm text-foreground/50">
            Chọn một kỷ nguyên trước khi làm trắc nghiệm.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const q = questions[idx];
  const correctCount = answers.filter((a, i) => a === questions[i].answer).length;

  const submit = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    setAnswers(next);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      setDone(true);
      const correct = next.filter((a, i) => a === questions[i].answer).length;
      if (correct >= 2) recordQuizPass();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="!max-w-2xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Trắc nghiệm kỷ nguyên</DialogTitle>

        {/* header */}
        <div className="border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HelpCircle className="h-4 w-4" style={{ color: phase.accent }} />
              Kiểm tra hiểu biết · Industry {phase.label}
            </div>
            <span className="text-[0.65rem] text-foreground/45">
              {questions.length} câu
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {!started && !done && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border" style={{ borderColor: `${phase.accent}44`, background: `${phase.accent}12`, color: phase.accent }}>
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-foreground">
                  Kiểm tra hiểu biết
                </h3>
                <p className="mt-2 text-sm text-foreground/60">
                  {questions.length} câu hỏi trắc nghiệm về kỷ nguyên <span className="font-semibold" style={{ color: phase.accent }}>{phase.era}</span>.
                </p>
                <button
                  onClick={() => setStarted(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-background transition hover:gap-3"
                  style={{ background: phase.accent }}
                >
                  Bắt đầu trắc nghiệm <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* QUESTION */}
            {started && !done && q && (
              <motion.div key={`q-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.18em] text-foreground/45">
                  <span>Câu {idx + 1} / {questions.length}</span>
                  <span style={{ color: phase.accent }}>Industry {phase.label}</span>
                </div>
                {/* progress */}
                <div className="mb-5 h-1 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full transition-all" style={{ width: `${((idx) / questions.length) * 100}%`, background: phase.accent }} />
                </div>

                <h3 className="font-serif text-xl font-bold leading-snug text-foreground sm:text-2xl text-balance">
                  {q.prompt}
                </h3>

                <div className="mt-5 space-y-2">
                  {q.options.map((opt, i) => {
                    const isSel = selected === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className="flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition"
                        style={{
                          borderColor: isSel ? phase.accent : "rgba(255,255,255,0.1)",
                          background: isSel ? `${phase.accent}12` : "rgba(255,255,255,0.02)",
                          color: isSel ? "#fff" : "rgba(255,255,255,0.8)",
                        }}
                      >
                        <span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.65rem] font-bold"
                          style={{
                            borderColor: isSel ? phase.accent : "rgba(255,255,255,0.2)",
                            color: isSel ? phase.accent : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submit}
                    disabled={selected === null}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-background transition disabled:opacity-40"
                    style={{ background: phase.accent }}
                  >
                    {idx + 1 < questions.length ? "Câu tiếp" : "Xem kết quả"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {done && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border" style={{ borderColor: `${phase.accent}44`, background: `${phase.accent}12`, color: phase.accent }}>
                  <Trophy className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-serif text-3xl font-bold text-foreground">
                  {correctCount} / {questions.length}
                </h3>
                <p className="mt-1 text-sm text-foreground/60">
                  {correctCount === questions.length
                    ? "Hoàn hảo! Bạn đã hiểu sâu kỷ nguyên này."
                    : correctCount >= 2
                    ? "Khá tốt! Bạn nắm được phần lớn câu chuyện."
                    : "Còn nhiều để khám phá — hãy mở lại các hiện vật."}
                </p>

                <div className="mt-6 space-y-2 text-left">
                  {questions.map((qq, i) => {
                    const ok = answers[i] === qq.answer;
                    return (
                      <div key={qq.id} className="flex items-start gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
                        <span className={ok ? "text-emerald-400" : "text-rose-400"}>
                          {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-foreground/85">{qq.prompt}</div>
                          <div className="mt-1 text-[0.7rem] text-foreground/55">
                            Đáp án đúng: <span style={{ color: phase.accent }}>{qq.options[qq.answer]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-xs text-foreground/70 transition hover:border-foreground/30"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Làm lại
                  </button>
                  <button
                    onClick={close}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
                  >
                    Tiếp tục tham quan
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
