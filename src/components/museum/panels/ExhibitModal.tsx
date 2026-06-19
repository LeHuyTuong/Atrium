"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Lightbulb,
  Sparkles,
  Network,
  ArrowRight,
  Quote,
  Volume2,
  Square,
  Loader2,
  FlaskConical,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  exhibitById,
  phaseById,
  nextExhibit,
  prevExhibit,
  connectionsForExhibit,
} from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { audio as audioEngine } from "@/lib/audio";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { imageForExhibit, gradientForExhibit } from "@/lib/historical-images";
import { PhasePill } from "@/components/museum/layout/brand";

const Artifact3DStage = dynamic(
  () => import("@/components/museum/3d/Artifact3DStage").then((m) => m.Artifact3DStage),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-80 place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground/60" />
      </div>
    ),
  }
);

export function ExhibitModal() {
  const openExhibitId = useMuseum((s) => s.openExhibitId);
  const closeExhibit = useMuseum((s) => s.closeExhibit);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const toggleBookmark = useMuseum((s) => s.toggleBookmark);
  const setConnectionsOpen = useMuseum((s) => s.setConnectionsOpen);
  const addCompare = useMuseum((s) => s.addCompare);
  const compareIds = useMuseum((s) => s.compareIds);

  const exhibit = openExhibitId ? exhibitById(openExhibitId) : undefined;
  const open = !!exhibit;

  // Soft chime whenever a new exhibit opens (mount of ExhibitModalBody,
  // which is keyed by exhibit.id so it remounts on prev/next navigation).
  // Also plays the close thunk when the modal closes.
  const handleClose = () => {
    if (!audioEngine.muted) audioEngine.playClose();
    closeExhibit();
  };

  // keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        const n = openExhibitId ? nextExhibit(openExhibitId) : undefined;
        if (n) openExhibit(n.id);
      } else if (e.key === "ArrowLeft") {
        const p = openExhibitId ? prevExhibit(openExhibitId) : undefined;
        if (p) openExhibit(p.id);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openExhibitId, openExhibit, closeExhibit]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="!max-w-5xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-5xl">
        <DialogTitle className="sr-only">
          {exhibit ? exhibit.name : "Hiện vật"}
        </DialogTitle>
        <AnimatePresence mode="wait">
          {exhibit && (
            <ExhibitModalBody
              key={exhibit.id}
              exhibitId={exhibit.id}
              onClose={handleClose}
              onPrev={() => {
                const p = prevExhibit(exhibit.id);
                if (p) openExhibit(p.id);
              }}
              onNext={() => {
                const n = nextExhibit(exhibit.id);
                if (n) openExhibit(n.id);
              }}
              bookmarked={bookmarks.includes(exhibit.id)}
              onBookmark={() => {
                if (!audioEngine.muted) audioEngine.playBookmark();
                toggleBookmark(exhibit.id);
              }}
              inCompare={compareIds.includes(exhibit.id)}
              onCompare={() => addCompare(exhibit.id)}
              onExploreConnections={() => {
                handleClose();
                setConnectionsOpen(true);
              }}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function ExhibitModalBody({
  exhibitId,
  onClose,
  onPrev,
  onNext,
  bookmarked,
  onBookmark,
  inCompare,
  onCompare,
  onExploreConnections,
}: {
  exhibitId: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  bookmarked: boolean;
  onBookmark: () => void;
  inCompare: boolean;
  onCompare: () => void;
  onExploreConnections: () => void;
}) {
  const exhibit = exhibitById(exhibitId)!;
  const phase = phaseById(exhibit.phase)!;
  const img = imageForExhibit(exhibit.id);
  const connections = connectionsForExhibit(exhibit.id);

  const setSceneLabOpen = useMuseum((s) => s.setSceneLabOpen);
  const openSceneLab = () => {
    onClose();
    setSceneLabOpen(true);
  };

  const [narrating, setNarrating] = useState(false);
  const [narrLoading, setNarrLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Soft chime when this exhibit body mounts (i.e. when an exhibit opens or
  // the visitor navigates to a different one via prev/next).
  useEffect(() => {
    if (!audioEngine.muted) audioEngine.playOpen();
  }, []);

  // Stop narration when exhibit changes
  useEffect(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setAudio(null);
    setNarrating(false);
  }, [exhibitId, audio]);

  const toggleNarrate = async () => {
    if (narrating && audio) {
      audio.pause();
      setNarrating(false);
      return;
    }
    if (audio) {
      audio.play();
      setNarrating(true);
      return;
    }
    setNarrLoading(true);
    try {
      const text = `${exhibit.name}. ${exhibit.tagline}. ${exhibit.story} ${exhibit.whyItMatters} Bạn có biết: ${exhibit.didYouKnow}`;
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, phase: exhibit.phase }),
      });
      if (!res.ok) throw new Error("narrate failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const el = new Audio(url);
      el.onended = () => {
        setNarrating(false);
        URL.revokeObjectURL(url);
      };
      el.onerror = () => {
        setNarrating(false);
        URL.revokeObjectURL(url);
        toast.error("Không thể phát âm thanh.");
      };
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
    <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto elegant-scroll md:grid-cols-2 md:overflow-hidden">
      {/* LEFT: visual */}
      <div className="relative flex flex-col border-b border-foreground/10 md:border-b-0 md:border-r">
        {/* 3D stage */}
        <div className="relative p-3 sm:p-4">
          <Artifact3DStage
            motif={exhibit.motif}
            accent={phase.accent}
            hero={exhibit.hero}
            height={320}
          />
          {/* narrator pill */}
          <button
            onClick={toggleNarrate}
            className="absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border bg-card/85 px-3 py-1.5 text-[0.7rem] font-medium backdrop-blur-md transition hover:bg-card"
            style={{
              borderColor: narrating ? phase.accent : "rgba(255,255,255,0.15)",
              color: narrating ? phase.accent : "rgba(255,255,255,0.8)",
            }}
          >
            {narrLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : narrating ? (
              <Square className="h-3.5 w-3.5" style={{ fill: phase.accent }} />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
            {narrating ? "Đang đọc" : narrLoading ? "Đang tải" : "Người dẫn tuyến"}
          </button>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-3 sm:gap-3 sm:px-5">
          {exhibit.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-foreground/10 bg-foreground/[0.025] p-2.5 sm:p-3"
            >
              <div className="text-[0.55rem] uppercase tracking-[0.15em] text-foreground/45">
                {m.label}
              </div>
              <div className="mt-1 font-serif text-sm font-bold sm:text-base" style={{ color: phase.accent }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* historical photo */}
        {img && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div
              className="relative flex h-28 items-end overflow-hidden rounded-lg border border-foreground/10 sm:h-32"
              style={{ background: img.gradient }}
            >
              <div className="absolute inset-0 grain opacity-[0.08] mix-blend-overlay" />
              <MotifIcon motif={exhibit.motif} className="absolute right-3 top-3 h-8 w-8 text-foreground/20" strokeWidth={1} />
              <div className="relative p-3">
                <div className="text-[0.55rem] uppercase tracking-[0.18em] text-foreground/55">
                  Ảnh lịch sử · {img.year}
                </div>
                <div className="mt-0.5 text-xs font-medium text-foreground/85">
                  {img.caption}
                </div>
                <div className="mt-0.5 text-[0.6rem] italic text-foreground/45">
                  Nguồn: {img.source}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: narrative */}
      <div className="flex flex-col overflow-y-auto elegant-scroll p-5 sm:p-7 md:max-h-[92vh]">
        <div className="flex items-center justify-between">
          <PhasePill phaseId={exhibit.phase} />
          <div className="flex items-center gap-1.5">
            <IconBtn onClick={onBookmark} active={bookmarked} accent={phase.accent} title="Yêu thích">
              <Bookmark className="h-4 w-4" style={{ fill: bookmarked ? phase.accent : "transparent" }} />
            </IconBtn>
            <IconBtn onClick={onCompare} active={inCompare} accent={phase.accent} title="So sánh">
              <Network className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl text-balance"
        >
          {exhibit.name}
        </motion.h2>
        <p className="mt-2 font-serif text-base italic text-foreground/55 sm:text-lg">
          « {exhibit.tagline} »
        </p>

        {/* meta */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-y border-foreground/10 py-3 text-xs">
          <Meta label="Nhà phát minh" value={exhibit.inventor} />
          <Meta label="Nơi" value={exhibit.origin} />
          <Meta label="Năm" value={exhibit.year} />
        </div>

        {/* story */}
        <Section icon={<Quote className="h-3.5 w-3.5" />} label="Câu chuyện" accent={phase.accent}>
          {exhibit.story}
        </Section>

        <Section icon={<Sparkles className="h-3.5 w-3.5" />} label="Vì sao nó quan trọng" accent={phase.accent}>
          {exhibit.whyItMatters}
        </Section>

        {/* did you know callout */}
        <div
          className="mt-5 rounded-xl border p-4"
          style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}0d` }}
        >
          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: phase.accent }}>
            <Lightbulb className="h-3.5 w-3.5" /> Bạn có biết
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {exhibit.didYouKnow}
          </p>
        </div>

        {/* connections */}
        {connections.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/50">
              Mạch liên kết ({connections.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {connections.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem]"
                  style={{ borderColor: `${c.color}44`, color: c.color, background: `${c.color}10` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
            <button
              onClick={onExploreConnections}
              className="mt-2 inline-flex items-center gap-1 text-xs text-foreground/55 transition hover:text-foreground"
            >
              Khám phá mạng lưới <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Scene Lab entry (watt-steam only) */}
        {exhibitId === "watt-steam" && (
          <button
            onClick={openSceneLab}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition hover:gap-2.5"
            style={{
              borderColor: `${phase.accent}55`,
              color: phase.accent,
              background: `${phase.accent}10`,
            }}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Mở trong Scene Lab
            <span className="ml-1 text-[0.6rem] uppercase tracking-[0.15em] opacity-70">
              3D · Tháo rời bộ phận
            </span>
          </button>
        )}

        {/* nav footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-6">
          <button
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Trước
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground/90 px-4 py-2 text-xs font-semibold text-background transition hover:bg-foreground"
          >
            Đóng
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2 text-xs text-foreground/65 transition hover:border-foreground/30 hover:text-foreground"
          >
            Sau <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  accent,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  accent: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="grid h-9 w-9 place-items-center rounded-full border transition"
      style={{
        borderColor: active ? accent : "rgba(255,255,255,0.12)",
        background: active ? `${accent}14` : "rgba(255,255,255,0.02)",
        color: active ? accent : "rgba(255,255,255,0.7)",
      }}
    >
      {children}
    </button>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[0.55rem] uppercase tracking-[0.18em] text-foreground/40">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground/85">{value}</div>
    </div>
  );
}

function Section({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em]" style={{ color: accent }}>
        {icon} {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}
