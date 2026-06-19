# Atrium — Bảo tàng Lịch sử Kỹ thuật số · Worklog

> Mỗi agent/cron PHẢI đọc file này trước khi làm việc, và append (không ghi đè) section mới bắt đầu bằng `---`.

---
Task ID: 1
Agent: main (orchestrator)
Task: Khởi tạo dự án Atrium từ scaffold trống — install 3D deps, Prisma schema, theme warm-brown, data layer, Zustand store.

Work Log:
- Phát hiện project thực tế là scaffold trống (không có museum components, download/ chỉ có README, worklog.md không tồn tại). Session prompt là spec đầy đủ.
- Cài `three`, `@react-three/fiber@9`, `@react-three/drei@10`, `@types/three` (R3F v9 tương thích React 19).
- Viết `prisma/schema.prisma`: Visit, VisitEvent, GuestbookEntry, Tour, Feedback, DailySpotlight. Chạy `bun run db:push` thành công.
- Viết `src/app/globals.css`: palette warm brown (oklch 0.16 0.012 60), museum-backdrop gradient, spotlight-floor, vignette, phase accents (orange/yellow/green/pink), teal/pink accent words, utility `.elegant-scroll`, `.grain`, `.phase-glow`, keyframes dust-drift/spotlight-pulse.
- Viết `src/app/layout.tsx`: font Playfair Display subset `vietnamese`, lang="vi", className="dark", metadata tiếng Việt, Toaster.
- Viết `src/lib/museum-data.ts`: 4 PHASES + 32 EXHIBITS (8/kỷ nguyên) + 9 CONNECTIONS + helper functions (phaseById, exhibitById, exhibitsByPhase, heroExhibits, connectionsForExhibit, next/prevExhibit). Mỗi exhibit có story/whyItMatters/didYouKnow/metrics/tags bằng tiếng Việt.
- Viết `src/lib/quiz-data.ts`: 12 câu hỏi (3/kỷ nguyên) + explanations.
- Viết `src/lib/achievements.ts`: 12 huy hiệu với tier bronze/silver/gold/platinum + check functions.
- Viết `src/lib/historical-images.ts`: 28 ảnh ký họa (7/kỷ nguyên) với caption + source tiếng Việt + gradient procedural (thay ảnh bản quyền).
- Viết `src/lib/store.ts`: Zustand store (persist) cho journey state (stage, mode, visitorId, seenExhibits, bookmarks, phasesEntered, quizzesPassed, UI panels).

Stage Summary:
- Foundation hoàn thành: DB schema pushed, theme warm-brown, fonts Vietnamese, full data layer (32 exhibits + 9 connections + 12 quiz + 12 achievements + 28 historical images), Zustand store.
- 4 hero exhibits: watt-steam, light-bulb, intel-4004, neural-net.
- Phase accents: 1.0=#e89446, 2.0=#e8b53a, 3.0=#4ade80, 4.0=#e879f9.
- Còn phải làm: Artifact3DStage (procedural 3D cho 32 motif), HeroExhibit3D (4 bespoke), toàn bộ component UI (Landing/Portal/Map/Room/Modal/Quiz/Guestbook/Connections/Search/Bookmarks/Compare/Achievements/Timeline/Exit), API routes, page.tsx wiring.

---
Task ID: 2
Agent: main (orchestrator)
Task: Build the full Atrium museum UI from scratch — all stages, panels, 3D stage, API routes, page wiring. Verify end-to-end with agent-browser + VLM.

Work Log:
- Built procedural 3D model library `ArtifactModels.tsx` (32 motifs → distinct THREE.js meshes: steam engine, loom, gear, locomotive, cotton-gin, furnace, gas-lamp, shield, bolt, assembly, dynamo, otto, marconi, edison-meter, light-bulb, network, chip, monitor, upc, www, phone, gps, brain, cloud, printer, car, smartphone, transformer, rocket, robot, neural-net).
- Built `Artifact3DStage.tsx`: Canvas + 3-tier pedestal + glowing accent ring + Float + Sparkles + ContactShadows + OrbitControls (autoRotate 0.6, drag rotate, scroll zoom) + spotlight cone + reduced-motion support.
- Built `CinematicHero.tsx`: landing hero with CameraRig lerp fly-in (-6,2.5,9)→(2.6,0.4,5), DustMotes points system (220 particles), vignette fade, settle detection.
- Built layout flow: `LandingPage` (cinematic 3D + headline with teal "đi" + pink "từ hơi nước" + 4 era cards + "Bắt đầu hành trình" CTA), `PortalEntry` (2 mode cards guided/free), `MuseumMap` (4 era cards 2×2 grid with progress rings), `PhaseRoom` (8 exhibit cards xl:grid-cols-4 + era intro + room nav prev/next), `ExitSummary` (completion ring + stats + CTAs).
- Built `ExhibitCard` (motif icon visual + name/year/inventor/tagline + tags + seen/bookmark badges), `ExhibitModal` (2-column: left 3D stage + 3 metric cards + historical photo; right phase pill + serif title + italic tagline + meta + Story/WhyItMatters/DidYouKnow + connections chips + prev/next/close nav).
- Built `VisitorHud` (sticky top: brand, room label, progress ring X/32, mode, timer, 7 tool buttons, map/exit), `Timeline` (bottom strip 4 era tabs with active indicator), `TimelineFab` (left floating: timeline/connections/map/quiz).
- Built panels: `SearchPalette` (Cmd+K, arrow-key nav, exhibit+phase results), `BookmarksPanel`, `CompareModal` (2-exhibit side-by-side), `ConnectionsWeb` (SVG graph 32 nodes × 9 threads with active-thread highlight + legend), `QuizModal` (intro→3Q→results, records pass), `Guestbook` (Prisma POST/GET, star rating, phase select, auto-approve), `Achievements` (12 badges tier bronze/silver/gold/platinum with progress bar), `AnalyticsDashboard` (6 stats + per-phase progress bars + completion ring), `TourBuilderModal` (select exhibits, POST /api/tours, shareable slug), `HistoricalTimeline` (32 exhibits sorted by year with phase bands), `DailySpotlight` (fetch /api/daily-spotlight, dismissible bottom-right card).
- Built API routes: `/api/visits` (POST/PATCH), `/api/visits/events` (POST), `/api/guestbook` (GET/POST auto-approve), `/api/tours` (GET/POST with slug), `/api/daily-spotlight` (GET, deterministic day-of-year pick), `/api/feedback` (POST).
- Wired `page.tsx`: stage router (landing/portal/map/room/exit) + all global panels mounted + keyboard shortcuts (Cmd+K search, / search, B bookmarks, T timeline, Q quiz in room) + DailySpotlight + TimelineFab.
- Fixed all 11 ESLint errors: extracted ToolButton to module scope (static-components rule), rewrote usePrefersReducedMotion with useSyncExternalStore, refactored SearchPalette to remount-on-open (no setState-in-effect), refactored PhaseRoom intro-dismiss to Set-based (no setState-in-effect), cleaned DailySpotlight effect, fixed duplicate `phasesEntered` in store reset.
- Fixed runtime: replaced missing lucide icons (`Furnace`→`Anvil`, `Timeline`→`History`), removed unused imports.

Verification (agent-browser + VLM):
- Landing: 200 OK, warm-brown dark museum aesthetic, teal/pink headline accents, 3D steam engine rendered, 4 era cards. VLM confirms "matches warm brown night aesthetic, no issues".
- Portal: 2 mode cards stack on mobile (375px), no overflow. VLM confirms responsive.
- Map: 4 era cards with progress rings + tags, "1/8 đã vào" persists across navigation.
- Room: 8 exhibit cards render with motif icons, hero badges, seen state; HUD with all 7 tools + timer.
- Exhibit Modal: 3D Watt steam engine on pedestal (rendered), narrative with Story/WhyItMatters/DidYouKnow/connections, metrics cards, historical photo. VLM: "No visible errors/blank areas".
- Connections Web: SVG graph 32 nodes in 4 rows × 9 colored curves + legend. VLM: "fully populated, no broken areas".
- Quiz: full flow intro→Q1→Q2→Q3→results "3/3", pass recorded.
- Guestbook: POST entry "Du khách ban đêm" persisted to SQLite (verified via GET /api/guestbook returns the entry, approved:true).
- Daily Spotlight: GET returns today's spotlight (Model T) with curator note.
- Exit Summary: completion ring 3% (1/32), stats row, farewell, CTAs. VLM confirms all rendered.
- All 5 API routes return 200.
- Lint: clean (0 errors).
- Console: no errors (only THREE.js deprecation warnings, harmless).

Stage Summary:
- Atrium museum fully functional end-to-end. Single route / renders the complete journey.
- 32 exhibits × procedural 3D (all motifs have bespoke THREE.js models). 4 hero exhibits (watt-steam, light-bulb, intel-4004, neural-net).
- 9 cross-era connection threads visualized as interactive SVG graph.
- Full Vietnamese UI, warm-brown dark theme (oklch 0.16 0.012 60), Playfair Display vietnamese subset, no indigo/blue.
- Prisma-backed: Guestbook (auto-approve), Tours (shareable slugs), Visits + events, Feedback, DailySpotlight (deterministic per-day).
- Zustand store persisted (seenExhibits, bookmarks, phasesEntered, quizzesPassed, mode) — progress survives reloads.
- Features: Quiz (12Q), Search (Cmd+K), Bookmarks, Compare, Connections, Analytics, Tour Builder, Historical Timeline, Achievements (12 badges), Daily Spotlight, Exit Summary, keyboard shortcuts.
- Cron job webDevReview created (job_id 216082, every 15 min, Asia/Saigon) for ongoing QA + feature proposals.
- Dev server running on port 3000, no fatal errors.

Unresolved / next-phase recommendations:
- Onboarding tooltips (first-visit hints) not yet built — recommend adding a one-time coachmark overlay.
- Tour playback (load ?tour=slug and auto-step through exhibits) — TourBuilder creates tours but the player bar is not yet implemented.
- Narrator TTS (z-ai-web-dev-sdk) for exhibit stories — not yet wired.
- Scene Lab (dedicated 3D lab for Watt steam engine with exploded view) — not yet built.
- Photo Wall (era intro overlay with historical photo grid + lightbox) — historical images exist as data but no dedicated wall view.
- Ambient audio + sound effects — not yet wired.
- Featured tours / featured achievements carousels on landing — not yet built.
- The warm-brown theme is currently single-mode (always dark). If user wants light mode, add a toggle.
- Consider regenerating real historical images via image-generation skill to replace the procedural gradient placeholders in historical-images.ts.
