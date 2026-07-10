"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  SCENARIOS,
  useEngineStore,
  ViewPreset,
  LabelMode,
  Scenario,
} from "../useEngineStore";
import { t } from "../i18n";
import { PresetPanel } from "./PresetPanel";
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Wind,
  Scissors,
  Tag,
  Camera,
  Gauge,
  Settings2,
  Expand,
  Orbit,
  Volume2,
  VolumeX,
  Activity,
  Weight,
  Sun,
  Moon,
  Sunset,
  Compass,
  Keyboard,
  TrendingUp,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";

const VIEW_KEYS: { value: ViewPreset; key: "viewHero" | "viewSide" | "viewTop" | "viewCylinder" | "viewFlywheel" }[] = [
  { value: "hero", key: "viewHero" },
  { value: "side", key: "viewSide" },
  { value: "top", key: "viewTop" },
  { value: "cylinder", key: "viewCylinder" },
  { value: "flywheel", key: "viewFlywheel" },
];

const LABEL_KEYS: { value: LabelMode; key: "labelsOff" | "labelsCompact" | "labelsFull" }[] = [
  { value: "off", key: "labelsOff" },
  { value: "compact", key: "labelsCompact" },
  { value: "full", key: "labelsFull" },
];

export function ControlPanel({ className }: { className?: string }) {
  const running = useEngineStore((s) => s.running);
  const toggle = useEngineStore((s) => s.toggle);
  const reset = useEngineStore((s) => s.reset);
  const rpm = useEngineStore((s) => s.rpm);
  const setRpm = useEngineStore((s) => s.setRpm);
  const steamPressure = useEngineStore((s) => s.steamPressure);
  const setSteamPressure = useEngineStore((s) => s.setSteamPressure);
  const throttle = useEngineStore((s) => s.throttle);
  const setThrottle = useEngineStore((s) => s.setThrottle);
  const load = useEngineStore((s) => s.load);
  const setLoad = useEngineStore((s) => s.setLoad);
  const showSteam = useEngineStore((s) => s.showSteam);
  const toggleSteam = useEngineStore((s) => s.toggleSteam);
  const showFire = useEngineStore((s) => s.showFire);
  const toggleFire = useEngineStore((s) => s.toggleFire);
  const crossSection = useEngineStore((s) => s.crossSection);
  const toggleCrossSection = useEngineStore((s) => s.toggleCrossSection);
  const exploded = useEngineStore((s) => s.exploded);
  const toggleExploded = useEngineStore((s) => s.toggleExploded);
  const governorEnabled = useEngineStore((s) => s.governorEnabled);
  const toggleGovernor = useEngineStore((s) => s.toggleGovernor);
  const audioOn = useEngineStore((s) => s.audioOn);
  const toggleAudio = useEngineStore((s) => s.toggleAudio);
  const showCycleDiagram = useEngineStore((s) => s.showCycleDiagram);
  const toggleCycleDiagram = useEngineStore((s) => s.toggleCycleDiagram);
  const showLabels = useEngineStore((s) => s.showLabels);
  const setShowLabels = useEngineStore((s) => s.setShowLabels);
  const viewPreset = useEngineStore((s) => s.viewPreset);
  const setViewPreset = useEngineStore((s) => s.setViewPreset);
  const scenario = useEngineStore((s) => s.scenario);
  const setScenario = useEngineStore((s) => s.setScenario);
  const timeOfDay = useEngineStore((s) => s.timeOfDay);
  const toggleTimeOfDay = useEngineStore((s) => s.toggleTimeOfDay);
  const tourActive = useEngineStore((s) => s.tourActive);
  const startTour = useEngineStore((s) => s.startTour);
  const stopTour = useEngineStore((s) => s.stopTour);
  const toggleHelp = useEngineStore((s) => s.toggleHelp);
  const showMetrics = useEngineStore((s) => s.showMetrics);
  const toggleMetrics = useEngineStore((s) => s.toggleMetrics);
  const audioVolume = useEngineStore((s) => s.audioVolume);
  const setAudioVolume = useEngineStore((s) => s.setAudioVolume);
  const language = useEngineStore((s) => s.language);
  const toggleLanguage = useEngineStore((s) => s.toggleLanguage);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  const TOD_OPTIONS: { value: typeof timeOfDay; label: string; icon: React.ReactNode }[] = [
    { value: "day", label: tr("day"), icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dusk", label: tr("dusk"), icon: <Sunset className="h-3.5 w-3.5" /> },
    { value: "night", label: tr("night"), icon: <Moon className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-950/90 to-stone-900/80 p-4 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40 ring-1 ring-amber-500/5",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
            <Settings2 className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold tracking-wide text-amber-100">
            {tr("controlPanel")}
          </h3>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "border-amber-500/40 text-[10px]",
            running
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-stone-700/40 text-stone-400",
          )}
        >
          {running ? `● ${tr("running").toUpperCase()}` : `○ ${tr("stopped").toUpperCase()}`}
        </Badge>
      </div>

      <Separator className="bg-amber-500/15" />

      {/* Scenarios */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-400">
          <Flame className="h-3 w-3 text-orange-400" />
          {tr("scenarios")}
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {SCENARIOS.map((sc) => {
            const scKey = sc.id === "startup" ? "scenarioStartup" : sc.id === "normal" ? "scenarioNormal" : sc.id === "full" ? "scenarioFull" : "scenarioOverload";
            return (
            <Button
              key={sc.id}
              size="sm"
              variant={scenario === sc.id ? "default" : "outline"}
              onClick={() => setScenario(sc.id as Scenario)}
              className={cn(
                "h-8 justify-start gap-1.5 px-2 text-[11px]",
                scenario === sc.id
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 shadow-md shadow-amber-900/30 hover:from-amber-400 hover:to-orange-500"
                  : "border-amber-500/25 bg-stone-900/40 text-stone-300 hover:bg-amber-500/10 hover:text-amber-100",
              )}
            >
              {tr(scKey as "scenarioStartup")}
            </Button>
            );
          })}
        </div>
      </div>

      {/* Custom preset save/load */}
      <PresetPanel />

      <Separator className="bg-amber-500/15" />

      {/* Run controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={toggle}
          size="sm"
          className={cn(
            "flex-1 gap-1.5 font-medium",
            running
              ? "bg-stone-700 text-stone-100 hover:bg-stone-600"
              : "bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 shadow-md shadow-amber-900/40 hover:from-amber-400 hover:to-orange-500",
          )}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? tr("pause") : tr("start")}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={reset}
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-transparent text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tr("reset")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleAudio}
                size="sm"
                variant="outline"
                className={cn(
                  "border-amber-500/30 bg-transparent hover:bg-amber-500/10",
                  audioOn ? "text-amber-300" : "text-stone-500",
                )}
              >
                {audioOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{audioOn ? tr("toggleAudioOn") : tr("toggleAudioOff")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Tour + Help row */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => (tourActive ? stopTour() : startTour())}
          size="sm"
          className={cn(
            "flex-1 gap-1.5 font-medium",
            tourActive
              ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-900/40 hover:from-sky-400 hover:to-indigo-500"
              : "border border-amber-500/30 bg-stone-900/60 text-amber-100 hover:bg-amber-500/10",
          )}
        >
          <Compass className="h-4 w-4" />
          {tourActive ? tr("tourActive") : tr("tour")}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleHelp}
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-transparent text-amber-200 hover:bg-amber-500/10 hover:text-amber-100"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{`${tr("shortcuts")} (H)`}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Time of day */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-400">
          <Sun className="h-3 w-3 text-amber-400" />
          {tr("workshopLight")}
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {TOD_OPTIONS.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={timeOfDay === t.value ? "default" : "outline"}
              onClick={() => useEngineStore.getState().setTimeOfDay(t.value)}
              className={cn(
                "h-8 gap-1 px-1 text-[11px]",
                timeOfDay === t.value
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 hover:from-amber-400 hover:to-orange-500"
                  : "border-amber-500/25 bg-transparent text-stone-300 hover:bg-amber-500/10 hover:text-amber-100",
              )}
            >
              {t.icon}
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* RPM */}
      <SliderRow
        icon={<Gauge className="h-3.5 w-3.5 text-amber-400" />}
        label={tr("targetSpeed")}
        value={rpm}
        display={`${rpm} RPM`}
        onValueChange={(v) => setRpm(v)}
        min={0}
        max={80}
        accent="amber"
      />

      {/* Steam pressure */}
      <SliderRow
        icon={<Flame className="h-3.5 w-3.5 text-orange-400" />}
        label={tr("steamPressure")}
        value={Math.round(steamPressure * 100)}
        display={`${Math.round(steamPressure * 100)}%`}
        onValueChange={(v) => setSteamPressure(v / 100)}
        min={0}
        max={100}
        accent="orange"
      />

      {/* Throttle */}
      <SliderRow
        icon={<Wind className="h-3.5 w-3.5 text-sky-300" />}
        label={governorEnabled ? tr("throttleAuto") : tr("throttle")}
        value={Math.round(throttle * 100)}
        display={`${Math.round(throttle * 100)}%`}
        onValueChange={(v) => setThrottle(v / 100)}
        min={0}
        max={100}
        accent="sky"
        disabled={governorEnabled}
        hint={governorEnabled ? " (tự động bởi bộ điều tốc)" : ""}
      />

      {/* Load */}
      <SliderRow
        icon={<Weight className="h-3.5 w-3.5 text-rose-300" />}
        label={tr("externalLoad")}
        value={Math.round(load * 100)}
        display={`${Math.round(load * 100)}%`}
        onValueChange={(v) => setLoad(v / 100)}
        min={0}
        max={100}
        accent="rose"
      />

      <Separator className="bg-amber-500/15" />

      {/* View presets */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-400">
          <Camera className="h-3 w-3 text-amber-400" />
          {tr("viewAngle")}
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {VIEW_KEYS.map((v) => (
            <Button
              key={v.value}
              size="sm"
              variant={viewPreset === v.value ? "default" : "outline"}
              onClick={() => setViewPreset(v.value)}
              className={cn(
                "h-8 px-2 text-[11px]",
                viewPreset === v.value
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 hover:from-amber-400 hover:to-orange-500"
                  : "border-amber-500/25 bg-transparent text-stone-300 hover:bg-amber-500/10 hover:text-amber-100",
              )}
            >
              {tr(v.key)}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-amber-500/15" />

      {/* Toggle switches */}
      <div className="space-y-2">
        <ToggleRow
          icon={<Orbit className="h-3.5 w-3.5 text-emerald-400" />}
          label={tr("governor")}
          sub={governorEnabled ? tr("governorAuto") : ""}
          checked={governorEnabled}
          onCheckedChange={toggleGovernor}
        />
        <ToggleRow
          icon={<Expand className="h-3.5 w-3.5 text-violet-300" />}
          label={tr("explodedView")}
          checked={exploded}
          onCheckedChange={toggleExploded}
        />
        <ToggleRow
          icon={<Activity className="h-3.5 w-3.5 text-emerald-400" />}
          label={tr("pvDiagram")}
          checked={showCycleDiagram}
          onCheckedChange={toggleCycleDiagram}
        />
        <ToggleRow
          icon={<Wind className="h-3.5 w-3.5 text-stone-300" />}
          label={tr("steamEffects")}
          checked={showSteam}
          onCheckedChange={toggleSteam}
        />
        <ToggleRow
          icon={<Flame className="h-3.5 w-3.5 text-stone-300" />}
          label={tr("fireCoal")}
          checked={showFire}
          onCheckedChange={toggleFire}
        />
        <ToggleRow
          icon={<Scissors className="h-3.5 w-3.5 text-stone-300" />}
          label={tr("crossSection")}
          checked={crossSection}
          onCheckedChange={toggleCrossSection}
        />
        <ToggleRow
          icon={<TrendingUp className="h-3.5 w-3.5 text-amber-300" />}
          label={tr("metricsTitle")}
          checked={showMetrics}
          onCheckedChange={toggleMetrics}
        />
      </div>

      {/* Audio volume (only shown when audio is on) */}
      {audioOn && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label className="flex items-center gap-1.5 text-stone-300">
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              {tr("audioVolume")}
            </Label>
            <span className="font-mono text-amber-300">
              {Math.round(audioVolume * 100)}%
            </span>
          </div>
          <Slider
            value={[Math.round(audioVolume * 100)]}
            onValueChange={(v) => setAudioVolume(v[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-200"
          />
        </div>
      )}

      {/* Language toggle */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs text-stone-300">
          <Languages className="h-3.5 w-3.5 text-amber-400" />
          {tr("language")}
        </Label>
        <div className="flex overflow-hidden rounded-lg border border-amber-500/25">
          <button
            type="button"
            onClick={() => useEngineStore.getState().setLanguage("vi")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium transition-colors",
              language === "vi"
                ? "bg-amber-500 text-stone-950"
                : "bg-transparent text-stone-300 hover:bg-amber-500/10",
            )}
          >
            VI
          </button>
          <button
            type="button"
            onClick={() => useEngineStore.getState().setLanguage("en")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium transition-colors",
              language === "en"
                ? "bg-amber-500 text-stone-950"
                : "bg-transparent text-stone-300 hover:bg-amber-500/10",
            )}
          >
            EN
          </button>
        </div>
      </div>

      {/* Quality toggle */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs text-stone-300">
          <Settings2 className="h-3.5 w-3.5 text-amber-400" />
          {language === "vi" ? "Chất lượng đồ họa" : "Graphics quality"}
        </Label>
        <div className="flex overflow-hidden rounded-lg border border-amber-500/25">
          <button
            type="button"
            onClick={() => useEngineStore.getState().setQuality("high")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium transition-colors",
              useEngineStore.getState().quality === "high"
                ? "bg-amber-500 text-stone-950"
                : "bg-transparent text-stone-300 hover:bg-amber-500/10",
            )}
          >
            {language === "vi" ? "Cao" : "High"}
          </button>
          <button
            type="button"
            onClick={() => useEngineStore.getState().setQuality("low")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium transition-colors",
              useEngineStore.getState().quality === "low"
                ? "bg-amber-500 text-stone-950"
                : "bg-transparent text-stone-300 hover:bg-amber-500/10",
            )}
          >
            {language === "vi" ? "Thấp" : "Low"}
          </button>
        </div>
      </div>

      {/* Auto quality toggle */}
      <ToggleRow
        icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
        label={language === "vi" ? "Tự động giảm chất lượng" : "Auto quality"}
        sub={language === "vi" ? "Khi FPS thấp" : "When FPS drops"}
        checked={useEngineStore.getState().autoQuality}
        onCheckedChange={() => useEngineStore.getState().toggleAutoQuality()}
      />

      {/* Labels mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-400">
          <Tag className="h-3 w-3 text-amber-400" />
          {tr("partLabels")}
        </Label>
        <ToggleGroup
          type="single"
          value={showLabels}
          onValueChange={(v) => v && setShowLabels(v as LabelMode)}
          className="grid w-full grid-cols-3 gap-1"
        >
          {LABEL_KEYS.map((o) => (
            <ToggleGroupItem
              key={o.value}
              value={o.value}
              className="h-8 border border-amber-500/25 bg-transparent text-[11px] text-stone-300 data-[state=on]:bg-amber-500 data-[state=on]:text-stone-950 hover:bg-amber-500/10"
            >
              {tr(o.key)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}

function SliderRow({
  icon,
  label,
  value,
  display,
  onValueChange,
  min,
  max,
  accent,
  disabled,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  display: string;
  onValueChange: (v: number) => void;
  min: number;
  max: number;
  accent: "amber" | "orange" | "sky" | "rose";
  disabled?: boolean;
  hint?: string;
}) {
  const accentMap = {
    amber: "[&_[role=slider]]:bg-amber-400 [&_[role=slider]]:border-amber-200 [&_.slider-track-fill]:bg-amber-500",
    orange: "[&_[role=slider]]:bg-orange-400 [&_[role=slider]]:border-orange-200 [&_.slider-track-fill]:bg-orange-500",
    sky: "[&_[role=slider]]:bg-sky-400 [&_[role=slider]]:border-sky-200 [&_.slider-track-fill]:bg-sky-500",
    rose: "[&_[role=slider]]:bg-rose-400 [&_[role=slider]]:border-rose-200 [&_.slider-track-fill]:bg-rose-500",
  };
  return (
    <div className={cn("space-y-1.5", disabled && "opacity-60")}>
      <div className="flex items-center justify-between text-xs">
        <Label className="flex items-center gap-1.5 text-stone-300">
          {icon}
          {label}
          {hint && <span className="text-[10px] text-emerald-400">{hint}</span>}
        </Label>
        <span
          className={cn(
            "font-mono",
            accent === "amber" && "text-amber-300",
            accent === "orange" && "text-orange-300",
            accent === "sky" && "text-sky-300",
            accent === "rose" && "text-rose-300",
          )}
        >
          {display}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onValueChange(v[0])}
        min={min}
        max={max}
        step={1}
        disabled={disabled}
        className={cn(accentMap[accent])}
      />
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="flex items-center gap-1.5 text-xs text-stone-300">
        {icon}
        <span>
          {label}
          {sub && <span className="ml-1 text-[10px] text-stone-500">{sub}</span>}
        </span>
      </Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
