"use client";

import { useState } from "react";
import { useEngineStore, CustomPreset } from "../useEngineStore";
import { t } from "../i18n";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash2, Play, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

/** Preset manager: save the current engine settings as a named preset,
 *  list saved presets, load or delete them. Presets persist to localStorage. */
export function PresetPanel({ className }: { className?: string }) {
  const customPresets = useEngineStore((s) => s.customPresets);
  const savePreset = useEngineStore((s) => s.savePreset);
  const loadPreset = useEngineStore((s) => s.loadPreset);
  const deletePreset = useEngineStore((s) => s.deletePreset);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);
  const [name, setName] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    savePreset(trimmed);
    setName("");
  };

  const handleLoad = (id: string) => {
    loadPreset(id);
    setLoadedId(id);
    setTimeout(() => setLoadedId(null), 1500);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-lg border border-amber-500/15 bg-stone-900/40 p-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
        <Bookmark className="h-3 w-3" />
        {language === "vi" ? "Kịch bản đã lưu" : "Saved presets"}
      </div>

      {/* Save current state */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder={language === "vi" ? "Tên kịch bản…" : "Preset name…"}
          maxLength={24}
          className="h-8 flex-1 rounded-md border border-amber-500/25 bg-stone-950/60 px-2 text-[11px] text-stone-200 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!name.trim()}
          className="h-8 gap-1 bg-gradient-to-br from-amber-500 to-orange-600 px-2.5 text-[11px] text-stone-950 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40"
        >
          <Save className="h-3 w-3" />
          {language === "vi" ? "Lưu" : "Save"}
        </Button>
      </div>

      {/* Saved presets list */}
      {customPresets.length === 0 ? (
        <p className="py-2 text-center text-[10px] text-stone-500">
          {language === "vi"
            ? "Chưa có kịch bản nào. Điều chỉnh thông số rồi bấm Lưu."
            : "No presets yet. Adjust settings then click Save."}
        </p>
      ) : (
        <ScrollArea className="max-h-32">
          <div className="space-y-1">
            {customPresets.map((p) => (
              <PresetRow
                key={p.id}
                preset={p}
                language={language}
                onLoad={() => handleLoad(p.id)}
                onDelete={() => deletePreset(p.id)}
                justLoaded={loadedId === p.id}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function PresetRow({
  preset,
  language,
  onLoad,
  onDelete,
  justLoaded,
}: {
  preset: CustomPreset;
  language: "vi" | "en";
  onLoad: () => void;
  onDelete: () => void;
  justLoaded: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2 py-1 transition-colors",
        justLoaded
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-amber-500/10 bg-stone-950/40 hover:border-amber-500/25 hover:bg-amber-500/5",
      )}
    >
      <button
        type="button"
        onClick={onLoad}
        className="flex flex-1 items-center gap-1.5 text-left"
        title={language === "vi" ? "Nạp kịch bản" : "Load preset"}
      >
        <Play
          className={cn(
            "h-3 w-3 shrink-0",
            justLoaded ? "text-emerald-400" : "text-amber-400",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-medium text-stone-200">
            {preset.name}
          </div>
          <div className="flex gap-1.5 text-[9px] text-stone-500">
            <span>{preset.rpm} RPM</span>
            <span>·</span>
            <span>{Math.round(preset.steamPressure * 100)}%</span>
            <span>·</span>
            <span>{Math.round(preset.load * 100)}%</span>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded p-0.5 text-stone-500 transition-colors hover:bg-rose-500/15 hover:text-rose-400"
        title={language === "vi" ? "Xóa" : "Delete"}
        aria-label={language === "vi" ? "Xóa kịch bản" : "Delete preset"}
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
