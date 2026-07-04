"use client";

import { create } from "zustand";

export type ViewPreset = "hero" | "side" | "top" | "cylinder" | "flywheel";
export type LabelMode = "off" | "compact" | "full";
export type Scenario = "startup" | "normal" | "full" | "overload";
export type Quality = "low" | "high";
export type TimeOfDay = "day" | "dusk" | "night";
export type Language = "vi" | "en";

/** A single sample in the rolling metrics history buffer. */
export interface MetricSample {
  t: number; // elapsed seconds
  rpm: number;
  power: number;
  pressure: number;
  throttle: number;
}

export interface ScenarioConfig {
  id: Scenario;
  name: string;
  rpm: number;
  steamPressure: number;
  throttle: number;
  governor: boolean;
  description: string;
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "startup",
    name: "Khởi động",
    rpm: 8,
    steamPressure: 0.35,
    throttle: 0.5,
    governor: false,
    description: "Lò hơi vừa đạt áp suất, mở van từ từ để quay máy.",
  },
  {
    id: "normal",
    name: "Vận hành chuẩn",
    rpm: 24,
    steamPressure: 0.7,
    throttle: 0.8,
    governor: true,
    description: "Chế độ làm việc bình thường, bộ điều tốc giữ đều tốc độ.",
  },
  {
    id: "full",
    name: "Tối đa",
    rpm: 60,
    steamPressure: 0.95,
    throttle: 1.0,
    governor: true,
    description: "Khởi mở van hết cỡ, hơi áp suất cao đẩy máy chạy nhanh nhất.",
  },
  {
    id: "overload",
    name: "Quá tải",
    rpm: 40,
    steamPressure: 0.85,
    throttle: 0.9,
    governor: true,
    description: "Tải nặng đột ngột — bộ điều tốc phản ứng mở thêm van.",
  },
];

/** Tour steps for the guided walkthrough. Each step flies the camera to a
 *  preset view, highlights a part, and shows narration text. */
export interface TourStep {
  id: string;
  title: string;
  titleEn: string;
  narration: string;
  narrationEn: string;
  view: ViewPreset;
  partId: string;
  duration: number; // seconds to dwell
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "intro",
    title: "Động cơ hơi nước Watt",
    titleEn: "The Watt Steam Engine",
    narration:
      "James Watt cải tiến động cơ Newcomen năm 1776, tăng hiệu suất 3–4 lần nhờ bộ ngưng riêng — bước ngoặt của Cách mạng Công nghiệp.",
    narrationEn:
      "James Watt improved the Newcomen engine in 1776, increasing efficiency 3–4× with a separate condenser — a turning point of the Industrial Revolution.",
    view: "hero",
    partId: "beam",
    duration: 6,
  },
  {
    id: "boiler",
    title: "Lò hơi",
    titleEn: "Boiler",
    narration:
      "Than đốt trong buồng lửa sinh hơi nước áp suất cao. Hơi đi qua nắp hơi và ống đồng đến hộp hơi của xy-lanh.",
    narrationEn:
      "Coal burned in the firebox produces high-pressure steam. Steam travels through the dome and copper pipe to the cylinder's steam chest.",
    view: "hero",
    partId: "boiler",
    duration: 6,
  },
  {
    id: "cylinder",
    title: "Xy-lanh & pít-tông",
    titleEn: "Cylinder & Piston",
    narration:
      "Hơi đẩy pít-tông đi lên trong xy-lanh. Pít-tông nối với đầu trái của đòn cân qua thanh pít-tông.",
    narrationEn:
      "Steam pushes the piston upward in the cylinder. The piston connects to the left end of the beam via the piston rod.",
    view: "cylinder",
    partId: "cylinder",
    duration: 6,
  },
  {
    id: "beam",
    title: "Đòn cân (dầm đung đưa)",
    titleEn: "Beam (rocking lever)",
    narration:
      "Dầm gang lớn đung đưa quanh chốt tựa ở giữa — biểu tượng của động cơ Watt. Nó biến tịnh tiến của pít-tông thành dao động.",
    narrationEn:
      "The large cast-iron beam rocks on a central pivot — the symbol of Watt's engine. It converts the piston's linear motion into oscillation.",
    view: "side",
    partId: "beam",
    duration: 6,
  },
  {
    id: "parallel",
    title: "Cơ cấu song song Watt",
    titleEn: "Watt's Parallel Motion",
    narration:
      "Bộ khâu 3 thanh khiến đầu pít-tông di chuyển theo đường gần thẳng dù đầu đòn cân đi theo vòng cung. Watt gọi đây là phát minh mình tự hào nhất.",
    narrationEn:
      "A 3-bar linkage makes the piston rod travel in a nearly straight line even though the beam end arcs. Watt called this his proudest invention.",
    view: "cylinder",
    partId: "parallel-motion",
    duration: 6,
  },
  {
    id: "flywheel",
    title: "Bánh đà & trục khuỷu",
    titleEn: "Flywheel & Crank",
    narration:
      "Thanh truyền nối đầu phải đòn cân với chốt khuỷu trên bánh đà. Bánh đà lớn tích lũy động năng, giữ trục quay đều qua các kỳ chết.",
    narrationEn:
      "The connecting rod links the beam's right end to the crank pin on the flywheel. The large wheel stores momentum, keeping the shaft steady through dead centres.",
    view: "flywheel",
    partId: "flywheel",
    duration: 6,
  },
  {
    id: "condenser",
    title: "Bộ ngưng riêng Watt",
    titleEn: "Watt's Separate Condenser",
    narration:
      "Phát minh then chốt: hơi xả được ngưng trong buồng riêng bằng phun nước lạnh, tạo chân không kéo pít-tông xuống — tránh phải làm nóng/làm lạnh xy-lanh mỗi nhịp.",
    narrationEn:
      "The key invention: exhaust steam is condensed in a separate chamber by cold-water spray, creating a vacuum that pulls the piston down — avoiding heating/cooling the cylinder each cycle.",
    view: "hero",
    partId: "condenser",
    duration: 7,
  },
  {
    id: "governor",
    title: "Bộ điều tốc ly tâm",
    titleEn: "Centrifugal Governor",
    narration:
      "Hai quả cầu quay theo tốc độ động cơ; khi quay nhanh, lực ly tâm làm quả cầu văng ra, kéo sleeve lên và đóng bớt van hơi — tự động giữ tốc độ không đổi.",
    narrationEn:
      "Two balls spin at engine speed; when spinning faster, centrifugal force flings them outward, raising the sleeve and closing the steam valve — automatically holding speed constant.",
    view: "hero",
    partId: "governor",
    duration: 7,
  },
];

/** Keys persisted to localStorage. */
const PERSIST_KEYS = [
  "rpm",
  "steamPressure",
  "throttle",
  "load",
  "governorEnabled",
  "scenario",
  "showLabels",
  "showSteam",
  "showFire",
  "crossSection",
  "showCycleDiagram",
  "showMetrics",
  "audioOn",
  "audioVolume",
  "timeOfDay",
  "language",
  "quality",
] as const;

function loadPersisted(): Partial<EngineStore> {
  if (typeof window === "undefined") return {};
  const out: Record<string, unknown> = {};
  try {
    const raw = window.localStorage.getItem("watt-engine-state");
    if (raw) {
      const data = JSON.parse(raw);
      for (const k of PERSIST_KEYS) {
        if (k in data) out[k] = data[k];
      }
    }
  } catch {
    /* ignore */
  }
  // Load custom presets separately
  try {
    const rawPresets = window.localStorage.getItem("watt-engine-presets");
    if (rawPresets) {
      out.customPresets = JSON.parse(rawPresets);
    }
  } catch {
    /* ignore */
  }
  return out;
}

function persist(state: EngineStore) {
  if (typeof window === "undefined") return;
  try {
    const out: Record<string, unknown> = {};
    for (const k of PERSIST_KEYS) {
      // @ts-expect-error dynamic key access for persistence
      out[k] = state[k];
    }
    window.localStorage.setItem("watt-engine-state", JSON.stringify(out));
  } catch {
    /* ignore quota errors */
  }
}

export interface EngineStore {
  // Simulation
  running: boolean;
  rpm: number;
  actualRpm: number;
  steamPressure: number;
  throttle: number;
  elapsed: number;
  totalRevolutions: number;
  powerOutput: number;
  load: number;
  governorEnabled: boolean;
  governorSleeve: number;
  scenario: Scenario;
  boilerTemp: number;
  governorIntegral: number; // PI controller integral accumulator

  // Visualisation
  showLabels: LabelMode;
  showSteam: boolean;
  showFire: boolean;
  crossSection: boolean;
  exploded: boolean;
  explodedAmount: number;
  highlightPart: string | null;
  selectedPart: string | null;
  viewPreset: ViewPreset;
  quality: Quality;
  showCycleDiagram: boolean;
  audioOn: boolean;
  audioVolume: number; // 0..1 master volume
  timeOfDay: TimeOfDay;
  showHelp: boolean;
  showMetrics: boolean; // performance metrics graph panel
  showFps: boolean; // FPS counter overlay
  autoQuality: boolean; // auto-downgrade quality when FPS drops
  language: Language;

  // Tour
  tourActive: boolean;
  tourStep: number; // current step index

  // Derived ticks for HUD consumers
  pistonPos: number;
  valveOpen: number;
  cyclePhase: number;
  cylinderPressure: number;
  cylinderVolume: number;
  workPerRev: number; // computed work per revolution (from P-V area)
  metrics: MetricSample[]; // rolling history buffer (last ~60s)

  // Custom user presets (saved to localStorage)
  customPresets: CustomPreset[];

  // Actions
  toggle: () => void;
  setRpm: (v: number) => void;
  setSteamPressure: (v: number) => void;
  setThrottle: (v: number) => void;
  setLoad: (v: number) => void;
  setGovernorEnabled: (v: boolean) => void;
  setScenario: (s: Scenario) => void;
  setShowLabels: (m: LabelMode) => void;
  toggleSteam: () => void;
  toggleFire: () => void;
  toggleCrossSection: () => void;
  toggleExploded: () => void;
  toggleGovernor: () => void;
  toggleAudio: () => void;
  setAudioVolume: (v: number) => void;
  toggleCycleDiagram: () => void;
  toggleTimeOfDay: () => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  toggleHelp: () => void;
  toggleMetrics: () => void;
  toggleFps: () => void;
  toggleAutoQuality: () => void;
  setLanguage: (l: Language) => void;
  toggleLanguage: () => void;
  setQuality: (q: Quality) => void;
  setHighlightPart: (p: string | null) => void;
  setSelectedPart: (p: string | null) => void;
  setViewPreset: (v: ViewPreset) => void;
  startTour: () => void;
  stopTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  setTourStep: (i: number) => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
  tick: (dt: number) => void;
  reset: () => void;
}

/** A user-saved custom preset capturing the current engine settings. */
export interface CustomPreset {
  id: string;
  name: string;
  rpm: number;
  steamPressure: number;
  throttle: number;
  load: number;
  governorEnabled: boolean;
  timeOfDay: TimeOfDay;
  createdAt: number;
}

const initialState = {
  running: true,
  rpm: 24,
  actualRpm: 0,
  steamPressure: 0.7,
  throttle: 0.8,
  elapsed: 0,
  totalRevolutions: 0,
  powerOutput: 0,
  load: 0.3,
  governorEnabled: true,
  governorSleeve: 0,
  scenario: "normal" as Scenario,
  boilerTemp: 0.7,
  governorIntegral: 0,

  showLabels: "compact" as LabelMode,
  showSteam: true,
  showFire: true,
  crossSection: false,
  exploded: false,
  explodedAmount: 0,
  highlightPart: null as string | null,
  selectedPart: null as string | null,
  viewPreset: "hero" as ViewPreset,
  quality: "high" as Quality,
  showCycleDiagram: false,
  audioOn: false,
  audioVolume: 0.6,
  timeOfDay: "day" as TimeOfDay,
  showHelp: false,
  showMetrics: false,
  showFps: false,
  autoQuality: false,
  language: "vi" as Language,

  tourActive: false,
  tourStep: 0,

  pistonPos: 0,
  valveOpen: 0,
  cyclePhase: 0,
  cylinderPressure: 0,
  cylinderVolume: 0.5,
  workPerRev: 0,
  metrics: [] as MetricSample[],
  customPresets: [] as CustomPreset[],
};

export const useEngineStore = create<EngineStore>((set, get) => ({
  ...initialState,
  ...loadPersisted(),

  toggle: () => set((s) => ({ running: !s.running })),
  setRpm: (v) => {
    set({ rpm: Math.max(0, Math.min(80, v)) });
    persist(get());
  },
  setSteamPressure: (v) => {
    set({ steamPressure: Math.max(0, Math.min(1, v)) });
    persist(get());
  },
  setThrottle: (v) => {
    set({ throttle: Math.max(0, Math.min(1, v)) });
    persist(get());
  },
  setLoad: (v) => {
    set({ load: Math.max(0, Math.min(1, v)) });
    persist(get());
  },
  setGovernorEnabled: (v) => {
    set({ governorEnabled: v, governorIntegral: 0 });
    persist(get());
  },
  setScenario: (sid) => {
    const cfg = SCENARIOS.find((s) => s.id === sid);
    if (!cfg) return;
    set({
      scenario: sid,
      rpm: cfg.rpm,
      steamPressure: cfg.steamPressure,
      throttle: cfg.throttle,
      governorEnabled: cfg.governor,
      governorIntegral: 0,
    });
    persist(get());
  },
  setShowLabels: (m) => {
    set({ showLabels: m });
    persist(get());
  },
  toggleSteam: () => {
    set((s) => ({ showSteam: !s.showSteam }));
    persist(get());
  },
  toggleFire: () => {
    set((s) => ({ showFire: !s.showFire }));
    persist(get());
  },
  toggleCrossSection: () => set((s) => ({ crossSection: !s.crossSection })),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),
  toggleGovernor: () => {
    set((s) => ({ governorEnabled: !s.governorEnabled, governorIntegral: 0 }));
    persist(get());
  },
  toggleAudio: () => {
    set((s) => ({ audioOn: !s.audioOn }));
    persist(get());
  },
  setAudioVolume: (v) => {
    set({ audioVolume: Math.max(0, Math.min(1, v)) });
    persist(get());
  },
  toggleCycleDiagram: () => {
    set((s) => ({ showCycleDiagram: !s.showCycleDiagram }));
    persist(get());
  },
  toggleTimeOfDay: () => {
    set((s) => ({
      timeOfDay:
        s.timeOfDay === "day" ? "dusk" : s.timeOfDay === "dusk" ? "night" : "day",
    }));
    persist(get());
  },
  setTimeOfDay: (t) => {
    set({ timeOfDay: t });
    persist(get());
  },
  toggleHelp: () => set((s) => ({ showHelp: !s.showHelp })),
  toggleMetrics: () => {
    set((s) => ({ showMetrics: !s.showMetrics }));
    persist(get());
  },
  toggleFps: () => set((s) => ({ showFps: !s.showFps })),
  toggleAutoQuality: () => set((s) => ({ autoQuality: !s.autoQuality })),
  setLanguage: (l) => {
    set({ language: l });
    persist(get());
  },
  toggleLanguage: () => {
    set((s) => ({ language: s.language === "vi" ? "en" : "vi" }));
    persist(get());
  },
  setQuality: (q) => set({ quality: q }),
  setHighlightPart: (p) => set({ highlightPart: p }),
  setSelectedPart: (p) => set({ selectedPart: p }),
  setViewPreset: (v) => set({ viewPreset: v }),

  startTour: () =>
    set({
      tourActive: true,
      tourStep: 0,
      showLabels: "compact",
      showCycleDiagram: false,
      exploded: false,
    }),
  stopTour: () => set({ tourActive: false, highlightPart: null }),
  nextTourStep: () =>
    set((s) => {
      const next = s.tourStep + 1;
      if (next >= TOUR_STEPS.length) return { tourActive: false, highlightPart: null };
      return { tourStep: next };
    }),
  prevTourStep: () => set((s) => ({ tourStep: Math.max(0, s.tourStep - 1) })),
  setTourStep: (i) =>
    set({ tourStep: Math.max(0, Math.min(TOUR_STEPS.length - 1, i)) }),

  savePreset: (name) => {
    const s = get();
    const preset: CustomPreset = {
      id: `preset-${Date.now()}`,
      name: name || `Preset ${s.customPresets.length + 1}`,
      rpm: s.rpm,
      steamPressure: s.steamPressure,
      throttle: s.throttle,
      load: s.load,
      governorEnabled: s.governorEnabled,
      timeOfDay: s.timeOfDay,
      createdAt: Date.now(),
    };
    const next = [...s.customPresets, preset];
    set({ customPresets: next });
    // Persist custom presets separately
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("watt-engine-presets", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  },
  loadPreset: (id) => {
    const s = get();
    const preset = s.customPresets.find((p) => p.id === id);
    if (!preset) return;
    set({
      rpm: preset.rpm,
      steamPressure: preset.steamPressure,
      throttle: preset.throttle,
      load: preset.load,
      governorEnabled: preset.governorEnabled,
      timeOfDay: preset.timeOfDay,
      governorIntegral: 0,
    });
    persist(get());
  },
  deletePreset: (id) => {
    const s = get();
    const next = s.customPresets.filter((p) => p.id !== id);
    set({ customPresets: next });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("watt-engine-presets", JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  },

  tick: (dt) => {
    const s = get();

    // Animate exploded amount toward target (smooth ease)
    const explodeTarget = s.exploded ? 1 : 0;
    const explodeNext =
      s.explodedAmount + (explodeTarget - s.explodedAmount) * Math.min(1, 4 * dt);

    // Boiler temperature drifts toward the pressure setpoint (thermal lag)
    const tempNext =
      s.boilerTemp + (s.steamPressure - s.boilerTemp) * Math.min(1, 0.15 * dt);

    // ---- Tour auto-advance ----
    let tourStep = s.tourStep;
    let tourActive = s.tourActive;
    if (tourActive) {
      const step = TOUR_STEPS[s.tourStep];
      if (step) {
        // Drive view + highlight from the current tour step (cheap writes)
        if (s.viewPreset !== step.view) set({ viewPreset: step.view });
        if (s.highlightPart !== step.partId) set({ highlightPart: step.partId });
        // Advance after duration
        const stepElapsed = s.elapsed % step.duration;
        if (s.elapsed > 0 && stepElapsed < dt && s.elapsed > step.duration * (s.tourStep + 1)) {
          const nextIdx = s.tourStep + 1;
          if (nextIdx >= TOUR_STEPS.length) {
            tourActive = false;
            set({ highlightPart: null });
          } else {
            tourStep = nextIdx;
          }
        }
      }
    }

    if (!s.running) {
      const nextRpm = Math.max(0, s.actualRpm - s.actualRpm * 0.4 * dt);
      set({
        actualRpm: nextRpm,
        explodedAmount: explodeNext,
        boilerTemp: tempNext,
        governorSleeve: Math.max(0, s.governorSleeve - dt * 0.5),
        governorIntegral: 0,
        tourStep,
        tourActive,
      });
      return;
    }

    // ---- Closed-loop governor (PI controller) ----
    // P term: proportional to current error. I term: accumulates residual
    // error to eliminate steady-state offset (the known issue from round 1).
    let throttle = s.throttle;
    let govSleeve = s.governorSleeve;
    let integral = s.governorIntegral;
    if (s.governorEnabled) {
      const err = s.rpm - s.actualRpm;
      // Anti-windup: only accumulate when not saturated
      const Kp = 0.012;
      const Ki = 0.004;
      const P = err * Kp;
      // Integrate, but clamp the integral term
      integral = Math.max(-0.4, Math.min(0.4, integral + err * Ki * dt));
      const correction = (P + integral) * dt * 60;
      throttle = Math.max(0.05, Math.min(1, throttle + correction));
      const omega = (s.actualRpm / 60) * Math.PI * 2;
      govSleeve = Math.min(1, (omega * omega) / 60);
    } else {
      const omega = (s.actualRpm / 60) * Math.PI * 2;
      govSleeve = Math.min(1, (omega * omega) / 60);
      integral = 0;
    }

    // ---- Engine dynamics ----
    // The effective target RPM is the user target, scaled by steam pressure
    // and throttle availability, and reduced by external load. With full
    // throttle and adequate pressure (≥0.6), the engine can reach the user
    // target. At low pressure or low throttle, it falls short — then the
    // governor (if enabled) opens the throttle further to compensate.
    const loadFactor = 1 - s.load * 0.45;
    // pressureFactor: reaches 1.0 at pressure 0.6, overshoots above (more headroom)
    const pressureFactor = Math.min(1.15, 0.4 + s.steamPressure);
    // throttleFactor: 1.0 at full throttle, ~0.2 at zero throttle
    const throttleFactor = 0.2 + 0.8 * throttle;
    const effectiveTarget =
      s.rpm * pressureFactor * throttleFactor * loadFactor;
    const k = 1.5;
    const nextRpm =
      s.actualRpm + (effectiveTarget - s.actualRpm) * Math.min(1, k * dt);
    const omega = (nextRpm / 60) * Math.PI * 2;

    set({
      actualRpm: nextRpm,
      throttle,
      governorSleeve: govSleeve,
      governorIntegral: integral,
      elapsed: s.elapsed + dt,
      totalRevolutions: s.totalRevolutions + (omega * dt) / (Math.PI * 2),
      powerOutput:
        nextRpm * s.steamPressure * throttle * 0.12 * (1 - s.load * 0.3),
      explodedAmount: explodeNext,
      boilerTemp: tempNext,
      tourStep,
      tourActive,
    });
  },

  reset: () => {
    set({
      ...initialState,
      ...loadPersisted(),
      running: get().running,
      actualRpm: 0,
      elapsed: 0,
      totalRevolutions: 0,
      governorIntegral: 0,
    });
  },
}));
