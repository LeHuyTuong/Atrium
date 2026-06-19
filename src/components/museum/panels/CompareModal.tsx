"use client";

import { X, Columns2, ArrowLeftRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { exhibitById, phaseById } from "@/lib/museum-data";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

export function CompareModal() {
  const compareIds = useMuseum((s) => s.compareIds);
  const clearCompare = useMuseum((s) => s.clearCompare);
  const open = compareIds.length === 2;

  const [a, b] = compareIds.map((id) => exhibitById(id)).filter(Boolean);
  const phaseA = a ? phaseById(a.phase) : undefined;
  const phaseB = b ? phaseById(b.phase) : undefined;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && clearCompare()}>
      <DialogContent className="!max-w-4xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">So sánh hiện vật</DialogTitle>
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Columns2 className="h-4 w-4" /> So sánh hai hiện vật
          </div>
          <button onClick={clearCompare} className="text-xs text-foreground/50 hover:text-foreground">
            Xóa chọn
          </button>
        </div>

        {a && b && phaseA && phaseB && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
            <CompareColumn exhibit={a} phase={phaseA!} />
            <div className="flex items-center justify-center border-y border-foreground/10 md:border-x md:border-y-0">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-foreground/15 bg-foreground/[0.03]">
                <ArrowLeftRight className="h-5 w-5 text-foreground/55" />
              </div>
            </div>
            <CompareColumn exhibit={b} phase={phaseB!} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CompareColumn({ exhibit, phase }: { exhibit: NonNullable<ReturnType<typeof exhibitById>>; phase: NonNullable<ReturnType<typeof phaseById>> }) {
  const rows: { label: string; value: string }[] = [
    { label: "Năm", value: exhibit.year },
    { label: "Nhà phát minh", value: exhibit.inventor },
    { label: "Nơi", value: exhibit.origin },
    { label: "Kỷ nguyên", value: `Industry ${phase.label}` },
    ...exhibit.metrics,
  ];
  return (
    <div className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="grid h-12 w-12 place-items-center rounded-lg border"
          style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}10`, color: phase.accent }}
        >
          <MotifIcon motif={exhibit.motif} className="h-5 w-5" strokeWidth={1.4} />
        </div>
        <div>
          <div className="text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: phase.accent }}>
            Industry {phase.label}
          </div>
          <div className="font-serif text-lg font-bold text-foreground">{exhibit.name}</div>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-foreground/8 pb-1.5">
            <span className="text-[0.6rem] uppercase tracking-[0.15em] text-foreground/45">{r.label}</span>
            <span className="text-right text-sm font-medium text-foreground/85">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
        <div className="text-[0.6rem] uppercase tracking-[0.15em] text-foreground/45">Khẩu hiệu</div>
        <p className="mt-1 font-serif text-sm italic text-foreground/70">« {exhibit.tagline} »</p>
      </div>
    </div>
  );
}
