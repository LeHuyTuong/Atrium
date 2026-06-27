"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { InteractiveBlock, ComparisonColumn, RoadmapStage, ConceptNode } from "@/lib/knowledge-data";

function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as any)[name] ?? Icons.Circle;
  return <I className={className} />;
}

export function InteractiveRenderer({ block, accent }: { block: InteractiveBlock; accent: string }) {
  if (block.kind === "comparison-table") return <ComparisonTable block={block} columns={block.columns ?? []} accent={accent} />;
  if (block.kind === "roadmap-timeline") return <RoadmapTimeline block={block} stages={block.stages ?? []} accent={accent} />;
  if (block.kind === "concept-map") return <ConceptMap block={block} nodes={block.nodes ?? []} accent={accent} />;
  return null;
}

function BlockShell({ block, accent, children }: { block: InteractiveBlock; accent: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-8 rounded-2xl border border-foreground/12 bg-foreground/[0.02] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
        <Icons.Sparkles className="h-3.5 w-3.5" style={{ color: accent }} /> Tương tác
      </div>
      <h3 className="mb-5 font-serif text-lg font-bold text-foreground sm:text-xl">{block.title}</h3>
      {children}
    </motion.div>
  );
}

function ComparisonTable({ block, columns, accent }: { block: InteractiveBlock; columns: ComparisonColumn[]; accent: string }) {
  const featureLabels = columns[0]?.features.map((f) => f.label) ?? [];
  return (
    <BlockShell block={block} accent={accent}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {columns.map((col, i) => (
            <div key={i} className="overflow-hidden rounded-xl border" style={{ borderColor: `${col.accent}44`, background: `${col.accent}08` }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ background: `${col.accent}18` }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: col.accent }}>{col.label}</div>
                  <div className="text-[0.65rem] uppercase tracking-[0.12em] text-foreground/50">{col.period}</div>
                </div>
              </div>
              <div className="divide-y divide-foreground/8">
                {col.features.map((f, j) => (
                  <div key={j} className="px-4 py-2">
                    <div className="text-[0.6rem] uppercase tracking-[0.12em] text-foreground/45">{f.label}</div>
                    <div className="mt-0.5 text-xs text-foreground/80">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-foreground/10 sm:block">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-32 border-b border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-left text-[0.65rem] uppercase tracking-[0.12em] text-foreground/50">Tiêu chí</th>
                {columns.map((col, i) => (
                  <th key={i} className="border-b border-foreground/10 px-4 py-3 text-left" style={{ background: `${col.accent}12` }}>
                    <div className="text-sm font-bold" style={{ color: col.accent }}>{col.label}</div>
                    <div className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-foreground/50">{col.period}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((label, rowIdx) => (
                <tr key={rowIdx} className="border-b border-foreground/8 last:border-0">
                  <td className="px-4 py-3 text-xs font-semibold text-foreground/65">{label}</td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-xs leading-relaxed text-foreground/80">{col.features[rowIdx]?.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BlockShell>
  );
}

function RoadmapTimeline({ block, stages, accent }: { block: InteractiveBlock; stages: RoadmapStage[]; accent: string }) {
  return (
    <BlockShell block={block} accent={accent}>
      <div className="relative">
        <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-foreground/12 md:block">
          <div className="h-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)`, width: "100%" }} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-3">
          {stages.map((stage, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.4 }} className="relative">
              <div className="relative z-10 mb-3 flex items-center gap-3 md:flex-col md:items-start">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 bg-card" style={{ borderColor: accent, color: accent }}>
                  <DynIcon name={stage.icon} className="h-5 w-5" />
                </div>
                <span className="font-serif text-2xl font-bold md:hidden" style={{ color: accent }}>{stage.step}</span>
              </div>
              <div className="rounded-xl border bg-card/60 p-4 transition hover:bg-card" style={{ borderColor: `${accent}33` }}>
                <div className="flex items-center gap-2">
                  <span className="hidden font-serif text-lg font-bold md:inline" style={{ color: accent }}>{stage.step}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.12em] text-foreground/50">{stage.label}</span>
                </div>
                <h4 className="mt-1 text-sm font-semibold text-foreground/90">{stage.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/65">{stage.description}</p>
              </div>
              {i < stages.length - 1 && (
                <div className="absolute -right-3 top-5 hidden md:block">
                  <ChevronRight className="h-4 w-4 text-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

function ConceptMap({ block, nodes, accent }: { block: InteractiveBlock; nodes: ConceptNode[]; accent: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const grid: Record<string, ConceptNode> = {};
  for (const n of nodes) grid[`${n.col}-${n.row}`] = n;
  const selectedNode = nodes.find((n) => n.id === selected);
  return (
    <BlockShell block={block} accent={accent}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => {
              const node = grid[`${col}-${row}`];
              const key = `${col}-${row}`;
              if (!node) return <div key={key} className="aspect-[4/3]" />;
              const nodeAccent = node.accent ?? accent;
              const isHovered = hovered === node.id;
              const isSelected = selected === node.id;
              const dim = (hovered || selected) && !isHovered && !isSelected && !node.isCenter;
              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (row * 3 + col) * 0.08, duration: 0.3 }}
                  onClick={() => setSelected(isSelected ? null : node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative aspect-[4/3] rounded-lg border p-2 text-left transition-all"
                  style={{
                    borderColor: node.isCenter ? nodeAccent : isSelected || isHovered ? nodeAccent : "oklch(0.5 0.02 60 / 0.18)",
                    background: node.isCenter ? `${nodeAccent}22` : isSelected || isHovered ? `${nodeAccent}14` : "oklch(0.5 0.02 60 / 0.04)",
                    opacity: dim ? 0.4 : 1,
                    boxShadow: node.isCenter ? `0 0 20px ${nodeAccent}33` : "none",
                  }}
                >
                  {node.isCenter && (
                    <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full text-[0.5rem] font-bold" style={{ background: nodeAccent, color: "#1a0f08" }}>★</span>
                  )}
                  <div className="text-[0.55rem] font-bold uppercase leading-tight" style={{ color: nodeAccent }}>{node.isCenter ? "Trung tâm" : node.id.toUpperCase()}</div>
                  <div className="mt-0.5 text-[0.7rem] font-semibold leading-tight text-foreground/85">{node.label}</div>
                </motion.button>
              );
            })
          )}
        </div>
        <div className="flex flex-col">
          {selectedNode ? (
            <motion.div key={selectedNode.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4" style={{ borderColor: `${selectedNode.accent ?? accent}44`, background: `${selectedNode.accent ?? accent}0a` }}>
              <div className="text-[0.6rem] uppercase tracking-[0.15em]" style={{ color: selectedNode.accent ?? accent }}>{selectedNode.isCenter ? "Khái niệm trung tâm" : "Biện pháp"}</div>
              <h4 className="mt-1 font-serif text-base font-bold text-foreground">{selectedNode.label}</h4>
              <p className="mt-2 text-xs leading-relaxed text-foreground/75">{selectedNode.description}</p>
              <button onClick={() => setSelected(null)} className="mt-3 text-[0.65rem] text-foreground/45 transition hover:text-foreground">✕ Đóng</button>
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-foreground/12 p-6 text-center">
              <Icons.MousePointerClick className="h-6 w-6 text-foreground/30" />
              <p className="mt-2 text-xs text-foreground/50">Bấm vào một nút để xem chi tiết</p>
              <p className="mt-1 text-[0.65rem] text-foreground/35">{nodes.filter((n) => !n.isCenter).length} biện pháp + 1 trung tâm</p>
            </div>
          )}
        </div>
      </div>
    </BlockShell>
  );
}
