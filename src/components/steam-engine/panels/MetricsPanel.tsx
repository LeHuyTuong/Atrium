"use client";

import { useEngineStore } from "../useEngineStore";
import { t } from "../i18n";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, TrendingUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

/** Export the metrics ring buffer as a downloadable CSV file. */
function exportMetricsCsv() {
  const metrics = useEngineStore.getState().metrics;
  if (metrics.length === 0) return;
  const header = "time_s,rpm,power_kW,pressure_pct,throttle_pct";
  const rows = metrics.map(
    (m) =>
      `${m.t.toFixed(1)},${m.rpm.toFixed(1)},${m.power.toFixed(2)},${(m.pressure * 100).toFixed(0)},${(m.throttle * 100).toFixed(0)}`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `watt-engine-metrics-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Live performance metrics graph: RPM, power, pressure, throttle over the
 *  last ~60 seconds. Uses a rolling buffer from the store (sampled at 2Hz).
 *  Toggleable via the store's showMetrics flag. */
export function MetricsPanel({ className }: { className?: string }) {
  const show = useEngineStore((s) => s.showMetrics);
  const toggle = useEngineStore((s) => s.toggleMetrics);
  const metrics = useEngineStore((s) => s.metrics);
  const rpm = useEngineStore((s) => s.rpm);
  const language = useEngineStore((s) => s.language);
  const tr = (k: Parameters<typeof t>[1]) => t(language, k);

  if (!show) return null;

  // Transform metrics for the chart: normalise values to 0..100 for a shared axis
  const data = metrics.map((m) => ({
    t: m.t.toFixed(0),
    rpm: Math.round(m.rpm),
    power: Math.round(m.power * 10) / 10,
    pressure: Math.round(m.pressure * 100),
    throttle: Math.round(m.throttle * 100),
  }));

  const targetRpm = rpm;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-amber-500/20 bg-gradient-to-b from-stone-950/90 to-stone-900/80 text-stone-200 backdrop-blur-md shadow-2xl shadow-black/40 ring-1 ring-amber-500/5",
        className,
      )}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between border-b border-amber-500/15 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-amber-100">
              {tr("metricsTitle")}
            </h3>
            <p className="text-[10px] text-stone-400">{tr("metricsWindow")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 rounded-full p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={exportMetricsCsv}
            title={language === "vi" ? "Xuất CSV" : "Export CSV"}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 rounded-full p-0 text-stone-400 hover:bg-amber-500/10 hover:text-amber-100"
            onClick={toggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="rpmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a241c" />
              <XAxis
                dataKey="t"
                stroke="#7a6a52"
                fontSize={9}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                stroke="#7a6a52"
                fontSize={9}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1814",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#f5f5f4",
                }}
                labelStyle={{ color: "#a89878" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
                iconType="circle"
              />
              <ReferenceLine
                y={targetRpm}
                stroke="#34d399"
                strokeWidth={1}
                strokeDasharray="4 2"
                label={{
                  value: `▸ ${targetRpm}`,
                  fill: "#34d399",
                  fontSize: 9,
                  position: "right",
                }}
              />
              <Line
                type="monotone"
                dataKey="rpm"
                name={tr("metricsRpm")}
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#fbbf24" }}
              />
              <Line
                type="monotone"
                dataKey="pressure"
                name={tr("metricsPressure")}
                stroke="#f97316"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="throttle"
                name={tr("metricsThrottle")}
                stroke="#38bdf8"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="power"
                name={tr("metricsPower")}
                stroke="#a78bfa"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Separator className="my-2.5 bg-amber-500/15" />

        {/* Current values summary */}
        <div className="grid grid-cols-4 gap-1.5">
          <MetricChip
            label={tr("metricsRpm")}
            value={metrics.length ? metrics[metrics.length - 1].rpm.toFixed(0) : "0"}
            color="text-amber-300"
            dot="bg-amber-400"
          />
          <MetricChip
            label={tr("metricsPower")}
            value={metrics.length ? metrics[metrics.length - 1].power.toFixed(1) : "0.0"}
            color="text-violet-300"
            dot="bg-violet-400"
          />
          <MetricChip
            label={tr("metricsPressure")}
            value={metrics.length ? Math.round(metrics[metrics.length - 1].pressure * 100).toString() : "0"}
            color="text-orange-300"
            dot="bg-orange-400"
          />
          <MetricChip
            label={tr("metricsThrottle")}
            value={metrics.length ? Math.round(metrics[metrics.length - 1].throttle * 100).toString() : "0"}
            color="text-sky-300"
            dot="bg-sky-400"
          />
        </div>
      </div>
    </div>
  );
}

function MetricChip({
  label,
  value,
  color,
  dot,
}: {
  label: string;
  value: string;
  color: string;
  dot: string;
}) {
  return (
    <div className="rounded-lg border border-amber-500/15 bg-stone-900/60 p-1.5">
      <div className="flex items-center gap-1 text-[9px] text-stone-400">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        {label}
      </div>
      <div className={cn("mt-0.5 font-mono text-xs font-semibold", color)}>
        {value}
      </div>
    </div>
  );
}
