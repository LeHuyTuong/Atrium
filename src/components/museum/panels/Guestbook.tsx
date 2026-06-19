"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Send, Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMuseum } from "@/lib/store";
import { PHASES } from "@/lib/museum-data";
import { toast } from "sonner";

interface Entry {
  id: string;
  name: string;
  message: string;
  phase: string | null;
  rating: number | null;
  createdAt: string;
}

export function Guestbook() {
  const open = useMuseum((s) => s.guestbookOpen);
  const setOpen = useMuseum((s) => s.setGuestbookOpen);
  const visitorId = useMuseum((s) => s.visitorId);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const submit = async () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Vui lòng nhập tên và lời nhắn.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, phase: phase || null, rating: rating || null }),
      });
      const data = await res.json();
      if (data.approved) {
        toast.success("Lời nhắn của bạn đã được ghi vào sổ khách.");
        setEntries((prev) => [data.entry, ...prev]);
      } else {
        toast.message("Cảm ơn! Lời nhắn sẽ được duyệt trước khi hiển thị.");
      }
      setName("");
      setMessage("");
      setRating(0);
      setPhase("");
    } catch {
      toast.error("Không gửi được. Thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-2xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Sổ khách</DialogTitle>
        <div className="border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4" style={{ color: "#e89446" }} /> Sổ khách của bảo tàng
          </div>
          <p className="mt-0.5 text-[0.7rem] text-foreground/50">
            Để lại dấu chân của bạn trong bảo tàng ban đêm.
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto elegant-scroll p-5">
          {/* form */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn"
                maxLength={60}
                className="rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none"
              />
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground focus:border-foreground/30 focus:outline-none"
              >
                <option value="">Kỷ nguyên yêu thích…</option>
                {PHASES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-card">
                    Industry {p.label} — {p.era}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ấn tượng của bạn về bảo tàng…"
              maxLength={400}
              rows={3}
              className="mt-3 w-full resize-none rounded-lg border border-foreground/15 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/30 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    aria-label={`Đánh giá ${s} sao`}
                  >
                    <Star
                      className="h-5 w-5 transition"
                      style={{
                        fill: s <= rating ? "#e8b53a" : "transparent",
                        color: s <= rating ? "#e8b53a" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  </button>
                ))}
                <span className="ml-1.5 text-[0.65rem] text-foreground/45">{message.length}/400</span>
              </div>
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Gửi lời nhắn
              </button>
            </div>
          </div>

          {/* entries */}
          <div className="mt-5">
            <div className="mb-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/45">
              {entries.length} lời nhắn · mới nhất trước
            </div>
            {loading ? (
              <div className="py-8 text-center text-sm text-foreground/45">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-foreground/12 py-8 text-center text-sm text-foreground/45">
                Sổ khách còn trống. Hãy là người đầu tiên ký tên.
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((e, i) => {
                  const phaseObj = PHASES.find((p) => p.id === e.phase);
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground/10 font-serif text-xs font-bold text-foreground/80">
                            {e.name.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-foreground/90">{e.name}</span>
                          {phaseObj && (
                            <span className="rounded-full border px-1.5 py-0.5 text-[0.55rem] uppercase tracking-[0.1em]" style={{ borderColor: `${phaseObj.accent}44`, color: phaseObj.accent }}>
                              {phaseObj.label}
                            </span>
                          )}
                        </div>
                        {e.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: e.rating }).map((_, j) => (
                              <Star key={j} className="h-3 w-3" style={{ fill: "#e8b53a", color: "#e8b53a" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">{e.message}</p>
                      <div className="mt-1.5 text-[0.6rem] text-foreground/40">
                        {new Date(e.createdAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
