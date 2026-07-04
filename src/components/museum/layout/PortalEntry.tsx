"use client";

import { motion } from "framer-motion";
import { Compass, Map as MapIcon, ArrowLeft, Route, Infinity as Inf, BookOpen, Library } from "lucide-react";
import { useMuseum, JourneyMode } from "@/lib/store";
import { BrandMark } from "./brand";
import { ThemeToggle } from "./ThemeToggle";

export function PortalEntry() {
  const setStage = useMuseum((s) => s.setStage);
  const setMode = useMuseum((s) => s.setMode);
  const mode = useMuseum((s) => s.mode);

  const choose = (m: JourneyMode) => {
    setMode(m);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 museum-backdrop" />
      <div className="pointer-events-none absolute inset-0 spotlight-floor opacity-70" />
      <div className="pointer-events-none absolute inset-0 vignette-overlay" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              onClick={() => setStage("landing")}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.35em] text-foreground/45">
              Cái Ngưỡng
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-5xl text-balance">
              Bước vào trong.
              <br />
              Bạn muốn du hành thế nào?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/60 sm:text-base">
              Bảo tàng có hai cách trải nghiệm. Chọn theo tâm trạng của bạn.
            </p>
          </motion.div>

          <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6">
            <ModeCard
              active={mode === "guided"}
              onClick={() => choose("guided")}
              icon={<Route className="h-5 w-5" />}
              kicker="Chuyến tham quan có hướng dẫn"
              title="Cùng người dẫn tuyến"
              meta="~6 PHÚT"
              description="Đi theo thứ tự bốn kỷ nguyên — từ hơi nước đến AI — với câu chuyện dẫn dắt qua từng phòng. Lý tưởng cho lần đầu."
              accent="#e89446"
            />
            <ModeCard
              active={mode === "free"}
              onClick={() => choose("free")}
              icon={<Inf className="h-5 w-5" />}
              kicker="Khám phá tự do"
              title="Tự do đi dạo"
              meta="KHÔNG GIỚI HẠN"
              description="Chọn phòng, mở hiện vật, so sánh, tìm kiếm, làm bài trắc nghiệm theo ý bạn. Không có thứ tự, không vội vàng."
              accent="#4ade80"
            />
          </div>

          {/* Library — separate area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 w-full max-w-4xl"
          >
            <button
              onClick={() => setStage("library-entrance")}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all hover:bg-foreground/[0.05]"
              style={{ borderColor: "rgba(232,180,58,0.3)", background: "rgba(232,180,58,0.04)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #e8b53a, transparent)" }} />
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border" style={{ borderColor: "#e8b53a44", background: "#e8b53a14", color: "#e8b53a" }}>
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">Khu vực mới · Bên trong bảo tàng</div>
                <div className="mt-0.5 font-serif text-lg font-bold text-foreground">Thư viện tri thức</div>
                <p className="mt-0.5 text-xs text-foreground/60">Đọc « Khái quát về cách mạng công nghiệp » — timeline 4 cuộc CMCN, lesson cards, mini quiz.</p>
              </div>
              <Library className="h-5 w-5 shrink-0 text-amber-300 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={() => setStage("map")}
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-all hover:shadow-[0_0_30px_-5px_rgba(232,148,70,0.5)]"
          >
            <Compass className="h-4 w-4" />
            Vào bảo tàng
            <MapIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </main>
      </div>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  kicker,
  title,
  meta,
  description,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  meta: string;
  description: string;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border bg-foreground/[0.025] p-6 text-left transition-all hover:bg-foreground/[0.05]"
      style={{
        borderColor: active ? accent : "oklch(0.5 0.02 60 / 0.18)",
        boxShadow: active ? `0 0 40px -12px ${accent}66` : "none",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: active ? `linear-gradient(90deg, transparent, ${accent}, transparent)` : "transparent" }} />
      <div className="flex items-center justify-between">
        <div
          className="grid h-11 w-11 place-items-center rounded-full border"
          style={{
            borderColor: `${accent}44`,
            background: `${accent}14`,
            color: accent,
          }}
        >
          {icon}
        </div>
        <span
          className="text-[0.6rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {meta}
        </span>
      </div>
      <div className="mt-5 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
        {kicker}
      </div>
      <div className="mt-1 font-serif text-2xl font-bold text-foreground">
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/60">
        {description}
      </p>
      <div
        className="mt-5 flex items-center gap-1.5 text-xs font-medium transition-opacity"
        style={{ color: accent, opacity: active ? 1 : 0.4 }}
      >
        {active ? "Đã chọn" : "Chọn chế độ này"}
      </div>
    </button>
  );
}
