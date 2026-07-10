"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote, Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { PHASES, PhaseId } from "@/lib/museum-data";
import { imagesByPhase, HistoricalImage } from "@/lib/historical-images";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { useMuseum } from "@/lib/store";

/**
 * Photo Wall — một lớp phủ giới thiệu kỷ nguyên hiển thị lưới ảnh lịch sử
 * của một phase. Mở khi `photoWallPhase` được set trong store.
 * Click ảnh → mở Lightbox. "Bước vào phòng" → đóng + vào phase room.
 */
export function PhotoWall() {
  const photoWallPhase = useMuseum((s) => s.photoWallPhase);
  const setPhotoWallPhase = useMuseum((s) => s.setPhotoWallPhase);
  const setLightboxImageId = useMuseum((s) => s.setLightboxImageId);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const setStage = useMuseum((s) => s.setStage);

  const open = photoWallPhase !== null;
  const phaseId: PhaseId | null = photoWallPhase;
  const phase = phaseId
    ? PHASES.find((p) => p.id === phaseId) ?? null
    : null;

  const images: HistoricalImage[] = phaseId ? imagesByPhase(phaseId) : [];

  const handleOpenChange = (o: boolean) => {
    if (!o) setPhotoWallPhase(null);
  };

  const enterRoom = () => {
    if (!phaseId) return;
    setPhotoWallPhase(null);
    enterPhase(phaseId);
    setCurrentPhase(phaseId);
    setStage("room");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="elegant-scroll max-h-[92vh] max-w-6xl overflow-y-auto rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-6xl"
      >
        {/* Visually-hidden title for accessibility (Radix Dialog requires one). */}
        <DialogTitle className="sr-only">
          {phase ? `Phòng ảnh — ${phase.name}` : "Phòng ảnh"}
        </DialogTitle>

        {phase && (
          <div className="relative">
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-foreground/12 bg-card/95 px-6 py-5 backdrop-blur-md sm:px-8"
            >
              <div className="flex-1">
                <div
                  className="text-[0.65rem] uppercase tracking-[0.28em]"
                  style={{ color: phase.accent }}
                >
                  Kỷ nguyên {phase.index} trên 4 · {phase.period}
                </div>
                <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {phase.name}
                </h2>
                <p className="mt-0.5 text-sm italic text-foreground/65">
                  {phase.era}
                </p>
              </div>
              <button
                onClick={() => setPhotoWallPhase(null)}
                aria-label="Đóng phòng ảnh"
                className="shrink-0 rounded-full border border-foreground/15 p-2 text-foreground/60 transition hover:border-foreground/35 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8">
              <p className="max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                {phase.intro}
              </p>

              {/* Curator quote */}
              <div
                className="mt-5 flex gap-3 border-l-2 pl-4"
                style={{ borderColor: phase.accent }}
              >
                <Quote
                  className="mt-0.5 h-4 w-4 shrink-0 opacity-60"
                  style={{ color: phase.accent }}
                />
                <p className="font-serif text-sm italic leading-relaxed text-foreground/80 sm:text-base">
                  {phase.curatorQuote}
                </p>
              </div>

              {/* Image grid */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((img, i) => (
                  <motion.button
                    key={img.id}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.45 }}
                    onClick={() => setLightboxImageId(img.id)}
                    className={`group relative block overflow-hidden rounded-lg border border-foreground/10 text-left transition-all hover:border-foreground/30 hover:shadow-lg ${
                      img.featured ? "sm:col-span-2 xl:col-span-2" : ""
                    }`}
                    style={img.imageUrl ? { backgroundImage: `url(${img.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 140 } : { background: img.gradient, minHeight: 140 }}
                  >
                    {!img.imageUrl && <div className="absolute inset-0 grain opacity-[0.08] mix-blend-overlay" />}
                    {img.imageUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />}
                    {!img.imageUrl && (
                      <MotifIcon
                        motif={img.motif}
                        className="absolute right-3 top-3 h-7 w-7 text-foreground/25"
                        strokeWidth={1.2}
                      />
                    )}
                    {img.featured && (
                      <span className="absolute left-3 top-3 text-amber-300">
                        <Star className="h-4 w-4" fill="currentColor" />
                      </span>
                    )}

                    {/* Hover hint */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/15 group-hover:opacity-100">
                      <span className="rounded-full border border-foreground/30 bg-black/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/90 backdrop-blur-sm">
                        Xem ảnh
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-[0.55rem] uppercase tracking-[0.18em] text-foreground/60">
                        {img.year}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-xs font-medium text-foreground/95">
                        {img.caption}
                      </div>
                      <div className="mt-0.5 text-[0.6rem] italic text-foreground/45">
                        {img.source}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-8 flex flex-col items-center gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:justify-between">
                <p className="text-xs text-foreground/55">
                  Đã xem đủ? Bước vào phòng để khám phá các hiện vật.
                </p>
                <button
                  onClick={enterRoom}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-background transition-all hover:gap-3"
                  style={{ background: phase.accent }}
                >
                  Bước vào phòng
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
