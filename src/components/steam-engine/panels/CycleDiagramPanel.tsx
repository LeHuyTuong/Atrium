"use client";

import { useEngineStore } from "../useEngineStore";
import { t } from "../i18n";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X, Activity, ArrowRight, ArrowDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

/** P-V (Pressure–Volume) indicator diagram for the Watt steam cycle.
 *  Shows the theoretical cycle curve with 4 labelled strokes, plus a live
 *  tracing dot showing where the piston currently is in the cycle.
 *  Includes a work/revolution + thermal efficiency readout. */
export function CycleDiagramPanel({ className }: { className?: string }) {
  const show = useEngineStore((s) => s.showCycleDiagram);
  const toggle = useEngineStore((s) => s.toggleCycleDiagram);
  const cylinderPressure = useEngineStore((s) => s.cylinderPressure);
  const cylinderVolume = useEngineStore((s) => s.cylinderVolume);
  const cyclePhase = useEngineStore((s) => s.cyclePhase);
  const rpm = useEngineStore((s) => s.actualRpm);
  const workPerRev = useEngineStore((s) => s.workPerRev);
  const steamPressure = useEngineStore((s) => s.steamPressure);
  const throttle = useEngineStore((s) => s.throttle);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  // Build the idealized cycle path once (Watt cycle: admission → expansion →
  // exhaust → compression). We approximate as a smooth closed loop in P-V space.
  const cyclePath = useMemo(() => buildCyclePath(), []);

  if (!show) return null;

  // Current operating point
  const cx = 30 + cylinderVolume * 220; // V on x axis
  const cy = 150 - cylinderPressure * 120; // P on y axis (inverted)

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-amber-500/20 bg-stone-950/85 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40",
        className,
      )}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between border-b border-amber-500/15 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold tracking-wide text-amber-100">
            {tr("pvTitle")}
          </h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
          onClick={toggle}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3">
        <svg viewBox="0 0 280 180" className="w-full">
          {/* Grid */}
          {[30, 90, 150, 210, 250].map((x) => (
            <line key={`vg-${x}`} x1={x} y1={20} x2={x} y2={150} stroke="#2a241c" strokeWidth={0.5} />
          ))}
          {[30, 70, 110, 150].map((y) => (
            <line key={`hg-${y}`} x1={30} y1={y} x2={250} y2={y} stroke="#2a241c" strokeWidth={0.5} />
          ))}

          {/* Axes */}
          <line x1={30} y1={150} x2={250} y2={150} stroke="#7a6a52" strokeWidth={1} />
          <line x1={30} y1={150} x2={30} y2={20} stroke="#7a6a52" strokeWidth={1} />
          {/* Arrow heads */}
          <polygon points="250,150 245,147 245,153" fill="#7a6a52" />
          <polygon points="30,20 27,25 33,25" fill="#7a6a52" />

          {/* Axis labels */}
          <text x={255} y={154} fill="#a89878" fontSize={8}>V</text>
          <text x={22} y={18} fill="#a89878" fontSize={8}>P</text>
          <text x={140} y={172} fill="#a89878" fontSize={8} textAnchor="middle">
            {tr("volume")} (V) →
          </text>
          <text
            x={10}
            y={85}
            fill="#a89878"
            fontSize={8}
            textAnchor="middle"
            transform="rotate(-90 10 85)"
          >
            {tr("pressureAxis")} (P)
          </text>

          {/* Cycle area fill (the work done per cycle = area enclosed) */}
          <path
            d={`${cyclePath} Z`}
            fill="url(#cycleFill)"
            opacity={0.25}
          />
          <defs>
            <linearGradient id="cycleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Cycle curve */}
          <path
            d={cyclePath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.8}
            strokeLinejoin="round"
            opacity={0.85}
          />

          {/* Stroke labels with arrows */}
          {/* 1. Admission (top, left→right) */}
          <g>
            <text x={70} y={45} fill="#86efac" fontSize={8} fontWeight="bold">1. {tr("strokeAdmission")}</text>
            <ArrowRight x={70} y={50} className="text-emerald-400" />
            <line x1={50} y1={38} x2={62} y2={32} stroke="#86efac" strokeWidth={0.6} markerEnd="url(#arrG)" />
          </g>
          {/* 2. Expansion (right, top→bottom curve) */}
          <g>
            <text x={185} y={70} fill="#fdba74" fontSize={8} fontWeight="bold">2. {tr("strokeExpansion")}</text>
            <line x1={183} y1={73} x2={195} y2={95} stroke="#fdba74" strokeWidth={0.6} />
          </g>
          {/* 3. Exhaust (bottom, right→left) */}
          <g>
            <text x={150} y={140} fill="#93c5fd" fontSize={8} fontWeight="bold">3. {tr("strokeExhaust")}</text>
            <line x1={148} y1={136} x2={120} y2={138} stroke="#93c5fd" strokeWidth={0.6} />
          </g>
          {/* 4. Compression (left, bottom→top) */}
          <g>
            <text x={36} y={100} fill="#fcd34d" fontSize={8} fontWeight="bold">4. {tr("strokeCompression")}</text>
            <ArrowDown x={36} y={105} className="text-amber-300" />
          </g>

          {/* TDC / BDC markers */}
          <line x1={50} y1={148} x2={50} y2={152} stroke="#a89878" strokeWidth={1} />
          <text x={50} y={162} fill="#a89878" fontSize={6.5} textAnchor="middle">TDC</text>
          <line x1={220} y1={148} x2={220} y2={152} stroke="#a89878" strokeWidth={1} />
          <text x={220} y={162} fill="#a89878" fontSize={6.5} textAnchor="middle">BDC</text>

          {/* Live tracing dot (the current state) */}
          <circle
            cx={cx}
            cy={cy}
            r={4.5}
            fill="#f97316"
            stroke="#fff7ed"
            strokeWidth={1.5}
            className="drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]"
          />
          {/* Trail (phase indicator ring) */}
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="none"
            stroke="#f97316"
            strokeWidth={0.8}
            opacity={0.4}
          />
        </svg>

        {/* Live readout */}
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
          <Readout label={tr("pressureAxis")} value={(cylinderPressure * 8).toFixed(2)} unit="bar" color="text-orange-300" />
          <Readout label={tr("volume")} value={`${Math.round(cylinderVolume * 100)}`} unit="%" color="text-sky-300" />
          <Readout label={tr("phase")} value={`${Math.round(cyclePhase * 360)}`} unit="°" color="text-emerald-300" />
        </div>

        <Separator className="my-2.5 bg-amber-500/15" />

        {/* Efficiency readout */}
        <div className="grid grid-cols-3 gap-1.5">
          <Readout
            label={tr("workPerRev")}
            value={workPerRev.toFixed(0)}
            unit="J"
            color="text-amber-300"
          />
          <Readout
            label="Công suất"
            value={(workPerRev * rpm / 60).toFixed(1)}
            unit="W"
            color="text-emerald-300"
          />
          <Readout
            label={tr("efficiency")}
            value={`${Math.round(
              Math.min(28, workPerRev / (steamPressure * throttle * 4200 + 1) * 100),
            )}`}
            unit="%"
            color="text-sky-300"
          />
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-stone-400">
          {tr("pvExplain")}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-stone-500">
            <Zap className="h-3 w-3 text-amber-400" />
            {tr("cycleSpeed")}: {rpm.toFixed(0)} RPM
          </span>
          <span className="text-emerald-400">● {tr("live")}</span>
        </div>
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-md border border-amber-500/15 bg-stone-900/50 px-1.5 py-1">
      <div className="text-[9px] text-stone-400">{label}</div>
      <div className={cn("font-mono text-xs font-semibold", color)}>
        {value}
        <span className="ml-0.5 text-[8px] text-stone-400">{unit}</span>
      </div>
    </div>
  );
}

/** Build a smooth closed Watt-cycle path in the 280×180 viewBox.
 *  Coordinates: x ∈ [50, 220] (volume), y ∈ [30, 150] (pressure, inverted). */
function buildCyclePath(): string {
  // Key points:
  //  A (TDC, start of admission):  V=0.05, P=0.95
  //  B (end of admission):         V=0.25, P=0.92
  //  C (BDC, end of expansion):    V=1.00, P=0.18
  //  D (start of exhaust @ BDC):   V=1.00, P=0.05
  //  E (end of exhaust @ TDC):     V=0.05, P=0.04
  //  back to A (compression rise): V=0.05, P=0.95
  const toX = (v: number) => 50 + v * 170;
  const toY = (p: number) => 150 - p * 125;
  const A = [toX(0.05), toY(0.95)];
  const B = [toX(0.25), toY(0.92)];
  const C = [toX(1.0), toY(0.18)];
  const D = [toX(1.0), toY(0.05)];
  const E = [toX(0.05), toY(0.04)];

  // Admission: straight A→B (constant pressure)
  // Expansion: polytropic curve B→C (P ∝ 1/V^0.6), sampled
  // Exhaust: straight C→D (drop at BDC), then D→E (constant low pressure)
  // Compression: straight E→A (rise at TDC)
  const expansionPts: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const v = 0.25 + t * 0.75;
    const p = 0.92 * Math.pow(0.25 / v, 0.6);
    expansionPts.push(`${toX(v).toFixed(1)},${toY(Math.max(0.05, p)).toFixed(1)}`);
  }

  return [
    `M ${A[0]} ${A[1]}`,
    `L ${B[0]} ${B[1]}`,
    `L ${expansionPts.join(" L ")}`,
    `L ${C[0]} ${C[1]}`,
    `L ${D[0]} ${D[1]}`,
    `L ${E[0]} ${E[1]}`,
    `L ${A[0]} ${A[1]}`,
  ].join(" ");
}
