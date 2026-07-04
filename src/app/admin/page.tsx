"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Eye,
  Activity,
  Clock,
  MessageSquare,
  Bookmark,
  GraduationCap,
  MapPin,
  TrendingUp,
  Zap,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react";

// ── Types ──
interface AdminStats {
  overview: {
    totalVisits: number;
    activeVisits: number;
    avgDuration: number;
    totalEvents: number;
    tourCount: number;
  };
  modes: Record<string, number>;
  events: Record<string, number>;
  feedback: Record<string, number>;
  engagement: {
    guestbookEntries: number;
    totalExhibitsSeen: number;
    quizzesPassed: number;
  };
  traffic: {
    peakConcurrent: number;
    hourly: { time: string; count: number }[];
    daily: { date: string; count: number }[];
  };
}

// ── Helpers ──
function timeAgo(date: Date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return `${sec}s trước`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}ph trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h trước`;
  return `${Math.floor(hr / 24)}d trước`;
}

function fmtDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}ph ${s}s`;
}

function fmtNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

// ── Sparkline chart (mini SVG) ──
function Sparkline({
  data,
  color = "#e89446",
  height = 40,
}: {
  data: { value: number }[];
  color?: string;
  height?: number;
}) {
  if (!data.length) return null;
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const width = Math.max(data.length * 8, 120);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * width},${height - (v / max) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="w-full">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Mini bar chart ──
function MiniBarChart({
  data,
  color = "#e89446",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: 48 }}>
      {data.slice(-14).map((d, i) => (
        <div
          key={i}
          className="w-full rounded-t transition-all duration-300"
          style={{
            height: `${(d.value / max) * 100}%`,
            background: color,
            opacity: 0.5 + (d.value / max) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ── Stat Card ──
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-4 transition hover:border-foreground/20">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">{label}</div>
          {loading ? (
            <div className="mt-1.5 h-7 w-20 animate-pulse rounded bg-foreground/10" />
          ) : (
            <div className="mt-1 font-serif text-2xl font-bold text-foreground">{value}</div>
          )}
        </div>
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
          style={{ background: `${color}18` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      {sub && <div className="mt-1 text-[0.6rem] text-foreground/45">{sub}</div>}
    </div>
  );
}

// ── Progress bar ──
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Event icon map ──
const EVENT_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  enter_phase: { label: "Vào phòng", icon: MapPin, color: "#4ade80" },
  open_exhibit: { label: "Mở hiện vật", icon: Eye, color: "#e89446" },
  bookmark: { label: "Yêu thích", icon: Bookmark, color: "#ff9eb5" },
  quiz: { label: "Trắc nghiệm", icon: GraduationCap, color: "#e8b53a" },
  exit: { label: "Thoát", icon: Activity, color: "#e879f9" },
};

// ── Main component ──
export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (e) {
      setError("Không thể tải dữ liệu thống kê");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (error && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
          <h2 className="mt-3 font-serif text-xl font-bold text-foreground">Lỗi kết nối</h2>
          <p className="mt-2 text-sm text-foreground/60">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground/10 px-5 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/20"
          >
            <RefreshCw className="h-4 w-4" /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  const s = stats;
  const hourlyData = s?.traffic.hourly.map((h) => ({ value: h.count })) ?? [];
  const dailyData = s?.traffic.daily.map((d) => ({ value: d.count })) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground/10">
              <BarChart3 className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground">Bảng điều khiển</h1>
              <p className="text-[0.6rem] uppercase tracking-[0.15em] text-foreground/40">
                Phân tích lưu lượng & tương tác
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] text-foreground/40">
              Cập nhật {timeAgo(lastRefresh)}
            </span>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="grid h-8 w-8 place-items-center rounded-lg border border-foreground/15 text-foreground/60 transition hover:border-foreground/30 hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Overview cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            icon={Users}
            label="Tổng lượt truy cập"
            value={loading ? "—" : fmtNum(s?.overview.totalVisits ?? 0)}
            sub="Tất cả các thời điểm"
            color="#e89446"
            loading={loading}
          />
          <StatCard
            icon={Zap}
            label="Đang truy cập"
            value={loading ? "—" : s?.overview.activeVisits ?? 0}
            sub="Hiện tại"
            color="#4ade80"
            loading={loading}
          />
          <StatCard
            icon={TrendingUp}
            label="Cao nhất (giờ)"
            value={loading ? "—" : s?.traffic.peakConcurrent ?? 0}
            sub="Người dùng đồng thời"
            color="#e879f9"
            loading={loading}
          />
          <StatCard
            icon={Clock}
            label="Thời gian TB"
            value={loading ? "—" : s ? fmtDuration(s.overview.avgDuration) : "—"}
            sub="Mỗi lượt truy cập"
            color="#00d4aa"
            loading={loading}
          />
          <StatCard
            icon={Eye}
            label="Hiện vật đã xem"
            value={loading ? "—" : fmtNum(s?.engagement.totalExhibitsSeen ?? 0)}
            sub="Tổng số"
            color="#e8b53a"
            loading={loading}
          />
          <StatCard
            icon={Activity}
            label="Sự kiện"
            value={loading ? "—" : fmtNum(s?.overview.totalEvents ?? 0)}
            sub="Tương tác"
            color="#ff9eb5"
            loading={loading}
          />
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Traffic sparkline */}
          <div className="rounded-xl border border-foreground/10 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">
                  Lưu lượng (7 ngày qua)
                </div>
                <div className="mt-1 font-serif text-xl font-bold text-foreground">
                  {loading ? "—" : fmtNum(s?.overview.totalVisits ?? 0)}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-foreground/50">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#e89446" }} />
                Lượt truy cập
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <div className="h-10 animate-pulse rounded bg-foreground/10" />
              ) : (
                <Sparkline data={hourlyData} color="#e89446" height={48} />
              )}
            </div>
          </div>

          {/* Bar chart */}
          <div className="rounded-xl border border-foreground/10 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">
                  Lưu lượng hàng ngày (30 ngày)
                </div>
                <div className="mt-1 font-serif text-xl font-bold text-foreground">
                  {loading ? "—" : fmtNum(dailyData.reduce((a, b) => a + b.value, 0))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-foreground/50">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#e8b53a" }} />
                Lượt/ngày
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <div className="h-12 animate-pulse rounded bg-foreground/10" />
              ) : (
                <MiniBarChart
                  data={dailyData.map((d) => ({ label: d.date, value: d.value }))}
                  color="#e8b53a"
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Visit modes */}
          <div className="rounded-xl border border-foreground/10 bg-card p-5">
            <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">
              Chế độ tham quan
            </div>
            <div className="mt-3 space-y-2.5">
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-foreground/10" />
                  ))
                : Object.entries(s?.modes ?? {}).map(([mode, count]) => {
                    const total = s?.overview.totalVisits ?? 1;
                    const pct = Math.round((count / total) * 100);
                    const label = mode === "guided" ? "Có hướng dẫn" : "Tự do";
                    const color = mode === "guided" ? "#4ade80" : "#e89446";
                    return (
                      <div key={mode}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-foreground/70">{label}</span>
                          <span className="font-medium text-foreground">
                            {count.toLocaleString()}
                            <span className="text-foreground/40"> ({pct}%)</span>
                          </span>
                        </div>
                        <ProgressBar value={count} max={total} color={color} />
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Event breakdown */}
          <div className="rounded-xl border border-foreground/10 bg-card p-5">
            <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">
              Sự kiện tương tác
            </div>
            <div className="mt-3 space-y-2.5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-7 animate-pulse rounded bg-foreground/10" />
                  ))
                : Object.entries(s?.events ?? {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([kind, count]) => {
                      const info = EVENT_LABELS[kind] ?? {
                        label: kind,
                        icon: Activity,
                        color: "#888",
                      };
                      const total = s?.overview.totalEvents ?? 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={kind} className="flex items-center gap-2.5">
                          <info.icon className="h-3.5 w-3.5 shrink-0" style={{ color: info.color }} />
                          <span className="flex-1 text-xs text-foreground/70">{info.label}</span>
                          <span className="text-xs font-medium text-foreground">
                            {count.toLocaleString()}
                          </span>
                          <span className="w-8 text-right text-[0.55rem] text-foreground/40">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
            </div>
          </div>

          {/* Engagement */}
          <div className="rounded-xl border border-foreground/10 bg-card p-5">
            <div className="text-[0.6rem] uppercase tracking-[0.18em] text-foreground/45">
              Tương tác & Phản hồi
            </div>
            <div className="mt-4 space-y-4">
              {loading ? (
                <>
                  <div className="h-10 animate-pulse rounded bg-foreground/10" />
                  <div className="h-10 animate-pulse rounded bg-foreground/10" />
                  <div className="h-10 animate-pulse rounded bg-foreground/10" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4 text-foreground/40" />
                      <span className="text-xs text-foreground/70">Lưu bút</span>
                    </div>
                    <span className="font-serif text-lg font-bold text-foreground">
                      {s?.engagement.guestbookEntries ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-4 w-4 text-foreground/40" />
                      <span className="text-xs text-foreground/70">Trắc nghiệm đã vượt</span>
                    </div>
                    <span className="font-serif text-lg font-bold text-foreground">
                      {s?.engagement.quizzesPassed ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="h-4 w-4 text-foreground/40" />
                      <span className="text-xs text-foreground/70">Phản hồi</span>
                    </div>
                    <div className="text-right">
                      {Object.entries(s?.feedback ?? {}).length > 0 ? (
                        Object.entries(s.feedback).map(([kind, count]) => (
                          <div key={kind} className="text-xs text-foreground/60">
                            {kind === "bug" ? "Lỗi" : kind === "idea" ? "Ý tưởng" : "Khen"}:{" "}
                            <span className="font-medium text-foreground">{count}</span>
                          </div>
                        ))
                      ) : (
                        <span className="font-serif text-lg font-bold text-foreground">0</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-foreground/10 pt-4 text-center text-[0.55rem] uppercase tracking-[0.2em] text-foreground/30">
          Bảng điều khiển quản trị · Bảo tàng Atrium · Tự động cập nhật mỗi 30 giây
        </div>
      </main>
    </div>
  );
}
