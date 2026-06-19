# Task 3 — Onboarding Coachmark Overlay

Agent: onboarding-builder
Task: Build first-visit onboarding coachmark overlay for the Atrium museum.

## Files touched
- `src/lib/store.ts` — added `onboardingCompleted: boolean` + `completeOnboarding()` action; included in `partialize`.
- `src/components/museum/layout/VisitorHud.tsx` — added `data-onboarding="tools"` (tool cluster) and `data-onboarding="progress"` (progress ring container).
- `src/components/museum/layout/PhaseRoom.tsx` — wrapped first exhibit card with `<div data-onboarding="first-card">`.
- `src/components/museum/layout/Timeline.tsx` — added `data-onboarding="timeline"` to bottom `<nav>`.
- `src/components/museum/layout/TimelineFab.tsx` — added `data-onboarding="fab"` to FAB container.
- `src/components/museum/panels/OnboardingOverlay.tsx` — NEW. Coachmark overlay component (7 visual states: 6 numbered steps + final completion card).
- `src/app/page.tsx` — mounted `<OnboardingOverlay />` alongside the other global panels.

## Implementation notes
- 6 numbered coachmarks (badge `1/6` … `6/6`) + 1 final centered completion card (`"Bạn đã sẵn sàng. Bắt đầu hành trình của bạn!"` with `Bắt đầu hành trình` CTA).
- Spotlight effect: 4 dark `bg-black/60` overlays surround the target rect (top/bottom/left/right strips), plus a gold `#e89446` highlight border box (with `boxShadow`) around the target.
- Card placement: below the target when there is enough space, else above; left edge clamped to viewport. Welcome & final cards are centered.
- Recomputes on `resize` and `scroll` (capture phase). Target lookup retries via `requestAnimationFrame` until the element mounts (max 30 tries).
- Hydration-safe: uses `useSyncExternalStore` to detect client mount (avoids SSR mismatch).
- Lint rule `react-hooks/set-state-in-effect`: avoided synchronous `setState` in effects — `rect`/`vp` are derived from the DOM via `useMemo` driven by a `tick` counter that is bumped only from event-listener callbacks (resize/scroll) and rAF retries.
- `"Bỏ qua"` (skip) → `completeOnboarding()` immediately; `"Tiếp"` → advance; last `"Bắt đầu hành trình"` → `completeOnboarding()`.
- Dark warm-brown card `oklch(0.205 0.014 60)`, gold `#e89446` accent border + CTA, framer-motion entrance/exit animations.

## Lint status
`bun run lint` → 0 errors. Only a pre-existing warning in `ExhibitModal.tsx` (unused eslint-disable directive — not in scope).

## Acceptance criteria check
- [x] `src/components/museum/panels/OnboardingOverlay.tsx` exists, exports `OnboardingOverlay`.
- [x] Store has `onboardingCompleted` + `completeOnboarding`.
- [x] VisitorHud / PhaseRoom / Timeline / TimelineFab have `data-onboarding` attributes.
- [x] `OnboardingOverlay` is mounted in `page.tsx`.
- [x] Lint passes (0 errors).
