"use client";

import { useEngineStore } from "../useEngineStore";
import { engineClock } from "../engineClock";
import { ENGINE_GEOMETRY } from "../kinematics";

export function GaugePanel() {
  const store = useEngineStore();
  const lang = store.language;
  const state = engineClock.state;

  const maxRpm = 8000;
  const rpmPct = Math.min(100, (store.actualRpm / maxRpm) * 100);

  return (
    <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-stone-950/90 p-4 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40">
      <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-400/70">
        {lang === "vi" ? "Đồng hồ đo" : "Gauges"}
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
            <circle cx="30" cy="30" r="24" fill="none" stroke="#3a3d42" strokeWidth="4" />
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke={rpmPct > 80 ? "#ef4444" : "#f59e0b"}
              strokeWidth="4"
              strokeDasharray={`${(rpmPct / 100) * 150.8} 150.8`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-bold text-amber-200">
              {Math.round(store.actualRpm)}
            </span>
            <span className="text-[0.4rem] uppercase tracking-wider text-stone-500">RPM</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 text-[0.6rem]">
          <StatRow
            label={lang === "vi" ? "Công suất" : "Power"}
            value={`${store.powerOutput.toFixed(1)}`}
            unit="HP"
          />
          <StatRow
            label={lang === "vi" ? "Số vòng" : "Revs"}
            value={`${Math.round(store.totalRevolutions)}`}
            unit=""
          />
          <StatRow
            label={lang === "vi" ? "Thời gian" : "Runtime"}
            value={`${Math.floor(store.elapsed)}s`}
            unit=""
          />
        </div>
      </div>

      <div className="space-y-1.5 text-[0.6rem]">
        <div className="flex items-center justify-between text-stone-400">
          <span>{lang === "vi" ? "Áp suất xy-lanh" : "Cyl. Pressure"}</span>
        </div>
        {state && (
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: ENGINE_GEOMETRY.numCylinders }).map((_, i) => {
              const pct = state.cylinderPressure?.[i] || 0;
              const pctDisplay = Math.round(pct * 100);
              const phase = state.cyclePhase?.[i] || 0;
              const phaseNames = ["Nạp", "Nén", "Nổ", "Xả"];
              const phaseIdx = Math.floor(phase * 4);
              return (
                <div key={i} className="flex flex-col items-center gap-0.5 rounded-lg bg-stone-800/60 p-1.5">
                  <span className="font-mono text-[0.5rem] text-stone-500">#{i + 1}</span>
                  <div className="h-8 w-3 rounded-full bg-stone-700">
                    <div
                      className="h-full w-full rounded-full bg-amber-500 transition-all"
                      style={{ height: `${pctDisplay}%`, alignSelf: "flex-end" }}
                    />
                  </div>
                  <span className="font-mono text-[0.45rem] text-amber-300/70">{pctDisplay}%</span>
                  <span className="text-[0.4rem] text-stone-500">{phaseNames[phaseIdx]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-400">{label}</span>
      <span className="font-mono text-amber-300/80">
        {value}
        {unit && <span className="text-stone-500 ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}
