"use client";

import { motion } from "framer-motion";
import { Library, ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles, Flame, Zap, Cpu, Brain, Award } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { BrandMark } from "@/components/museum/layout/brand";

const PREVIEW_REVOLUTIONS = [
  { label: "1.0", title: "Hơi nước", accent: "#e89446", icon: Flame, period: "Thế kỷ XVIII" },
  { label: "2.0", title: "Điện năng", accent: "#e8b53a", icon: Zap, period: "Nửa cuối XIX" },
  { label: "3.0", title: "Điện tử", accent: "#4ade80", icon: Cpu, period: "Thập niên 1960" },
  { label: "4.0", title: "AI", accent: "#e879f9", icon: Brain, period: "2011 – nay" },
];

export function KnowledgeLibrary() {
  const setStage = useMuseum((s) => s.setStage);
  const knowledgeQuizScore = useMuseum((s) => s.knowledgeQuizScore);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-50" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />

      {/* Floating dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-amber-200/30"
            initial={{ x: `${(i * 37) % 100}%`, y: `${(i * 53) % 100}%` }}
            animate={{ y: ["0%", "-30%", "0%"], opacity: [0, 0.6, 0] }}
            transition={{ duration: 8 + (i % 5) * 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <button onClick={() => setStage("landing")} className="shrink-0">
              <BrandMark size="sm" />
            </button>
            <div className="hidden h-6 w-px bg-foreground/15 sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <Library className="h-4 w-4" style={{ color: "#e8b53a" }} />
              <span className="text-sm font-semibold text-foreground/85">Thư viện tri thức</span>
            </div>
            <div className="flex-1" />
            {knowledgeQuizScore !== null && (
              <div className="hidden items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-xs sm:flex">
                <Award className="h-3.5 w-3.5 text-amber-300" /><span className="font-semibold text-amber-300">{knowledgeQuizScore}/3</span>
              </div>
            )}
            <button onClick={() => setStage("portal")} className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Bảo tàng</span>
            </button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <div className="mb-3 flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              <Sparkles className="h-3.5 w-3.5" style={{ color: "#e8b53a" }} /> Bên trong bảo tàng
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl text-balance">
              Thư viện tri thức
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground/60 sm:text-base">
              Một không gian đọc yên tĩnh bên trong bảo tàng. Ánh sáng vàng ấm, giá sách cổ,
              và một câu chuyện duy nhất — « Khái quát về cách mạng công nghiệp ».
            </p>
          </motion.div>

          {/* Single entry card — the history room */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onClick={() => setStage("library-history")}
            className="group relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border p-6 text-left transition-all hover:-translate-y-1 sm:p-8"
            style={{ borderColor: "rgba(232,180,58,0.3)", background: "linear-gradient(135deg, rgba(232,180,58,0.06) 0%, oklch(0.16 0.012 60) 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a, transparent)" }} />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at top, rgba(232,180,58,0.1), transparent 70%)" }} />

            <div className="relative flex items-start gap-5">
              <div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border"
                style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}
              >
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
                  Chương duy nhất · Khái quát CMCN
                </div>
                <h2 className="mt-1 font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  Lịch sử cách mạng công nghiệp
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  Timeline tương tác nối 4 cuộc cách mạng, lesson cards chi tiết,
                  3 knowledge cards về vai trò CMCN, và mini quiz 3 câu.
                </p>

                {/* Preview of 4 revolutions */}
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PREVIEW_REVOLUTIONS.map((rev) => (
                    <div
                      key={rev.label}
                      className="flex items-center gap-2 rounded-lg border p-2"
                      style={{ borderColor: `${rev.accent}33`, background: `${rev.accent}08` }}
                    >
                      <div
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-md border"
                        style={{ borderColor: `${rev.accent}44`, background: `${rev.accent}14`, color: rev.accent }}
                      >
                        <rev.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif text-sm font-bold" style={{ color: rev.accent }}>{rev.label}</div>
                        <div className="truncate text-[0.6rem] text-foreground/50">{rev.title}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-foreground/55">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~10 phút</span>
                    <span>4 cuộc CMCN</span>
                    <span>3 quiz</span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all group-hover:gap-2.5"
                    style={{ background: "#e8b53a1a", color: "#e8b53a", border: "1px solid #e8b53a44" }}
                  >
                    Vào phòng đọc
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-center text-xs italic text-foreground/40"
          >
            « Bước qua cánh cửa, bạn rời bảo tàng 3D và bước vào thư viện cổ. »
          </motion.p>
        </main>
      </div>
    </div>
  );
}
