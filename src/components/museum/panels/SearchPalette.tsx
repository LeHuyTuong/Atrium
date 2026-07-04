"use client";

import { useEffect, useState } from "react";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { EXHIBITS, PHASES, phaseById } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

export function SearchPalette() {
  const open = useMuseum((s) => s.searchOpen);
  const setOpen = useMuseum((s) => s.setSearchOpen);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-2xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Tìm kiếm hiện vật</DialogTitle>
        {/* Inner remounts on each open (Radix mounts Content when open) → state resets naturally */}
        {open && <SearchPaletteInner onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function SearchPaletteInner({ onClose }: { onClose: () => void }) {
  const openExhibit = useMuseum((s) => s.openExhibit);
  const enterPhase = useMuseum((s) => s.enterPhase);
  const setCurrentPhase = useMuseum((s) => s.setCurrentPhase);
  const setStage = useMuseum((s) => s.setStage);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = q.trim()
    ? EXHIBITS.filter((e) => {
        const phase = phaseById(e.phase)!;
        const hay = [e.name, e.tagline, e.inventor, e.origin, e.year, phase.era, ...e.tags]
          .join(" ")
          .toLowerCase();
        return hay.includes(q.toLowerCase());
      }).slice(0, 8)
    : EXHIBITS.slice(0, 6);

  const phaseResults = q.trim()
    ? PHASES.filter((p) => (p.era + p.name + p.period).toLowerCase().includes(q.toLowerCase()))
    : [];

  const total = results.length + phaseResults.length;

  const chooseExhibit = (id: string) => {
    openExhibit(id);
    onClose();
  };
  const choosePhase = (id: string) => {
    enterPhase(id as never);
    setCurrentPhase(id as never);
    setStage("room");
    onClose();
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
        <Search className="h-4 w-4 text-foreground/50" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(total - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (active < results.length && results[active]) {
                chooseExhibit(results[active].id);
              } else {
                const pr = phaseResults[active - results.length];
                if (pr) choosePhase(pr.id);
              }
            }
          }}
          placeholder="Tìm hiện vật, nhà phát minh, kỷ nguyên…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
        />
        <kbd className="rounded border border-foreground/15 px-1.5 py-0.5 text-[0.6rem] text-foreground/45">
          ESC
        </kbd>
      </div>

      <div className="max-h-[60vh] overflow-y-auto elegant-scroll p-2">
        {results.length === 0 && phaseResults.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-foreground/45">
            Không tìm thấy « {q} » trong bảo tàng.
          </div>
        )}

        {phaseResults.length > 0 && (
          <div className="mb-2 px-2 pt-2 text-[0.6rem] uppercase tracking-[0.2em] text-foreground/40">
            Kỷ nguyên
          </div>
        )}
        {phaseResults.map((p, i) => {
          const idx = results.length + i;
          return (
            <button
              key={p.id}
              onMouseEnter={() => setActive(idx)}
              onClick={() => choosePhase(p.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                active === idx ? "bg-foreground/10" : "hover:bg-foreground/[0.04]"
              }`}
            >
              <span className="font-serif text-lg font-bold" style={{ color: p.accent }}>{p.label}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground/90">{p.era}</div>
                <div className="text-[0.65rem] text-foreground/45">{p.period}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-foreground/40" />
            </button>
          );
        })}

        {results.length > 0 && (
          <div className="mb-2 mt-2 px-2 text-[0.6rem] uppercase tracking-[0.2em] text-foreground/40">
            Hiện vật
          </div>
        )}
        {results.map((e, i) => {
          const phase = phaseById(e.phase)!;
          return (
            <button
              key={e.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => chooseExhibit(e.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                active === i ? "bg-foreground/10" : "hover:bg-foreground/[0.04]"
              }`}
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border"
                style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}10`, color: phase.accent }}
              >
                <MotifIcon motif={e.motif} className="h-4 w-4" strokeWidth={1.4} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground/90">{e.name}</div>
                <div className="truncate text-[0.65rem] text-foreground/45">
                  {e.inventor} · {e.year} · Industry {phase.label}
                </div>
              </div>
              {e.hero && (
                <span className="rounded-full border border-foreground/15 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.12em] text-foreground/55">
                  Hero
                </span>
              )}
              {active === i && <CornerDownLeft className="h-3.5 w-3.5 text-foreground/40" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-2 text-[0.6rem] text-foreground/40">
        <span className="flex items-center gap-2">
          <kbd className="rounded border border-foreground/15 px-1 py-0.5">↑↓</kbd> di chuyển
          <kbd className="rounded border border-foreground/15 px-1 py-0.5">↵</kbd> mở
        </span>
        <span>{results.length + phaseResults.length} kết quả</span>
      </div>
    </>
  );
}
