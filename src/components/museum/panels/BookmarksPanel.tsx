"use client";

import { Bookmark, X, Trash2, Columns2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { exhibitById, phaseById } from "@/lib/museum-data";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

export function BookmarksPanel() {
  const open = useMuseum((s) => s.bookmarksPanelOpen);
  const setOpen = useMuseum((s) => s.setBookmarksPanelOpen);
  const bookmarks = useMuseum((s) => s.bookmarks);
  const toggleBookmark = useMuseum((s) => s.toggleBookmark);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const addCompare = useMuseum((s) => s.addCompare);
  const compareIds = useMuseum((s) => s.compareIds);

  const items = bookmarks.map((id) => exhibitById(id)).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-foreground/10 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
            <Bookmark className="h-4 w-4" style={{ fill: "#e89446", color: "#e89446" }} />
            Yêu thích của bạn
          </DialogTitle>
          <p className="text-xs text-foreground/50">
            {items.length} hiện vật đã đánh dấu · dùng để so sánh hoặc tạo tour.
          </p>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto elegant-scroll p-3">
          {items.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-foreground/25" />
              <p className="mt-3 text-sm text-foreground/50">
                Chưa có hiện vật yêu thích.
              </p>
              <p className="mt-1 text-xs text-foreground/40">
                Mở một hiện vật và nhấn dấu trang để lưu lại.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((e) => {
                if (!e) return null;
                const phase = phaseById(e.phase)!;
                const inCompare = compareIds.includes(e.id);
                return (
                  <div
                    key={e.id}
                    className="group flex items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-2.5 transition hover:border-foreground/20"
                  >
                    <button
                      onClick={() => {
                        openExhibit(e.id);
                        setOpen(false);
                      }}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border"
                        style={{ borderColor: `${phase.accent}33`, background: `${phase.accent}10`, color: phase.accent }}
                      >
                        <MotifIcon motif={e.motif} className="h-4 w-4" strokeWidth={1.4} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground/90">{e.name}</div>
                        <div className="truncate text-[0.65rem] text-foreground/45">
                          {e.inventor} · {e.year}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => addCompare(e.id)}
                      title="Thêm vào so sánh"
                      className="grid h-8 w-8 place-items-center rounded-full border transition"
                      style={{
                        borderColor: inCompare ? phase.accent : "oklch(0.5 0.02 60 / 0.18)",
                        background: inCompare ? `${phase.accent}14` : "transparent",
                        color: inCompare ? phase.accent : "oklch(0.5 0.02 60 / 0.65)",
                      }}
                    >
                      <Columns2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleBookmark(e.id)}
                      title="Xóa"
                      className="grid h-8 w-8 place-items-center rounded-full border border-foreground/12 text-foreground/50 transition hover:border-foreground/30 hover:text-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
