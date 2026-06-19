"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X, Check } from "lucide-react";
import { useMuseum } from "@/lib/store";

interface CoachStep {
  /** CSS selector of the target element, or null for a centered card. */
  selector: string | null;
  title: string;
  body: string;
  cta: string;
  /** When true this is the final completion card (no X/Y badge). */
  isFinal?: boolean;
}

const HIGHLIGHT = "#e89446";
const PANEL_BG = "oklch(0.205 0.014 60)";
const CARD_MAX_W = 320; // max-w-xs
const CARD_EST_H = 220;
const GAP = 14; // gap between target rect and card
const PADDING = 12; // padding from viewport edges

const STEPS: CoachStep[] = [
  {
    selector: null,
    title: "Chào mừng đến Atrium",
    body: "Để tôi dẫn bạn qua các điều khiển chính.",
    cta: "Tiếp",
  },
  {
    selector: '[data-onboarding="tools"]',
    title: "Bộ công cụ",
    body: "Đây là bộ công cụ: tìm kiếm (Cmd+K), yêu thích, mạch liên kết, huy hiệu, số liệu, sổ khách, tạo tour.",
    cta: "Tiếp",
  },
  {
    selector: '[data-onboarding="progress"]',
    title: "Vòng tròn tiến độ",
    body: "Vòng tròn này theo dõi tiến độ — bạn sẽ xem 32 hiện vật trong cả bảo tàng.",
    cta: "Tiếp",
  },
  {
    selector: '[data-onboarding="first-card"]',
    title: "Hiện vật",
    body: "Mở một hiện vật để xem mô hình 3D và câu chuyện đầy đủ. Kéo để xoay mô hình.",
    cta: "Tiếp",
  },
  {
    selector: '[data-onboarding="timeline"]',
    title: "Thanh thời gian",
    body: "Thanh thời gian dưới đáy — chuyển kỷ nguyên nhanh.",
    cta: "Tiếp",
  },
  {
    selector: '[data-onboarding="fab"]',
    title: "Các nút nổi",
    body: "Các nút nổi — dòng thời gian, mạch liên kết, sơ đồ, trắc nghiệm.",
    cta: "Tiếp",
  },
  {
    selector: null,
    title: "Bạn đã sẵn sàng",
    body: "Bắt đầu hành trình của bạn!",
    cta: "Bắt đầu hành trình",
    isFinal: true,
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

// Hydration-safe client detection (avoid SSR mismatch on first render).
const subscribeNoop = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
function useHydrated() {
  return useSyncExternalStore(subscribeNoop, clientSnapshot, serverSnapshot);
}

export function OnboardingOverlay() {
  const stage = useMuseum((s) => s.stage);
  const onboardingCompleted = useMuseum((s) => s.onboardingCompleted);
  const completeOnboarding = useMuseum((s) => s.completeOnboarding);

  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  // Tick counter — bumped on resize/scroll and target-mount retry so the rect
  // (which is derived from the DOM during render) is recomputed.
  const [tick, setTick] = useState(0);

  const visible = hydrated && stage === "room" && !onboardingCompleted;
  const current = STEPS[step];
  const selector = current?.selector ?? null;

  // Subscribe to resize/scroll (event-listener callbacks may call setState).
  useEffect(() => {
    if (!visible) return;
    const bump = () => setTick((t) => t + 1);
    bump();
    window.addEventListener("resize", bump);
    window.addEventListener("scroll", bump, true);
    return () => {
      window.removeEventListener("resize", bump);
      window.removeEventListener("scroll", bump, true);
    };
  }, [visible]);

  // If the target element isn't in the DOM yet (it may mount a frame later),
  // keep retrying until it appears, then bump the tick to trigger recompute.
  useEffect(() => {
    if (!visible || !selector) return;
    const exists = document.querySelector(selector);
    if (exists) return;
    let raf = 0;
    let tries = 0;
    const tryFind = () => {
      const el = document.querySelector(selector);
      if (el) {
        setTick((t) => t + 1);
        return;
      }
      if (tries < 30) {
        tries += 1;
        raf = requestAnimationFrame(tryFind);
      }
    };
    raf = requestAnimationFrame(tryFind);
    return () => cancelAnimationFrame(raf);
  }, [selector, visible, step]);

  // Derive the target rect from the DOM (read-only) — recomputed when the
  // tick / step / selector changes.
  const rect = useMemo<Rect | null>(() => {
    if (!visible || !selector) return null;
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      bottom: r.bottom,
      right: r.right,
    };
    // tick is intentionally a dependency — it triggers recompute on resize/scroll.
  }, [visible, selector, step, tick]);

  const vp = useMemo(() => {
    if (!visible || typeof window === "undefined") return { w: 0, h: 0 };
    return { w: window.innerWidth, h: window.innerHeight };
  }, [visible, tick]);

  const dismiss = useCallback(() => completeOnboarding(), [completeOnboarding]);
  const next = useCallback(() => {
    setStep((s) => {
      if (s >= STEPS.length - 1) {
        completeOnboarding();
        return s;
      }
      return s + 1;
    });
  }, [completeOnboarding]);

  if (!visible) return null;

  // ---- Compute card placement --------------------------------------------
  let cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: CARD_MAX_W,
  };
  let cardCentered = false;

  if (!rect) {
    // Welcome / final completion card — center of viewport.
    cardCentered = true;
    cardStyle = {
      ...cardStyle,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  } else {
    const spaceBelow = vp.h - rect.bottom;
    const spaceAbove = rect.top;
    const placeBelow =
      spaceBelow >= CARD_EST_H + GAP + PADDING || spaceBelow >= spaceAbove;

    const leftClamped = Math.max(
      PADDING,
      Math.min(
        vp.w - CARD_MAX_W - PADDING,
        rect.left + rect.width / 2 - CARD_MAX_W / 2
      )
    );

    if (placeBelow) {
      cardStyle = {
        ...cardStyle,
        top: rect.bottom + GAP,
        left: leftClamped,
      };
    } else {
      cardStyle = {
        ...cardStyle,
        top: Math.max(PADDING, rect.top - CARD_EST_H - GAP),
        left: leftClamped,
      };
    }
  }

  // ---- Spotlight dim layers (4 dark overlays around target) -------------
  const spotlightPieces = rect
    ? [
        { top: 0, left: 0, width: vp.w, height: Math.max(0, rect.top) },
        {
          top: rect.bottom,
          left: 0,
          width: vp.w,
          height: Math.max(0, vp.h - rect.bottom),
        },
        {
          top: rect.top,
          left: 0,
          width: Math.max(0, rect.left),
          height: rect.height,
        },
        {
          top: rect.top,
          left: rect.right,
          width: Math.max(0, vp.w - rect.right),
          height: rect.height,
        },
      ]
    : null;

  const isFinalStep = current?.isFinal === true;
  const numberedStep = isFinalStep ? -1 : step; // 0..5 are numbered (1/6 .. 6/6)

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-root"
        className="fixed inset-0 z-[70]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label="Hướng dẫn sử dụng bảo tàng"
      >
        {/* Dim layer */}
        {!rect && <div className="absolute inset-0 bg-black/60" />}
        {rect &&
          spotlightPieces!.map((p, i) => (
            <div
              key={i}
              className="absolute bg-black/60"
              style={{
                top: p.top,
                left: p.left,
                width: p.width,
                height: p.height,
              }}
            />
          ))}

        {/* Highlight border around target */}
        {rect && (
          <motion.div
            className="pointer-events-none absolute rounded-lg"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              boxShadow: `0 0 0 2px ${HIGHLIGHT}, 0 0 22px 2px ${HIGHLIGHT}55`,
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          />
        )}

        {/* Coachmark card */}
        <motion.div
          key={`card-${step}`}
          className="absolute rounded-2xl border p-5 shadow-2xl"
          style={{
            ...cardStyle,
            background: PANEL_BG,
            borderColor: `${HIGHLIGHT}55`,
            color: "white",
          }}
          initial={{
            opacity: 0,
            y: cardCentered ? 0 : 10,
            scale: cardCentered ? 0.96 : 1,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: cardCentered ? 0 : 8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {/* Header row: badge + close */}
          <div className="mb-3 flex items-center justify-between">
            <span
              className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
              style={{ background: `${HIGHLIGHT}22`, color: HIGHLIGHT }}
            >
              {isFinalStep ? (
                <>
                  <Check className="h-3 w-3" />
                  Hoàn tất
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  {numberedStep + 1}/{STEPS.length - 1}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full p-1 text-white/55 transition hover:bg-white/10 hover:text-white"
              aria-label="Bỏ qua hướng dẫn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title + body */}
          <h3 className="font-serif text-lg font-semibold leading-tight">
            {current.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {current.body}
          </p>

          {/* Progress dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 20 : 6,
                  background:
                    i === step ? HIGHLIGHT : "oklch(0.5 0.02 60 / 0.3)",
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between gap-2">
            {!isFinalStep ? (
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full px-3 py-1.5 text-xs text-white/65 transition hover:text-white"
              >
                Bỏ qua
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:brightness-110"
              style={{ background: HIGHLIGHT, color: "#1a0f06" }}
            >
              {current.cta}
              {isFinalStep ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
