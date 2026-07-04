"use client";

import { useEngineStore } from "../useEngineStore";
import { PARTS, PART_MAP, PartInfo } from "../parts-data";
import { t } from "../i18n";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X, Info, Layers, Flame, Cog, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_KEYS: Record<
  PartInfo["category"],
  "categoryStructure" | "categorySteam" | "categoryMotion" | "categoryControl"
> = {
  structure: "categoryStructure",
  steam: "categorySteam",
  motion: "categoryMotion",
  control: "categoryControl",
};

const CATEGORY_ICONS: Record<PartInfo["category"], React.ReactNode> = {
  structure: <Layers className="h-3.5 w-3.5" />,
  steam: <Flame className="h-3.5 w-3.5" />,
  motion: <Cog className="h-3.5 w-3.5" />,
  control: <SlidersHorizontal className="h-3.5 w-3.5" />,
};

const CATEGORY_COLORS: Record<PartInfo["category"], string> = {
  structure: "text-stone-300",
  steam: "text-orange-400",
  motion: "text-sky-300",
  control: "text-amber-400",
};

export function InfoPanel({ className }: { className?: string }) {
  const selectedPart = useEngineStore((s) => s.selectedPart);
  const setSelectedPart = useEngineStore((s) => s.setSelectedPart);
  const setHighlightPart = useEngineStore((s) => s.setHighlightPart);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  const selected = selectedPart ? PART_MAP[selectedPart] : null;

  // Group parts by category
  const categories = Object.keys(CATEGORY_KEYS) as PartInfo["category"][];

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-amber-500/20 bg-stone-950/80 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40",
        className,
      )}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between border-b border-amber-500/15 px-4 py-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold tracking-wide text-amber-100">
            {selected ? tr("partDetail") : tr("partsTitle")}
          </h3>
        </div>
        {selected && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={() => setSelectedPart(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selected ? (
        <SelectedDetail part={selected} />
      ) : (
        <ScrollArea className="max-h-[420px]">
          <div className="space-y-4 p-3">
            {/* How it works summary */}
            <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
              <p className="text-xs leading-relaxed text-stone-300">
                <span className="font-semibold text-amber-200">Động cơ hơi nước Watt</span>{" "}
                (1776) cải tiến động cơ Newcomen bằng{" "}
                <span className="text-amber-300">bộ ngưng riêng</span> và{" "}
                <span className="text-amber-300">cơ cấu song song</span>, giúp hiệu suất
                tăng 3–4 lần — bước ngoặt của Cách mạng Công nghiệp.
              </p>
            </div>

            {categories.map((cat) => {
              const items = PARTS.filter((p) => p.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className={cn("flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider", CATEGORY_COLORS[cat])}>
                    {CATEGORY_ICONS[cat]}
                    {tr(CATEGORY_KEYS[cat])}
                  </div>
                  {items.map((p) => (
                    <PartRow
                      key={p.id}
                      part={p}
                      language={language}
                      onEnter={() => setHighlightPart(p.id)}
                      onLeave={() => setHighlightPart(null)}
                      onClick={() => setSelectedPart(p.id)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function PartRow({
  part,
  language,
  onClick,
  onEnter,
  onLeave,
}: {
  part: PartInfo;
  language: "vi" | "en";
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const name = language === "en" ? part.nameEn : part.name;
  const short = language === "en" ? part.shortEn : part.short;
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="group flex w-full items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-amber-500/25 hover:bg-amber-500/5"
    >
      <span
        className="mt-1 h-2 w-2 shrink-0 rounded-full ring-2 ring-stone-800"
        style={{ backgroundColor: part.accent }}
      />
      <span className="flex-1">
        <span className="block text-xs font-medium text-stone-100 group-hover:text-amber-100">
          {name}
        </span>
        <span className="block text-[11px] leading-snug text-stone-400">
          {short}
        </span>
      </span>
    </button>
  );
}

function SelectedDetail({ part }: { part: PartInfo }) {
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);
  return (
    <ScrollArea className="max-h-[420px]">
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full ring-2 ring-stone-700"
            style={{ backgroundColor: part.accent }}
          />
          <h4 className="text-lg font-bold text-amber-100">
            {language === "en" ? part.nameEn : part.name}
          </h4>
        </div>
        <Badge
          variant="outline"
          className={cn("gap-1 border-amber-500/30 text-[11px]", CATEGORY_COLORS[part.category])}
        >
          {CATEGORY_ICONS[part.category]}
          {tr(CATEGORY_KEYS[part.category])}
        </Badge>
        <Separator className="bg-amber-500/15" />
        <p className="text-sm leading-relaxed text-stone-300">
          {language === "en" ? part.descriptionEn : part.description}
        </p>
        <div className="rounded-lg border border-amber-500/15 bg-stone-900/50 p-3 text-[11px] text-stone-400">
          <span className="font-semibold text-amber-200">{tr("tip")}:</span>{" "}
          {tr("tipText")}
        </div>
      </div>
    </ScrollArea>
  );
}
