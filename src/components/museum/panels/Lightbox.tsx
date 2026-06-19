"use client";

import { useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HISTORICAL_IMAGES,
  imagesByPhase,
  HistoricalImage,
} from "@/lib/historical-images";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { useMuseum } from "@/lib/store";

/**
 * Lightbox — hiển thị một ảnh lịch sử ở kích thước lớn kèm caption + nguồn
 * và các nút chuyển ảnh trước/sau trong cùng phase. Mở khi `lightboxImageId`
 * được set trong store.
 */
export function Lightbox() {
  const lightboxImageId = useMuseum((s) => s.lightboxImageId);
  const setLightboxImageId = useMuseum((s) => s.setLightboxImageId);
  const photoWallPhase = useMuseum((s) => s.photoWallPhase);

  const open = lightboxImageId !== null;

  // Ảnh hiện tại + danh sách ảnh cùng phase (lấy phase từ ảnh, fallback photoWallPhase).
  const current: HistoricalImage | undefined = useMemo(() => {
    if (!lightboxImageId) return undefined;
    return HISTORICAL_IMAGES.find((i) => i.id === lightboxImageId);
  }, [lightboxImageId]);

  const phaseId = current?.phase ?? photoWallPhase;
  const siblings: HistoricalImage[] = useMemo(
    () => (phaseId ? imagesByPhase(phaseId) : []),
    [phaseId]
  );

  const currentIndex = useMemo(() => {
    if (!current) return -1;
    return siblings.findIndex((i) => i.id === current.id);
  }, [current, siblings]);

  const go = useCallback(
    (delta: number) => {
      if (siblings.length === 0 || currentIndex < 0) return;
      const n = siblings.length;
      const next = (currentIndex + delta + n) % n;
      const target = siblings[next];
      if (target) setLightboxImageId(target.id);
    },
    [siblings, currentIndex, setLightboxImageId]
  );

  const goPrev = useCallback(() => go(-1), [go]);
  const goNext = useCallback(() => go(1), [go]);

  const close = useCallback(() => setLightboxImageId(null), [setLightboxImageId]);

  const handleOpenChange = (o: boolean) => {
    if (!o) close();
  };

  // Arrow-key navigation (ESC is handled by Radix Dialog automatically).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] max-w-5xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-5xl"
      >
        <DialogTitle className="sr-only">
          {current ? current.caption : "Ảnh lịch sử"}
        </DialogTitle>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Close button */}
              <button
                onClick={close}
                aria-label="Đóng ảnh"
                className="absolute right-3 top-3 z-20 rounded-full border border-foreground/20 bg-black/40 p-2 text-foreground/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Counter */}
              {currentIndex >= 0 && siblings.length > 0 && (
                <div className="absolute left-3 top-3 z-20 rounded-full border border-foreground/20 bg-black/40 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/80 backdrop-blur-sm">
                  {currentIndex + 1} / {siblings.length}
                </div>
              )}

              {/* Large image */}
              <div
                className="relative flex h-[60vh] max-h-[28rem] w-full items-center justify-center overflow-hidden"
                style={{ background: current.gradient }}
              >
                <div className="absolute inset-0 grain opacity-[0.08] mix-blend-overlay" />
                <MotifIcon
                  motif={current.motif}
                  className="h-24 w-24 text-foreground/30"
                  strokeWidth={1}
                />

                {/* Prev / Next arrows */}
                {siblings.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label="Ảnh trước"
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-foreground/20 bg-black/45 p-2.5 text-foreground/85 backdrop-blur-sm transition hover:bg-black/70 hover:text-foreground"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Ảnh sau"
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-foreground/20 bg-black/45 p-2.5 text-foreground/85 backdrop-blur-sm transition hover:bg-black/70 hover:text-foreground"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Caption block */}
              <div className="px-6 py-5 sm:px-8">
                <div className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground/55">
                  {current.year}
                </div>
                <p className="mt-2 font-serif text-lg font-medium leading-snug text-foreground sm:text-xl">
                  {current.caption}
                </p>
                <p className="mt-1.5 text-sm italic text-foreground/55">
                  Nguồn: {current.source}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
