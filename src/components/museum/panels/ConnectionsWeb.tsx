"use client";

import { useState, useMemo } from "react";
import { Network, X, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { EXHIBITS, CONNECTIONS, PHASES, exhibitById, phaseById, Connection, TOTAL_EXHIBITS, TOTAL_CONNECTIONS } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";

const ROW_W = 4; // exhibits per phase row
const NODE_GAP_X = 90;
const NODE_GAP_Y = 110;
const PAD_X = 70;
const PAD_Y = 60;

interface Pos { x: number; y: number; }

export function ConnectionsWeb() {
  const open = useMuseum((s) => s.connectionsOpen);
  const setOpen = useMuseum((s) => s.setConnectionsOpen);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const seenExhibits = useMuseum((s) => s.seenExhibits);
  const [activeConn, setActiveConn] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  const positions = useMemo<Record<string, Pos>>(() => {
    const map: Record<string, Pos> = {};
    EXHIBITS.forEach((e) => {
      const phase = phaseById(e.phase)!;
      const row = PHASES.findIndex((p) => p.id === e.phase);
      const phaseExhibits = EXHIBITS.filter((ex) => ex.phase === e.phase);
      const col = phaseExhibits.findIndex((ex) => ex.id === e.id);
      map[e.id] = {
        x: PAD_X + col * NODE_GAP_X,
        y: PAD_Y + row * NODE_GAP_Y,
      };
    });
    return map;
  }, []);

  const W = PAD_X * 2 + (ROW_W - 1) * NODE_GAP_X;
  const H = PAD_Y * 2 + (PHASES.length - 1) * NODE_GAP_Y;

  const visibleConns = activeConn
    ? CONNECTIONS.filter((c) => c.id === activeConn)
    : CONNECTIONS;

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogContent className="!max-w-6xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-6xl">
        <DialogTitle className="sr-only">Mạng lưới liên kết xuyên thời gian</DialogTitle>
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Network className="h-4 w-4" style={{ color: "#00d4aa" }} />
            Mạch liên kết xuyên thời gian
          </div>
          <span className="text-[0.65rem] text-foreground/45">
            {TOTAL_CONNECTIONS} mạch · {TOTAL_EXHIBITS} hiện vật · bấm để nhấn mạnh
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px]">
          {/* SVG graph */}
          <div className="overflow-x-auto elegant-scroll p-3">
            <svg width={W} height={H} className="mx-auto" style={{ minWidth: W }}>
              <defs>
                {CONNECTIONS.map((c) => (
                  <linearGradient key={c.id} id={`grad-${c.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c.color} stopOpacity={activeConn && activeConn !== c.id ? 0.1 : 0.7} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={activeConn && activeConn !== c.id ? 0.1 : 0.3} />
                  </linearGradient>
                ))}
              </defs>

              {/* phase row labels */}
              {PHASES.map((p, i) => (
                <text
                  key={p.id}
                  x={16}
                  y={PAD_Y + i * NODE_GAP_Y + 4}
                  fontSize="10"
                  fill={p.accent}
                  fontFamily="serif"
                  fontWeight="bold"
                >
                  {p.label}
                </text>
              ))}

              {/* connections (curves) */}
              {visibleConns.map((c) => (
                <g key={c.id}>
                  {c.exhibitIds.slice(0, -1).map((id, i) => {
                    const from = positions[id];
                    const to = positions[c.exhibitIds[i + 1]];
                    if (!from || !to) return null;
                    const mx = (from.x + to.x) / 2;
                    const my = (from.y + to.y) / 2 - 30;
                    return (
                      <path
                        key={`${c.id}-${i}`}
                        d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                        fill="none"
                        stroke={`url(#grad-${c.id})`}
                        strokeWidth={activeConn === c.id ? 2.5 : 1.2}
                        opacity={activeConn && activeConn !== c.id ? 0.12 : 1}
                      />
                    );
                  })}
                </g>
              ))}

              {/* nodes */}
              {EXHIBITS.map((e) => {
                const pos = positions[e.id];
                const phase = phaseById(e.phase)!;
                const seen = seenExhibits.includes(e.id);
                const inActive =
                  activeConn &&
                  CONNECTIONS.find((c) => c.id === activeConn)?.exhibitIds.includes(e.id);
                const dimmed = activeConn && !inActive;
                return (
                  <g
                    key={e.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverNode(e.id)}
                    onMouseLeave={() => setHoverNode(null)}
                    onClick={() => {
                      setOpen(false);
                      openExhibit(e.id);
                    }}
                  >
                    <circle
                      r={hoverNode === e.id ? 16 : 12}
                      fill={phase.accent}
                      fillOpacity={dimmed ? 0.15 : seen ? 0.85 : 0.4}
                      stroke={phase.accent}
                      strokeWidth={seen ? 2 : 1}
                      strokeOpacity={dimmed ? 0.2 : 0.9}
                      style={{ transition: "r 0.15s ease" }}
                    />
                    {seen && (
                      <circle r={5} fill="#fff" fillOpacity={dimmed ? 0.1 : 0.9} />
                    )}
                  </g>
                );
              })}

              {/* hover tooltip */}
              {hoverNode && (() => {
                const e = exhibitById(hoverNode)!;
                const pos = positions[hoverNode];
                const phase = phaseById(e.phase)!;
                return (
                  <g transform={`translate(${pos.x}, ${pos.y - 24})`}>
                    <rect
                      x={-(e.name.length * 3 + 8)}
                      y={-16}
                      width={e.name.length * 6 + 16}
                      height={20}
                      rx={6}
                      fill="#1a0f08"
                      stroke={phase.accent}
                      strokeOpacity={0.4}
                    />
                    <text
                      x={0}
                      y={-2}
                      fontSize="10"
                      fill="#fff"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {e.name}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* legend */}
          <div className="border-t border-foreground/10 p-3 lg:border-l lg:border-t-0">
            <div className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-foreground/40">
              Chọn một mạch
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveConn(null)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                  !activeConn ? "bg-foreground/10" : "hover:bg-foreground/[0.04]"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/40" />
                <span className="text-foreground/70">Tất cả mạch</span>
              </button>
              {CONNECTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConn(activeConn === c.id ? null : c.id)}
                  className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left transition ${
                    activeConn === c.id ? "bg-foreground/10" : "hover:bg-foreground/[0.04]"
                  }`}
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-foreground/85">{c.name}</span>
                    <span className="block text-[0.6rem] text-foreground/45">
                      {c.exhibitIds.length} hiện vật
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {activeConn && (
              <div className="mt-3 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3">
                {(() => {
                  const c = CONNECTIONS.find((x) => x.id === activeConn)!;
                  return (
                    <>
                      <div className="text-[0.6rem] uppercase tracking-[0.15em]" style={{ color: c.color }}>
                        {c.name}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/70">{c.description}</p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
