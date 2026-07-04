"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Map as MapIcon } from "lucide-react";
import { PHASES } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { BrandMark, PhaseNumeral } from "./brand";
import { ThemeToggle } from "./ThemeToggle";

const CinematicHero = dynamic(() => import("@/components/museum/3d/CinematicHero").then((m) => m.CinematicHero), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-12 w-12 animate-pulse rounded-full border-2 border-foreground/20 border-t-foreground/60" />
    </div>
  ),
});

export function LandingPage() {
  const setStage = useMuseum((s) => s.setStage);
  const startVisit = useMuseum((s) => s.startVisit);
  const enterPhase = useMuseum((s) => s.enterPhase);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 3D cinematic backdrop */}
      <div className="absolute inset-0">
        <CinematicHero accent="#e89446" />
      </div>

      {/* atmospheric vignette + grain */}
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.04] mix-blend-overlay" />

      {/* content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* header */}
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark size="md" />
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 text-right text-[0.7rem] uppercase tracking-[0.2em] text-foreground/55 sm:flex sm:flex-col">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Mở cửa · Luôn mở
              </span>
              <span>4 kỷ nguyên · 32 hiện vật</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* hero */}
        <main className="relative flex flex-1 flex-col justify-center px-5 pb-6 sm:px-8 sm:pb-10">
          {/* Readability scrim — soft gradient behind hero text so headline is always legible over the 3D scene */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(105deg, var(--background) 0%, var(--background) 38%, color-mix(in oklch, var(--background) 70%, transparent) 60%, transparent 100%)",
            }}
          />
          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-foreground/65">
                <Sparkles className="h-3 w-3" />
                Trải nghiệm bảo tàng ban đêm
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="font-serif text-[2.4rem] font-bold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl"
              style={{ textShadow: "0 2px 30px var(--background)" }}
            >
              <span className="text-foreground">Làm thế nào mà chúng ta </span>
              <span style={{ color: "#00d4aa", fontStyle: "italic" }}>đi</span>
              <span className="text-foreground"> </span>
              <span style={{ color: "#ff9eb5", fontStyle: "italic" }}>từ hơi nước</span>
              <span className="text-foreground"> đến silicon?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg"
              style={{ textShadow: "0 1px 20px var(--background)" }}
            >
              Một chuyến đi xuyên qua bốn kỷ nguyên công nghiệp — từ tiếng rít
              của động cơ hơi nước Watt năm 1769, qua ánh sáng đèn Edison, qua
              con chip Intel 4004, đến những mạng nơ-ron học cách nhìn. Đi dạo
              trong bảo tàng ban đêm.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => {
                  startVisit();
                  setStage("portal");
                }}
                className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:gap-3.5 hover:shadow-[0_0_30px_-5px_rgba(232,148,70,0.5)]"
              >
                Bắt đầu hành trình
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <div className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.18em] text-foreground/45">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> ~6 phút
                </span>
                <span className="flex items-center gap-1.5">
                  <MapIcon className="h-3.5 w-3.5" /> 4 phòng
                </span>
              </div>
            </motion.div>
          </div>

          {/* era cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {PHASES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  startVisit();
                  enterPhase(p.id);
                  setStage("room");
                }}
                className="group relative overflow-hidden rounded-xl border border-foreground/12 bg-foreground/[0.025] p-4 backdrop-blur-sm text-left transition-all hover:border-foreground/25 hover:bg-foreground/[0.05]"
                style={{ ["--phase-color" as string]: p.accent }}
              >
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
                <div className="flex items-baseline justify-between">
                  <PhaseNumeral index={p.index} accent={p.accent} />
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-foreground/45">
                    {p.period}
                  </span>
                </div>
                <div className="mt-3 text-sm font-semibold leading-tight text-foreground/90">
                  {p.era}
                </div>
                <div className="mt-1 text-[0.7rem] text-foreground/45">
                  8 hiện vật
                </div>
              </button>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
