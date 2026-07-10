"use client";

import { useState, useMemo } from "react";
import { Network } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { EXHIBITS, CONNECTIONS, PHASES, exhibitById, phaseById } from "@/lib/museum-data";
import { useMuseum } from "@/lib/store";
import { MotifIcon } from "@/components/museum/cards/MotifIcon";
import { imageForExhibit } from "@/lib/historical-images";

const ROW_W = 8;
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
  const [hoverData, setHoverData] = useState<{ id: string; x: number; y: number } | null>(null);

  const positions = useMemo<Record<string, Pos>>(() => {
    const map: Record<string, Pos> = {};
    EXHIBITS.forEach((e, i) => {
      const row = PHASES.findIndex((p) => p.id === e.phase);
      const col = i % ROW_W;
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
            9 mạch · 32 hiện vật · bấm để nhấn mạnh
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px]">
          {/* SVG graph container with dark theme */}
          <div className="overflow-x-auto elegant-scroll bg-[#0c0a09] min-h-[400px] flex items-center justify-start xl:justify-center p-8">
            <div className="relative shrink-0" style={{ width: W, height: H }}>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes dashFlow {
                  to { stroke-dashoffset: -30; }
                }
                .animate-flow {
                  animation: dashFlow 1.2s linear infinite;
                }
              `}} />
              
              <svg width={W} height={H} className="block absolute inset-0">
                <defs>
                  {/* Blueprint grid pattern */}
                  <pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1" fill="#ffffff" opacity="0.04" />
                  </pattern>
                  
                  {CONNECTIONS.map((c) => (
                    <linearGradient key={c.id} id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity={activeConn && activeConn !== c.id ? 0.05 : 0.8} />
                      <stop offset="100%" stopColor={c.color} stopOpacity={activeConn && activeConn !== c.id ? 0.05 : 0.2} />
                    </linearGradient>
                  ))}
                </defs>

                {/* Background grid */}
                <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

                {/* phase row labels */}
                {PHASES.map((p, i) => (
                  <text
                    key={p.id}
                    x={16}
                    y={PAD_Y + i * NODE_GAP_Y + 4}
                    fontSize="10"
                    fill={p.accent}
                    opacity={0.6}
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {p.label}
                  </text>
                ))}

                {/* connections (cubic bezier curves) */}
                {visibleConns.map((c) => {
                  const isActive = activeConn === c.id;
                  const isFaded = activeConn && !isActive;
                  return (
                    <g key={c.id}>
                      {c.exhibitIds.slice(0, -1).map((id, i) => {
                        const from = positions[id];
                        const to = positions[c.exhibitIds[i + 1]];
                        if (!from || !to) return null;
                        
                        const distY = Math.abs(to.y - from.y);
                        // tension depends on vertical distance
                        const tension = Math.max(30, distY * 0.45);
                        // For left-to-right flow if on the same row, tension in X
                        const isSameRow = from.y === to.y;
                        let pathD = "";
                        if (isSameRow) {
                          const tensionX = Math.abs(to.x - from.x) * 0.25;
                          pathD = `M ${from.x} ${from.y} C ${from.x + tensionX} ${from.y - 35}, ${to.x - tensionX} ${to.y - 35}, ${to.x} ${to.y}`;
                        } else {
                          // vertical flow
                          pathD = `M ${from.x} ${from.y} C ${from.x} ${from.y + tension}, ${to.x} ${to.y - tension}, ${to.x} ${to.y}`;
                        }

                        return (
                          <g key={`${c.id}-${i}`}>
                            {/* Base thick glow path */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke={`url(#grad-${c.id})`}
                              strokeWidth={isActive ? 6 : 2}
                              opacity={isFaded ? 0.05 : (isActive ? 0.4 : 0.6)}
                              strokeLinecap="round"
                            />
                            {/* Inner bright line */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke={c.color}
                              strokeWidth={isActive ? 2 : 1}
                              opacity={isFaded ? 0.1 : 0.8}
                              strokeLinecap="round"
                            />
                            {/* Animated flow (only when active) */}
                            {isActive && (
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth={1.5}
                                strokeDasharray="4 26"
                                strokeLinecap="round"
                                className="animate-flow"
                                opacity={0.9}
                              />
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* HTML Nodes overlay */}
              {EXHIBITS.map((e) => {
                const pos = positions[e.id];
                const phase = phaseById(e.phase)!;
                const seen = seenExhibits.includes(e.id);
                const img = imageForExhibit(e.id);
                const inActive =
                  activeConn &&
                  CONNECTIONS.find((c) => c.id === activeConn)?.exhibitIds.includes(e.id);
                const isHovered = hoverData?.id === e.id;
                const dimmed = activeConn && !inActive;
                
                const size = isHovered ? 52 : 36;
                
                return (
                  <div
                    key={e.id}
                    className="absolute z-40 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-xl overflow-hidden group"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: size,
                      height: size,
                      transform: "translate(-50%, -50%)",
                      border: `${seen ? 2 : 1}px ${seen ? 'solid' : 'dashed'} ${phase.accent}`,
                      opacity: dimmed ? 0.25 : 1,
                      boxShadow: isHovered ? `0 0 25px ${phase.accent}60` : (seen ? `0 0 10px ${phase.accent}20` : "none"),
                      background: img?.imageUrl ? `url(${img.imageUrl}) center/cover` : (img?.gradient || "#111"),
                      backgroundColor: "#111", // fallback
                    }}
                    onMouseEnter={() => setHoverData({ id: e.id, x: pos.x, y: pos.y })}
                    onMouseLeave={() => setHoverData(null)}
                    onClick={() => {
                      setOpen(false);
                      openExhibit(e.id);
                    }}
                  >
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-black/50 transition-opacity group-hover:bg-black/30" />
                    
                    {/* Motif Icon */}
                    <div className="relative z-10 text-white/90 drop-shadow-md">
                      <MotifIcon motif={e.motif} className={isHovered ? "w-6 h-6" : "w-4 h-4"} style={{ transition: "all 0.3s ease" }} />
                    </div>
                  </div>
                );
              })}

              {/* HTML Tooltip (Absolute overlay) */}
              {hoverData && (() => {
                const e = exhibitById(hoverData.id)!;
                const phase = phaseById(e.phase)!;
                return (
                  <div 
                    className="pointer-events-none absolute z-50 flex flex-col items-center justify-center rounded-lg border bg-black/80 px-3 py-1.5 backdrop-blur-md shadow-xl transition-all duration-150"
                    style={{
                      left: hoverData.x,
                      top: hoverData.y - 20,
                      transform: "translate(-50%, -100%)",
                      borderColor: `${phase.accent}55`,
                    }}
                  >
                    <span className="whitespace-nowrap text-[10px] uppercase tracking-widest" style={{ color: phase.accent }}>
                      {phase.label}
                    </span>
                    <span className="whitespace-nowrap font-serif text-sm font-semibold text-white">
                      {e.name}
                    </span>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* legend (right sidebar) */}
          <div className="border-t border-foreground/10 p-3 lg:border-l lg:border-t-0 bg-card">
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
              <div className="mt-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3.5 shadow-sm">
                {(() => {
                  const c = CONNECTIONS.find((x) => x.id === activeConn)!;
                  return (
                    <>
                      <div className="text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: c.color }}>
                        {c.name}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/75">{c.description}</p>
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
