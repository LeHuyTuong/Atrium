"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Images } from "lucide-react";
import { PHASES } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { BrandMark, PhaseNumeral, ProgressRing } from "./brand";
import { FeaturedTours } from "@/components/museum/panels/FeaturedTours";

export function MuseumMap() {
  const setStage = useMuseum((s) => s.setStage);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const setPhotoWallPhase = useMuseum((s) => s.setPhotoWallPhase);
  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const phasesEntered = useMuseum((s) => s.phasesEntered);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-60" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark />
          <button
            onClick={() => setStage("portal")}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Cái Ngưỡng
          </button>
        </header>

        <main className="flex flex-1 flex-col items-center px-5 py-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-2 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              Sơ đồ bảo tàng
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-5xl text-balance">
              Chọn phòng của bạn
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60">
              Bốn kỷ nguyên công nghiệp — mỗi phòng là một chương của câu chuyện.
            </p>
          </motion.div>

          <div className="mt-10 grid w-full max-w-6xl gap-4 sm:gap-5 md:grid-cols-2">
            {PHASES.map((p, i) => {
              const phaseExhibits = 8;
              const entered = phasesEntered.includes(p.id);
              const realSeen = seenExhibits.filter((id) =>
                EXHIBIT_IDS_BY_PHASE[p.id].includes(id)
              ).length;
              const enterRoom = () => {
                enterPhase(p.id);
                setCurrentPhase(p.id);
                setStage("room");
              };
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  onClick={enterRoom}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.025] p-6 text-left transition-all hover:border-foreground/30 hover:bg-foreground/[0.05] sm:p-7"
                  style={{ ["--phase-color" as string]: p.accent }}
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
                  <div className="absolute -right-4 -top-6 font-serif text-[7rem] font-bold leading-none opacity-[0.07]" style={{ color: p.accent }}>
                    {p.index}
                  </div>

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <PhaseNumeral index={p.index} accent={p.accent} />
                        <span className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
                          {p.period}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl">
                        {p.era}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/60">
                        {p.intro}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {TAGS_BY_PHASE[p.id].map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-foreground/12 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-foreground/55"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ProgressRing value={realSeen} max={phaseExhibits} accent={p.accent} size={48} />
                  </div>

                  <div className="relative mt-5 flex items-center justify-between gap-2">
                    <span className="text-xs text-foreground/55">
                      <span className="font-semibold text-foreground/80">{realSeen}</span> / {phaseExhibits} hiện vật
                      {entered && <span className="ml-2 text-foreground/40">· đã vào</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoWallPhase(p.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs text-foreground/70 transition hover:border-foreground/35 hover:text-foreground"
                        aria-label={`Phòng ảnh kỷ nguyên ${p.label}`}
                      >
                        <Images className="h-3.5 w-3.5" /> Phòng ảnh
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          enterRoom();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all group-hover:gap-2.5"
                        style={{
                          background: `${p.accent}1a`,
                          color: p.accent,
                          border: `1px solid ${p.accent}44`,
                        }}
                      >
                        {entered ? "Tiếp tục" : "Vào phòng"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Featured community tours carousel */}
          <section className="mt-12 w-full max-w-6xl">
            <FeaturedTours />
          </section>

          <div className="mt-10 flex items-center gap-3 text-xs text-foreground/45">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Tự do đi lại giữa các phòng
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}

// exhibit id lookups (lightweight — derived from museum-data at build)
import { EXHIBITS } from "@/lib/museum-data";
import { PhaseId } from "@/lib/museum-data";

const EXHIBIT_IDS_BY_PHASE: Record<PhaseId, string[]> = EXHIBITS.reduce(
  (acc, e) => {
    (acc[e.phase] ||= []).push(e.id);
    return acc;
  },
  {} as Record<PhaseId, string[]>
);

const TAGS_BY_PHASE: Record<PhaseId, string[]> = {
  "industry-1": ["Hơi nước", "Đường sắt", "Dệt may", "Luyện kim"],
  "industry-2": ["Điện", "Băng chuyền", "Vô tuyến", "Ô tô"],
  "industry-3": ["Vi xử lý", "Internet", "PC", "Điện thoại"],
  "industry-4": ["AI", "Điện toán đám mây", "Xe tự hành", "Vũ trụ"],
};
