"use client";

import { PHASES, TOTAL_EXHIBITS, TOTAL_CONNECTIONS } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const text = size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "relative grid place-items-center rounded-full border border-foreground/20",
          dim
        )}
        style={{
          background:
            "conic-gradient(from 220deg, #e89446 0deg, #e8b53a 90deg, #4ade80 180deg, #e879f9 270deg, #e89446 360deg)",
        }}
      >
        <div className="absolute inset-[2px] rounded-full bg-background/85 backdrop-blur-sm" />
        <span className="relative font-serif text-[0.7rem] font-bold tracking-tight">
          A
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn("font-serif font-bold tracking-[0.15em] text-foreground", text)}>
          ATRIUM
        </span>
        <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.28em] text-foreground/55">
          Industrial History Museum
        </span>
      </div>
    </div>
  );
}

export function PhaseNumeral({ index, accent }: { index: number; accent: string }) {
  return (
    <span
      className="font-serif numeral-watermark leading-none"
      style={{ color: accent, textShadow: `0 0 24px ${accent}55` }}
      aria-hidden
    >
      {index}
      <span className="text-[0.45em] align-top opacity-70">.0</span>
    </span>
  );
}

export function PhasePill({ phaseId }: { phaseId: string }) {
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em]"
      style={{
        borderColor: `${phase.accent}55`,
        color: phase.accent,
        background: `${phase.accent}10`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: phase.accent }} />
      Industry {phase.label}
    </span>
  );
}

export function ProgressRing({ value, max, accent, size = 36 }: { value: number; max: number; accent: string; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-foreground/15" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export function StickyFooter() {
  const stage = useMuseum((s) => s.stage);
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-[0.7rem] text-foreground/50 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold tracking-[0.15em] text-foreground/70">ATRIUM</span>
          <span className="hidden sm:inline">· Bảo tàng Lịch sử Kỹ thuật số</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">4 kỷ nguyên · {TOTAL_EXHIBITS} hiện vật · {TOTAL_CONNECTIONS} mạch liên kết</span>
          <span className="h-1 w-1 rounded-full bg-foreground/30" />
          <span>Mở cửa · Luôn mở</span>
        </div>
      </div>
    </footer>
  );
}
