"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  Loader2,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
}

const QUICK_PROMPTS = [
  "Bảo tàng có những khu vực nào?",
  "Kể về động cơ hơi nước",
  "Cách mạng 4.0 là gì?",
  "Ai nên ghé thăm bảo tàng này?",
];

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedFollowups, setSuggestedFollowups] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lastScrolledIdRef = useRef<string | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || lastScrolledIdRef.current === last.id) return;
    lastScrolledIdRef.current = last.id;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    return () => {
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  const sendQuestion = async (questionText: string) => {
    const question = questionText.trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = { id: makeId(), role: "user", content: question };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setSuggestedFollowups([]);
    setElapsed(0);
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    const startedAt = Date.now();
    elapsedTimerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        let detail = `Lỗi ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody?.error) detail = errBody.error;
        } catch {}
        throw new Error(detail);
      }

      const data = await res.json();
      const aiMsgId = makeId();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: "assistant",
        content: data.response,
        typing: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (Array.isArray(data.suggestedFollowups)) {
        setSuggestedFollowups(data.suggestedFollowups.slice(0, 4));
      }

      const full = String(data.response ?? "");
      const tokens = full.match(/\S+\s*/g) ?? [full];
      const totalTicks = Math.min(tokens.length, 60);
      const tokensPerTick = Math.max(1, Math.ceil(tokens.length / totalTicks));
      const tickMs = 18;
      let revealed = 0;
      const typeInterval = setInterval(() => {
        revealed += tokensPerTick;
        if (revealed >= tokens.length) {
          const partial = tokens.join("");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: partial, typing: false } : m,
            ),
          );
          clearInterval(typeInterval);
        } else {
          const partial = tokens.slice(0, revealed).join("");
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, content: partial } : m)),
          );
        }
      }, tickMs);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi không xác định";
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: `⚠️ ${message}` },
      ]);
      toast.error("AI không phản hồi được", { description: message });
    } finally {
      setLoading(false);
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      setElapsed(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    void sendQuestion(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setSuggestedFollowups([]);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition hover:shadow-2xl hover:shadow-primary/40"
            aria-label="Mở chat với AI"
          >
            <span
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/30"
              style={{ animationDuration: "2.5s" }}
            />
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-amber-950 shadow">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-5 right-5 z-50 flex h-[560px] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl backdrop-blur"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">
                    Atrium Guide AI
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    Hướng dẫn viên bảo tàng
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="h-8 w-8 p-0 text-muted-foreground"
                    aria-label="Xoá cuộc trò chuyện"
                    title="Xoá cuộc trò chuyện"
                  >
                    <Loader2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 p-0 text-muted-foreground"
                  aria-label="Đóng chat"
                  title="Đóng"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="scroll-area-vn flex-1 space-y-3 overflow-y-auto bg-muted/20 p-3"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Hỏi AI về bảo tàng Atrium
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Mình là hướng dẫn viên AI — hỏi mình bất cứ điều gì về
                      lịch sử kỹ thuật, hiện vật, hay các khu vực trong bảo tàng
                      nhé!
                    </p>
                  </div>
                  <div className="mt-2 w-full space-y-1.5">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleQuickPrompt(p)}
                        className="flex w-full items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-2.5 py-2 text-left text-xs font-medium transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                        <span className="flex-1">{p}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        m.role === "user"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {m.role === "user" ? (
                        <UserIcon className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {m.content}
                      {m.typing && (
                        <span
                          className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-primary"
                          aria-hidden
                        />
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl rounded-tl-sm bg-card px-3 py-2.5 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                      <span className="ml-1 text-[10px] font-medium text-muted-foreground tabular-nums">
                        Đang suy nghĩ{elapsed > 0 ? `… ${elapsed}s` : "…"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {!loading &&
                suggestedFollowups.length > 0 &&
                !messages.some((m) => m.typing) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-1.5 pt-1"
                  >
                    {suggestedFollowups.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleQuickPrompt(s)}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary transition hover:bg-primary/10"
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 border-t border-border/60 bg-card p-2.5"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendQuestion(input);
                  }
                }}
                placeholder="Hỏi về bảo tàng…"
                rows={1}
                disabled={loading}
                maxLength={1000}
                className="scroll-area-vn max-h-24 flex-1 resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-xs outline-none transition focus:border-primary/50 focus:bg-background disabled:opacity-50"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="h-9 w-9 shrink-0 rounded-xl p-0"
                aria-label="Gửi"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
