"use client";

import { useEffect, useState } from "react";
import {
  Map as MapIcon,
  LogOut,
  Search,
  Bookmark,
  Network,
  Award,
  BookOpen,
  BarChart3,
  Route,
} from "lucide-react";
import { PHASES, TOTAL_EXHIBITS } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { BrandMark, ProgressRing } from "./brand";
import { ThemeToggle } from "./ThemeToggle";

function ToolButton({
  onClick,
  icon,
  label,
  badge,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-3 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
      title={label}
      aria-label={label}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[0.55rem] font-bold text-background">
          {badge}
        </span>
      )}
    </button>
  );
}

export function VisitorHud() {
  const stage = useMuseum((s) => s.stage);
  const setStage = useMuseum((s) => s.setStage);
  const currentPhase = useMuseum((s) => s.currentPhase);
  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const mode = useMuseum((s) => s.mode);
  const startedAt = useMuseum((s) => s.startedAt);

  const setSearchOpen = useMuseum((s) => s.setSearchOpen);
  const setBookmarksPanelOpen = useMuseum((s) => s.setBookmarksPanelOpen);
  const setConnectionsOpen = useMuseum((s) => s.setConnectionsOpen);
  const setAchievementsOpen = useMuseum((s) => s.setAchievementsOpen);
  const setGuestbookOpen = useMuseum((s) => s.setGuestbookOpen);
  const setAnalyticsOpen = useMuseum((s) => s.setAnalyticsOpen);
  const setTourBuilderOpen = useMuseum((s) => s.setTourBuilderOpen);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const phase = PHASES.find((p) => p.id === currentPhase);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <header className="sticky top-0 z-30 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
        <button onClick={() => setStage("landing")} className="shrink-0">
          <BrandMark size="sm" />
        </button>

        <div className="hidden h-6 w-px bg-foreground/15 sm:block" />

        {/* room label */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-foreground/45">
            Phòng
          </span>
          {phase ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: phase.accent }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: phase.accent }} />
              Industry {phase.label}
            </span>
          ) : (
            <span className="text-sm font-semibold text-foreground/70">Sảnh</span>
          )}
        </div>

        <div className="flex-1" />

        {/* progress */}
        <div data-onboarding="progress" className="flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground/[0.03] px-2.5 py-1.5">
          <ProgressRing value={seenExhibits.length} max={TOTAL_EXHIBITS} accent="#e89446" size={22} />
          <span className="text-xs font-medium text-foreground/75">
            <span className="font-bold text-foreground">{seenExhibits.length}</span>
            <span className="text-foreground/40">/{TOTAL_EXHIBITS}</span>
          </span>
        </div>

        {/* mode + timer */}
        <div className="hidden items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-2.5 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-foreground/60 md:flex">
          {mode === "guided" ? <Route className="h-3 w-3" /> : null}
          {mode === "guided" ? "Hướng dẫn" : "Tự do"}
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-2.5 py-1.5 text-xs font-mono text-foreground/70 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {mm}:{ss}
        </div>

        {/* theme toggle */}
        <ThemeToggle compact />

        {/* tool cluster */}
        <div data-onboarding="tools" className="flex items-center gap-1.5">
          <ToolButton onClick={() => setSearchOpen(true)} icon={<Search className="h-3.5 w-3.5" />} label="Tìm" />
          <ToolButton onClick={() => setBookmarksPanelOpen(true)} icon={<Bookmark className="h-3.5 w-3.5" />} label="Yêu thích" badge={bookmarks.length} />
          <ToolButton onClick={() => setConnectionsOpen(true)} icon={<Network className="h-3.5 w-3.5" />} label="Mạch" />
          <ToolButton onClick={() => setAchievementsOpen(true)} icon={<Award className="h-3.5 w-3.5" />} label="Huy hiệu" />
          <ToolButton onClick={() => setAnalyticsOpen(true)} icon={<BarChart3 className="h-3.5 w-3.5" />} label="Số liệu" />
          <ToolButton onClick={() => setGuestbookOpen(true)} icon={<BookOpen className="h-3.5 w-3.5" />} label="Sổ khách" />
          <ToolButton onClick={() => setTourBuilderOpen(true)} icon={<Route className="h-3.5 w-3.5" />} label="Tạo tour" />
        </div>

        <div className="hidden h-6 w-px bg-foreground/15 sm:block" />

        <button
          onClick={() => setStage("map")}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-3 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
        >
          <MapIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sơ đồ</span>
        </button>
        <button
          onClick={() => setStage("exit")}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground/90 px-3 text-xs font-semibold text-background transition hover:bg-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ra về</span>
        </button>
      </div>
    </header>
  );
}
