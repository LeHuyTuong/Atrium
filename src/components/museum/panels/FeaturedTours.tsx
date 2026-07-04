"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Route,
  ChevronLeft,
  ChevronRight,
  Users,
  Sparkles,
  Plus,
  Loader2,
} from "lucide-react";
import { exhibitById, phaseById, type Phase } from "@/lib/museum-data";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { useMuseum } from "@/lib/store";
import { toast } from "sonner";

interface Tour {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  author: string;
  exhibitIds: string; // JSON string
  featured: boolean;
  visits: number;
  createdAt: string;
}

function parseIds(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function startTour(slug: string) {
  // Full reload so the TourPlayerBar (mounted at page root) picks up ?tour=.
  window.location.href = `/?tour=${slug}`;
}

function TourCard({ tour }: { tour: Tour }) {
  const ids = parseIds(tour.exhibitIds);
  const firstExhibit = ids.length > 0 ? exhibitById(ids[0]) : undefined;
  const phase = firstExhibit ? (phaseById(firstExhibit.phase) as Phase) : undefined;
  const accent = phase?.accent ?? "#e89446";
  const phaseLabel = phase?.label ?? "—";
  const stepCount = ids.length;

  return (
    <article
      className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.025] transition-all hover:border-foreground/30 hover:bg-foreground/[0.04]"
    >
      {/* Gradient header with first exhibit's motif + phase accent */}
      <div
        className="relative flex h-24 items-center justify-between overflow-hidden px-4"
        style={{
          background: `linear-gradient(135deg, ${accent}26 0%, ${accent}0d 60%, transparent 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-8 font-serif text-[5rem] font-bold leading-none opacity-[0.08]"
          style={{ color: accent }}
        >
          {phaseLabel}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
        <div
          className="grid h-12 w-12 place-items-center rounded-xl border"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}1a`,
            color: accent,
          }}
        >
          <MotifIcon
            motif={firstExhibit?.motif ?? "gear"}
            className="h-6 w-6"
            strokeWidth={1.4}
          />
        </div>
        <span
          className="relative rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
          style={{
            borderColor: `${accent}55`,
            color: accent,
            background: `${accent}12`,
          }}
        >
          {phaseLabel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-serif text-base font-bold leading-tight text-foreground">
          {tour.title}
        </h3>

        <div className="flex items-center gap-2 text-[0.7rem] text-foreground/55">
          <span className="inline-flex items-center gap-1 truncate">
            <Users className="h-3 w-3 shrink-0" />
            <span className="truncate">{tour.author}</span>
          </span>
          <span className="text-foreground/30">·</span>
          <span className="shrink-0">{stepCount} hiện vật</span>
        </div>

        <p className="line-clamp-2 text-[0.72rem] leading-relaxed text-foreground/60">
          {tour.description ?? "Một hành trình qua các hiện vật chọn lọc."}
        </p>

        <button
          onClick={() => startTour(tour.slug)}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-background transition-all group-hover:gap-2"
          style={{ background: accent }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Bắt đầu tour
        </button>
      </div>
    </article>
  );
}

function EmptyState({ onSeed }: { onSeed: () => void }) {
  const setTourBuilderOpen = useMuseum((s) => s.setTourBuilderOpen);
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.02] px-6 py-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-foreground/55">
        <Route className="h-5 w-5" />
      </div>
      <p className="font-serif text-base font-semibold text-foreground">
        Chưa có tour nổi bật. Tạo tour đầu tiên của bạn!
      </p>
      <p className="max-w-sm text-[0.72rem] text-foreground/55">
        Tour là một hành trình qua nhiều hiện vật do cộng đồng (hoặc người dẫn
        tuyến) tuyển chọn.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={onSeed}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90"
        >
          Tải tour mẫu
        </button>
        <button
          onClick={() => setTourBuilderOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-4 py-2 text-xs font-semibold text-foreground/75 transition hover:border-foreground/40 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Tạo tour của bạn
        </button>
      </div>
    </div>
  );
}

export function FeaturedTours() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [seeding, setSeeding] = useState(false);
  const seededRef = useRef(false);

  const { data: tours, isLoading, isError } = useQuery<Tour[]>({
    queryKey: ["featured-tours"],
    queryFn: async () => {
      const res = await fetch("/api/tours?featured=1", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch-failed");
      const d = (await res.json()) as { tours: Tour[] };
      return d.tours ?? [];
    },
  });

  const seedOnce = async () => {
    if (seededRef.current || seeding) return;
    seededRef.current = true;
    setSeeding(true);
    try {
      const res = await fetch("/api/tours/seed", { method: "POST" });
      if (!res.ok) throw new Error("seed-failed");
      const d = (await res.json()) as { seeded: number };
      if (d.seeded > 0) {
        toast.success(`Đã nạp ${d.seeded} tour nổi bật.`);
      }
    } catch {
      seededRef.current = false;
    } finally {
      setSeeding(false);
      await queryClient.invalidateQueries({ queryKey: ["featured-tours"] });
    }
  };

  // Auto-seed on first mount if list is empty.
  useEffect(() => {
    if (!isLoading && !isError && tours && tours.length === 0) {
      void seedOnce();
    }
  }, [isLoading, isError, tours]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    // 280 card + 16 gap (w-4) = 296
    el.scrollBy({ left: dir * 296, behavior: "smooth" });
  };

  const list = tours ?? [];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-foreground/45">
            <Route className="h-3.5 w-3.5" />
            Tour nổi bật · Cộng đồng
          </div>
          <h3 className="mt-1.5 font-serif text-xl font-bold text-foreground sm:text-2xl">
            Hành trình được dẫn tuyến
          </h3>
        </div>

        {list.length > 1 && (
          <div className="hidden gap-1.5 md:flex">
            <button
              aria-label="Cuộn trái"
              onClick={() => scrollByCard(-1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-foreground/15 text-foreground/65 transition hover:border-foreground/35 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Cuộn phải"
              onClick={() => scrollByCard(1)}
              className="grid h-8 w-8 place-items-center rounded-full border border-foreground/15 text-foreground/65 transition hover:border-foreground/35 hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-6 py-10 text-sm text-foreground/55">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải tour nổi bật…
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          onSeed={() => {
            seededRef.current = false;
            void seedOnce();
          }}
        />
      ) : (
        <div className="group/carousel relative">
          {/* Hover arrows (desktop only) */}
          {list.length > 1 && (
            <>
              <button
                aria-label="Cuộn trái"
                onClick={() => scrollByCard(-1)}
                className="absolute left-1 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-foreground/15 bg-background/80 text-foreground/75 backdrop-blur transition hover:border-foreground/40 hover:text-foreground group-hover/carousel:grid md:grid"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Cuộn phải"
                onClick={() => scrollByCard(1)}
                className="absolute right-1 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-foreground/15 bg-background/80 text-foreground/75 backdrop-blur transition hover:border-foreground/40 hover:text-foreground group-hover/carousel:grid md:grid"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            ref={scrollRef}
            className="elegant-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "thin" }}
          >
            {list.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
            {/* Trailing spacer so last card can fully snap */}
            <div aria-hidden className="w-px shrink-0" />
          </motion.div>
        </div>
      )}

      {seeding && (
        <p className="mt-2 text-[0.65rem] text-foreground/45">
          Đang nạp tour mẫu…
        </p>
      )}
    </div>
  );
}
