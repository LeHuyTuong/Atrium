# Task ID: 8 — audio-builder

## Task
Build ambient audio + sound effects system for the Atrium museum (Web Audio API, procedural, persisted mute, prefers-reduced-motion aware).

## Files
- **Created** `src/lib/audio.ts` — `AudioEngine` singleton + `audio` export.
- **Modified** `src/lib/store.ts` — added `audioMuted`, `ambientOn`, `setAudioMuted`, `setAmbientOn`; persisted via `partialize`; reset in `reset()`.
- **Created** `src/components/museum/layout/AudioToggle.tsx` — pill with mute (Volume2/VolumeX) + ambient (Music) toggles.
- **Modified** `src/components/museum/layout/VisitorHud.tsx` — mounted `<AudioToggle />` between timer and tool cluster.
- **Modified** `src/components/museum/panels/ExhibitModal.tsx` — `playOpen` on body mount, `playClose` on close (via wrapped `handleClose`), `playBookmark` on bookmark toggle. Imported as `audioEngine` to avoid shadowing local `audio` HTMLAudioElement state for narration.
- **Modified** `src/components/museum/layout/PhaseRoom.tsx` — `playNavigate` inside `goPhase`.
- **Modified** `src/components/museum/panels/QuizBox.tsx` — `playSuccess` when `correct >= 2`.

## Key implementation notes
- AudioContext lazy-created in `init()` (called from unmute click and from `setAmbient(true)` to satisfy autoplay policy). Also resumes suspended contexts.
- Ambient = 2 detuned brown-noise buffers (4s loop, playbackRate 1.0 & 1.003) → lowpass 200Hz → gain 0.04, plus 60Hz sine sub-bass at gain 0.02. All routed through `ambientGain` → `masterGain` → destination. `stopAmbient()` calls `.stop()` on oscillators/buffers and `.disconnect()` on every node.
- Effects all gated by `shouldPlayEffect()` which checks `this._muted` AND `prefers-reduced-motion`. Defensive `if (!audio.muted)` guard added at every call site as spec requires.
- Master gain ramps smoothly between 0 and 0.4 over 60ms to avoid clicks.
- Mute toggle also stops ambient + flips `ambientOn` flag in store (so the ambient button visually disables). When unmuting and ambientOn is true but nodes aren't running, `setMuted(false)` restarts them.

## Verification
- `bun run lint` → 0 errors, 0 warnings (cleaned 3 stale `eslint-disable` directives in ExhibitModal).
- agent-browser smoke test: navigated landing → portal → map → era room → opened Intel 4004 exhibit. Verified:
  - "Điều khiển âm thanh" group with 2 buttons renders in VisitorHud.
  - Initial state: muted, ambient disabled (button shows "Bật âm thanh" + disabled "Bật nhạc nền").
  - Click unmute → button becomes "Tắt âm thanh", ambient button enabled.
  - Click ambient on → button becomes "Tắt nhạc nền" (hum running).
  - Click ambient off → back to "Bật nhạc nền".
  - Click mute → "Bật âm thanh" + disabled "Bật nhạc nền" (ambient correctly stops).
  - Open exhibit → close → bookmark click all work without console errors.
- Dev log: all 200 responses, multiple `✓ Compiled`, no errors after edits.

## Acceptance criteria status
- ✅ audio.ts with AudioEngine + singleton
- ✅ Store has audioMuted/ambientOn/setters, persisted
- ✅ AudioToggle mounted in VisitorHud
- ✅ SFX fire on exhibit open/close, bookmark, phase nav, quiz success
- ✅ Ambient hum starts/stops correctly
- ✅ Mute persists across reloads (Zustand persist)
- ✅ prefers-reduced-motion disables SFX (ambient still allowed)
- ✅ Lint passes
- ✅ No console errors when toggling audio
