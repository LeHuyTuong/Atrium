"use client";

import { useEngineStore } from "../useEngineStore";
import { t } from "../i18n";
import { SHORTCUTS } from "../useKeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Modal overlay listing all keyboard shortcuts. Toggled by the store's
 *  showHelp flag (H key) or the keyboard button in the header. */
export function HelpOverlay({ className }: { className?: string }) {
  const show = useEngineStore((s) => s.showHelp);
  const toggle = useEngineStore((s) => s.toggleHelp);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);
  if (!show) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm",
        className,
      )}
      onClick={toggle}
      role="dialog"
      aria-modal="true"
      aria-label="Bảng phím tắt"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-stone-900 to-stone-950 shadow-2xl shadow-black/60 ring-1 ring-amber-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-amber-500/20 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
              <Keyboard className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-100">{tr("helpTitle")}</h2>
              <p className="text-[10px] text-stone-400">{tr("helpSubtitle")}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 rounded-full p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={toggle}
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {SHORTCUTS.map((sc) => (
              <div
                key={sc.action}
                className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/10 bg-stone-900/50 px-2.5 py-1.5 transition-colors hover:border-amber-500/25 hover:bg-amber-500/5"
              >
                <span className="text-xs text-stone-300">
                  {language === "en" ? sc.labelEn : sc.label}
                </span>
                <kbd className="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-md border border-amber-500/30 bg-stone-950 px-1.5 font-mono text-[10px] font-semibold text-amber-300 shadow-sm">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] text-stone-500">
            {tr("helpFooter")}
          </p>
        </div>
      </div>
    </div>
  );
}
