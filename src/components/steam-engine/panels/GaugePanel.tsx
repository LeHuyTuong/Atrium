"use client";

import { useEngineStore } from "../useEngineStore";
import { t } from "../i18n";
import { Separator } from "@/components/ui/separator";
import {
  Gauge as GaugeIcon,
  Zap,
  Timer,
  RotateCw,
  ArrowUpDown,
  DoorOpen,
  Thermometer,
  Orbit,
  Weight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Live instrumentation: RPM semicircular gauge, pressure bar, power output,
 *  piston position, valve state, governor sleeve, load, boiler temperature,
 *  total revolutions, runtime. */
export function GaugePanel({ className }: { className?: string }) {
  const actualRpm = useEngineStore((s) => s.actualRpm);
  const rpm = useEngineStore((s) => s.rpm);
  const steamPressure = useEngineStore((s) => s.steamPressure);
  const throttle = useEngineStore((s) => s.throttle);
  const powerOutput = useEngineStore((s) => s.powerOutput);
  const pistonPos = useEngineStore((s) => s.pistonPos);
  const valveOpen = useEngineStore((s) => s.valveOpen);
  const totalRevolutions = useEngineStore((s) => s.totalRevolutions);
  const elapsed = useEngineStore((s) => s.elapsed);
  const load = useEngineStore((s) => s.load);
  const governorEnabled = useEngineStore((s) => s.governorEnabled);
  const governorSleeve = useEngineStore((s) => s.governorSleeve);
  const boilerTemp = useEngineStore((s) => s.boilerTemp);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  const rpmNorm = Math.min(1, actualRpm / 80);
  const pressBar = (steamPressure * 8).toFixed(1);
  const tempC = Math.round(boilerTemp * 180 + 20); // 20..200°C illustrative

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-950/90 to-stone-900/80 p-4 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40 ring-1 ring-amber-500/5",
        className,
      )}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
          <GaugeIcon className="h-4 w-4 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold tracking-wide text-amber-100">
          {tr("gauges")}
        </h3>
      </div>

      <Separator className="bg-amber-500/15" />

      {/* RPM semicircular gauge with target marker */}
      <RpmGauge value={actualRpm} norm={rpmNorm} target={rpm} />

      <Separator className="bg-amber-500/15" />

      {/* Pressure bar */}
      <Bar
        label={tr("steamPressure")}
        value={pressBar}
        unit="bar"
        pct={steamPressure * 100}
        gradient="from-amber-500 via-orange-500 to-red-500"
        textColor="text-orange-300"
      />

      {/* Throttle bar */}
      <Bar
        label={governorEnabled ? tr("throttleAuto") : tr("throttle")}
        value={`${Math.round(throttle * 100)}`}
        unit="%"
        pct={throttle * 100}
        gradient="from-sky-400 to-cyan-500"
        textColor="text-sky-300"
        badge={governorEnabled ? "CTL" : undefined}
      />

      {/* Boiler temperature */}
      <Bar
        label={tr("boilerTemp")}
        value={`${tempC}`}
        unit="°C"
        pct={boilerTemp * 100}
        gradient="from-yellow-400 via-orange-500 to-red-600"
        textColor="text-yellow-300"
      />

      <Separator className="bg-amber-500/15" />

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
          label={tr("power")}
          value={powerOutput.toFixed(1)}
          unit="kW"
        />
        <StatCard
          icon={<RotateCw className="h-3.5 w-3.5 text-amber-400" />}
          label={tr("revs")}
          value={totalRevolutions.toFixed(1)}
          unit="vòng"
        />
        <StatCard
          icon={<Timer className="h-3.5 w-3.5 text-stone-300" />}
          label={tr("runtime")}
          value={formatTime(elapsed)}
          unit=""
        />
        <StatCard
          icon={<DoorOpen className="h-3.5 w-3.5 text-emerald-400" />}
          label={tr("steamValve")}
          value={`${Math.round(valveOpen * 100)}`}
          unit="%"
        />
        <StatCard
          icon={<Weight className="h-3.5 w-3.5 text-rose-300" />}
          label={tr("externalLoad")}
          value={`${Math.round(load * 100)}`}
          unit="%"
        />
        <StatCard
          icon={<Orbit className="h-3.5 w-3.5 text-violet-300" />}
          label={tr("governor")}
          value={`${Math.round(governorSleeve * 100)}`}
          unit="%"
        />
      </div>

      <Separator className="bg-amber-500/15" />

      {/* Piston position indicator */}
      <div className="flex items-center gap-3">
        <ArrowUpDown className="h-4 w-4 shrink-0 text-stone-300" />
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span>TDC</span>
            <span className="text-stone-300">{tr("pistonPos")}</span>
            <span>BDC</span>
          </div>
          <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-stone-800">
            <div className="absolute inset-y-0 left-1/2 w-px bg-stone-600" />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-[left] duration-75"
              style={{ left: `${((pistonPos + 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Governor sleeve indicator */}
      <div className="flex items-center gap-3">
        <Thermometer className="h-4 w-4 shrink-0 text-violet-300" />
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span>{tr("low")}</span>
            <span className="text-stone-300">{tr("governorSleeve")}</span>
            <span>{tr("high")}</span>
          </div>
          <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-[width] duration-150"
              style={{ width: `${governorSleeve * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  unit,
  pct,
  gradient,
  textColor,
  badge,
}: {
  label: string;
  value: string;
  unit: string;
  pct: number;
  gradient: string;
  textColor: string;
  badge?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-stone-300">
          {label}
          {badge && (
            <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-bold text-emerald-300">
              {badge}
            </span>
          )}
        </span>
        <span className={cn("font-mono", textColor)}>
          {value}
          <span className="ml-0.5 text-[10px] text-stone-400">{unit}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-stone-800 ring-1 ring-stone-700/40">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-150", gradient)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RpmGauge({
  value,
  norm,
  target,
}: {
  value: number;
  norm: number;
  target: number;
}) {
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);
  const r = 56;
  const cx = 70;
  const cy = 70;
  const startAngle = Math.PI;
  const endAngle = 0;
  const angle = startAngle + (endAngle - startAngle) * norm;
  // Target marker angle
  const targetNorm = Math.min(1, target / 80);
  const targetAngle = startAngle + (endAngle - startAngle) * targetNorm;
  const targetX = cx + (r + 5) * Math.cos(targetAngle);
  const targetY = cy + (r + 5) * Math.sin(targetAngle);

  const arc = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from);
    const y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy + r * Math.sin(to);
    const large = Math.abs(to - from) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleX = cx + (r - 8) * Math.cos(angle);
  const needleY = cy + (r - 8) * Math.sin(angle);

  const ticks = Array.from({ length: 9 }).map((_, i) => {
    const a = Math.PI - (i / 8) * Math.PI;
    const x1 = cx + (r + 2) * Math.cos(a);
    const y1 = cy + (r + 2) * Math.sin(a);
    const x2 = cx + (r - 4) * Math.cos(a);
    const y2 = cy + (r - 4) * Math.sin(a);
    return {
      x1,
      y1,
      x2,
      y2,
      label: Math.round((i / 8) * 80),
      lx: cx + (r - 14) * Math.cos(a),
      ly: cy + (r - 14) * Math.sin(a),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 90" className="w-full max-w-[180px]">
        {/* Track */}
        <path d={arc(startAngle, endAngle)} fill="none" stroke="#3a322a" strokeWidth={8} strokeLinecap="round" />
        {/* Value arc */}
        <path
          d={arc(startAngle, angle)}
          fill="none"
          stroke="url(#rpmGrad)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="rpmGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#7a6a52" strokeWidth={1} />
            {i % 2 === 0 && (
              <text x={t.lx} y={t.ly} fill="#a89878" fontSize={6} textAnchor="middle" dominantBaseline="middle">
                {t.label}
              </text>
            )}
          </g>
        ))}
        {/* Target marker (small triangle) */}
        <polygon
          points={`${targetX},${targetY - 3} ${targetX},${targetY + 3} ${targetX + 4 * Math.sign(Math.cos(targetAngle) || 1)},${targetY}`}
          fill="#34d399"
          opacity={0.9}
        />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#fcd34d" strokeWidth={2.2} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill="#fcd34d" stroke="#7c5a10" strokeWidth={1} />
      </svg>
      <div className="-mt-1 flex items-baseline gap-1.5 text-center">
        <span className="font-mono text-2xl font-bold leading-none text-amber-300">
          {value.toFixed(0)}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-stone-400">
          {tr("revsPerMin")}
        </span>
        <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1 text-[9px] text-emerald-300">
          ▸ {target}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-lg border border-amber-500/15 bg-stone-900/60 p-2 transition-colors hover:border-amber-500/25">
      <div className="flex items-center gap-1 text-[10px] text-stone-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="font-mono text-sm font-semibold text-stone-100">{value}</span>
        {unit && <span className="text-[10px] text-stone-400">{unit}</span>}
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
