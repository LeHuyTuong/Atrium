"use client";

import { motion } from "framer-motion";
import { Check, Bookmark } from "lucide-react";
import { Exhibit, phaseById } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { MotifIcon } from "./MotifIcon";
import { imageForExhibit } from "@/lib/historical-images";

export function ExhibitCard({ exhibit, index }: { exhibit: Exhibit; index: number }) {
  const phase = phaseById(exhibit.phase)!;
  const openExhibit = useMuseum((s) => s.openExhibit);
  const seen = useMuseum((s) => s.seenExhibits.includes(exhibit.id));
  const bookmarked = useMuseum((s) => s.bookmarks.includes(exhibit.id));
  const toggleBookmark = useMuseum((s) => s.toggleBookmark);
  const img = imageForExhibit(exhibit.id);

  return (
    <motion.div
      layoutId={`exhibit-${exhibit.id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.5 }}
      onClick={() => openExhibit(exhibit.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openExhibit(exhibit.id); } }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-foreground/12 bg-foreground/[0.025] text-left transition-all hover:border-foreground/30 hover:bg-foreground/[0.05]"
      style={{ ["--phase-color" as string]: phase.accent }}
    >
      {/* top accent line */}
      <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${phase.accent}, transparent)` }} />

      {/* visual preview */}
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden sm:h-36"
        style={img?.imageUrl ? {
          backgroundImage: `url(${img.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : {
          background: `radial-gradient(ellipse 80% 70% at 50% 35%, ${phase.accent}22 0%, transparent 60%), linear-gradient(160deg, ${phase.accent}10 0%, #150c06 75%)`,
        }}
      >
        {img?.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-70" />
        )}
        <div className="absolute right-12 top-4 text-[0.55rem] uppercase tracking-[0.2em] text-foreground/50 z-10">
          {exhibit.year}
        </div>
        {!img?.imageUrl && (
          <MotifIcon
            motif={exhibit.motif}
            className="h-12 w-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
            strokeWidth={1.2}
          />
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-16 opacity-50"
          style={{ background: `linear-gradient(180deg, transparent, ${phase.accent}10)` }}
        />
        {exhibit.hero && (
          <div className="absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.18em]" style={{ borderColor: `${phase.accent}55`, color: phase.accent, background: `${phase.accent}12` }}>
            ★ Hero
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-base font-semibold leading-tight text-foreground/95">
          {exhibit.name}
        </h3>
        <div className="mt-1 text-[0.7rem] text-foreground/50">
          {exhibit.inventor} · {exhibit.origin}
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground/60">
          {exhibit.tagline}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {exhibit.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-foreground/10 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-[0.1em] text-foreground/45"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[0.7rem]">
            {bookmarked && <Bookmark className="h-3.5 w-3.5" style={{ color: phase.accent, fill: phase.accent }} />}
            {seen ? (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-emerald-300" style={{ background: "#4ade8014" }}>
                <Check className="h-3 w-3" /> Đã xem
              </span>
            ) : (
              <span className="text-foreground/40">Mở →</span>
            )}
          </span>
        </div>
      </div>

      {/* bookmark toggle (stops propagation) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(exhibit.id);
        }}
        className="absolute right-3 top-3 z-10 hidden h-7 w-7 place-items-center rounded-full border border-foreground/10 bg-background/60 backdrop-blur-sm transition hover:border-foreground/30 sm:grid"
        aria-label="Đánh dấu yêu thích"
      >
        <Bookmark className="h-3.5 w-3.5" style={{ color: bookmarked ? phase.accent : "currentColor", fill: bookmarked ? phase.accent : "transparent" }} />
      </button>
    </motion.div>
  );
}
