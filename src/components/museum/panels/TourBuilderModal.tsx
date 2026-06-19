"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Plus, X, Check, Loader2, Share2, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { EXHIBITS, phaseById, exhibitById } from "@/lib/museum-data";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { toast } from "sonner";

export function TourBuilderModal() {
  const open = useMuseum((s) => s.tourBuilderOpen);
  const setOpen = useMuseum((s) => s.setTourBuilderOpen);
  const bookmarks = useMuseum((s) => s.bookmarks);

  const [selected, setSelected] = useState<string[]>(bookmarks.slice(0, 5));
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sharedSlug, setSharedSlug] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    if (selected.length < 2) {
      toast.error("Chọn ít nhất 2 hiện vật cho tour của bạn.");
      return;
    }
    if (!title.trim()) {
      toast.error("Đặt tên cho tour.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          author,
          exhibitIds: selected,
        }),
      });
      const data = await res.json();
      if (data.tour?.slug) {
        setSharedSlug(data.tour.slug);
        toast.success("Tour đã được tạo — chia sẻ liên kết với bạn bè!");
      }
    } catch {
      toast.error("Không tạo được tour. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    if (!sharedSlug) return;
    const url = `${window.location.origin}/?tour=${sharedSlug}`;
    navigator.clipboard?.writeText(url);
    toast.success("Đã sao chép liên kết tour.");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-3xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-3xl">
        <DialogTitle className="sr-only">Tạo tour tùy chỉnh</DialogTitle>
        <div className="border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Route className="h-4 w-4" style={{ color: "#e879f9" }} /> Tạo tour của riêng bạn
          </div>
          <p className="mt-0.5 text-[0.7rem] text-foreground/50">
            Chọn các hiện vật, sắp xếp thành một hành trình, và chia sẻ liên kết.
          </p>
        </div>

        {sharedSlug ? (
          <div className="p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border" style={{ borderColor: "#e879f944", background: "#e879f912", color: "#e879f9" }}>
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-foreground">Tour đã sẵn sàng!</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Tour « {title} » có {selected.length} hiện vật. Sao chép liên kết để chia sẻ.
            </p>
            <div className="mx-auto mt-4 flex max-w-md items-center gap-2 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-3 py-2">
              <code className="flex-1 truncate text-xs text-foreground/70">/?tour={sharedSlug}</code>
              <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-[0.65rem] font-semibold text-background">
                <Copy className="h-3 w-3" /> Sao chép
              </button>
            </div>
            <button
              onClick={() => {
                setSharedSlug(null);
                setSelected([]);
                setTitle("");
                setDesc("");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-xs text-foreground/65 transition hover:border-foreground/30"
            >
              Tạo tour khác
            </button>
          </div>
        ) : (
          <div className="grid max-h-[70vh] grid-cols-1 overflow-y-auto elegant-scroll md:grid-cols-[1fr_240px]">
            {/* picker */}
            <div className="border-b border-foreground/10 p-4 md:border-b-0 md:border-r">
              <div className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/45">
                Chọn hiện vật ({selected.length})
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {EXHIBITS.map((e) => {
                  const phase = phaseById(e.phase)!;
                  const sel = selected.includes(e.id);
                  const idx = selected.indexOf(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggle(e.id)}
                      className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition"
                      style={{
                        borderColor: sel ? phase.accent : "oklch(0.5 0.02 60 / 0.12)",
                        background: sel ? `${phase.accent}12` : "transparent",
                      }}
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md" style={{ background: `${phase.accent}1a`, color: phase.accent }}>
                        <MotifIcon motif={e.motif} className="h-3.5 w-3.5" strokeWidth={1.4} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[0.75rem] font-medium text-foreground/90">{e.name}</div>
                        <div className="truncate text-[0.6rem] text-foreground/45">{e.year} · {phase.label}</div>
                      </div>
                      {sel ? (
                        <span className="grid h-5 w-5 place-items-center rounded-full text-[0.6rem] font-bold" style={{ background: phase.accent, color: "#1a0f08" }}>{idx + 1}</span>
                      ) : (
                        <Plus className="h-3.5 w-3.5 text-foreground/40" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* form + order */}
            <div className="p-4">
              <div className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/45">
                Thông tin tour
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tên tour…"
                maxLength={80}
                className="mb-2 w-full rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none"
              />
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên bạn (tùy chọn)"
                maxLength={50}
                className="mb-2 w-full rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Mô tả ngắn…"
                rows={2}
                maxLength={300}
                className="w-full resize-none rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none"
              />

              <div className="mt-3 mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-foreground/45">
                Thứ tự ({selected.length})
              </div>
              <div className="space-y-1">
                {selected.map((id, i) => {
                  const e = exhibitById(id)!;
                  const phase = phaseById(e.phase)!;
                  return (
                    <div key={id} className="flex items-center gap-2 rounded-md border border-foreground/8 bg-foreground/[0.02] px-2 py-1.5">
                      <span className="font-serif text-xs font-bold" style={{ color: phase.accent }}>{i + 1}.</span>
                      <span className="flex-1 truncate text-[0.7rem] text-foreground/75">{e.name}</span>
                      <button onClick={() => toggle(id)} className="text-foreground/40 hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                {selected.length === 0 && (
                  <div className="rounded-md border border-dashed border-foreground/12 py-4 text-center text-[0.65rem] text-foreground/40">
                    Chọn hiện vật để bắt đầu
                  </div>
                )}
              </div>

              <button
                onClick={submit}
                disabled={submitting || selected.length < 2 || !title.trim()}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-background transition disabled:opacity-40"
                style={{ background: "#e879f9" }}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Tạo & chia sẻ tour
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
