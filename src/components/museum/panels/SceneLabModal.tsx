"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical, ExternalLink, ArrowLeft, RotateCcw, Info } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Sparkles,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { useMuseum } from "@/lib/store";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";
import {
  ExplodedSteamEngine,
  STEAM_PARTS,
  type SteamPartId,
} from "@/components/museum/3d/SceneLabModels";

const ACCENT = "#e89446";

/* ---------- 3D stage (Canvas + lights + pedestal) ---------- */

function Pedestal() {
  return (
    <group position={[0, -1.05, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 48]} />
        <meshStandardMaterial color="#2a1c10" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.18, 48]} />
        <meshStandardMaterial color="#1f1408" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.4, 1.45, 0.16, 48]} />
        <meshStandardMaterial color="#170e06" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 64]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.24, 64]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

function SpotlightCone() {
  return (
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.0, 4.2, 32, 1, true]} />
      <meshBasicMaterial
        color={ACCENT}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function SceneLabCanvas({
  explode,
  highlightedPart,
}: {
  explode: number;
  highlightedPart: SteamPartId | null;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.8, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#fff5d8", "#3a2410", 0.4]} />
        <spotLight
          position={[0, 6, 2]}
          angle={0.5}
          penumbra={0.8}
          intensity={5}
          color="#fff5d8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 1.5, -2]} intensity={1.2} color={ACCENT} />
        <pointLight position={[3, -0.5, 2]} intensity={0.8} color="#ffcf80" />
        <pointLight position={[0, 1, 4]} intensity={0.6} color="#fff5e0" />
        <directionalLight position={[2, 4, 3]} intensity={0.6} color="#ffe9c0" />

        <SpotlightCone />

        <Float
          speed={reduced ? 0 : 1.2}
          rotationIntensity={reduced ? 0 : 0.18}
          floatIntensity={reduced ? 0 : 0.4}
          floatingRange={reduced ? [0, 0] : [-0.06, 0.06]}
        >
          <ExplodedSteamEngine explode={explode} highlightedPart={highlightedPart} />
        </Float>

        <Pedestal />

        <ContactShadows
          position={[0, -1.06, 0]}
          opacity={0.55}
          scale={7}
          blur={2.4}
          far={4}
          color="#000"
        />

        {!reduced && (
          <Sparkles
            count={48}
            scale={[6, 5, 6]}
            size={2}
            speed={0.3}
            opacity={0.5}
            color={ACCENT}
          />
        )}

        <Environment preset="sunset" environmentIntensity={0.25} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3.2}
          maxDistance={9}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={!reduced}
          autoRotateSpeed={0.4}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
}

/* ---------- Checklist row ---------- */

function PartRow({
  part,
  checked,
  onToggle,
}: {
  part: (typeof STEAM_PARTS)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="group flex w-full items-start gap-3 rounded-lg border border-foreground/8 bg-foreground/[0.02] p-3 text-left transition hover:border-foreground/20 hover:bg-foreground/[0.04]"
      style={checked ? { borderColor: `${ACCENT}66`, background: `${ACCENT}12` } : undefined}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle()}
          onClick={(e) => e.stopPropagation()}
          style={checked ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: ACCENT, opacity: checked ? 1 : 0.4 }}
          />
          <span
            className="truncate text-sm font-medium"
            style={{ color: checked ? ACCENT : "rgba(255,255,255,0.85)" }}
          >
            {part.label}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-foreground/55">{part.desc}</p>
      </div>
    </button>
  );
}

/* ---------- Main modal ---------- */

export function SceneLabModal() {
  const open = useMuseum((s) => s.sceneLabOpen);
  const setOpen = useMuseum((s) => s.setSceneLabOpen);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const setStage = useMuseum((s) => s.setStage);

  const [explode, setExplode] = useState(0);
  const [highlightedPart, setHighlightedPart] = useState<SteamPartId | null>(null);

  const handleClose = () => {
    setOpen(false);
    // reset state after exit animation
    window.setTimeout(() => {
      setExplode(0);
      setHighlightedPart(null);
    }, 250);
  };

  const openFullExhibit = () => {
    setOpen(false);
    window.setTimeout(() => {
      setExplode(0);
      setHighlightedPart(null);
      openExhibit("watt-steam");
    }, 200);
  };

  const backToRoom = () => {
    setOpen(false);
    window.setTimeout(() => {
      setExplode(0);
      setHighlightedPart(null);
      setStage("room");
    }, 200);
  };

  const resetAll = () => {
    setExplode(0);
    setHighlightedPart(null);
  };

  const subtitle =
    explode > 0.3
      ? "Kéo thanh trượt để tháo rời các bộ phận"
      : "Nhấp vào mô hình 3D để xem câu chuyện đầy đủ";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="!max-w-7xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-7xl">
        <DialogTitle className="sr-only">3D Scene Lab · Động cơ hơi nước Watt</DialogTitle>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid max-h-[92vh] grid-cols-1 overflow-y-auto elegant-scroll lg:grid-cols-[1.4fr_1fr] lg:overflow-hidden"
            >
              {/* LEFT: 3D canvas */}
              <div className="relative border-b border-foreground/10 lg:border-b-0 lg:border-r">
                <div
                  className="relative h-[55vh] w-full lg:h-[88vh]"
                  aria-label="Phòng thí nghiệm 3D động cơ hơi nước Watt"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 60% at 50% 28%, " +
                        ACCENT +
                        "22 0%, transparent 55%), linear-gradient(180deg, #1a0f08 0%, #100804 100%)",
                    }}
                  />
                  <SceneLabCanvas explode={explode} highlightedPart={highlightedPart} />
                  <div className="pointer-events-none absolute inset-0 vignette-overlay" />
                  {/* top-left badge */}
                  <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/55 px-3 py-1.5 backdrop-blur-md">
                    <FlaskConical className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                    <span className="text-[0.62rem] uppercase tracking-[0.2em] text-amber-100/85">
                      Scene Lab
                    </span>
                  </div>
                  {/* hint */}
                  <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                    Kéo để xoay · Cuộn để phóng to
                  </div>
                </div>
              </div>

              {/* RIGHT: control panel */}
              <div className="flex flex-col overflow-y-auto elegant-scroll p-5 sm:p-7 lg:max-h-[88vh]">
                {/* header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.28em] text-amber-300/85">
                      3D Scene Lab · Industry 1.0
                    </div>
                    <h2 className="mt-1.5 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                      Động cơ hơi nước Watt
                    </h2>
                    <p className="mt-1.5 text-xs italic text-foreground/55">{subtitle}</p>
                  </div>
                  <button
                    onClick={resetAll}
                    title="Đặt lại"
                    aria-label="Đặt lại"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/15 text-foreground/65 transition hover:border-foreground/30 hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                {/* slider */}
                <div className="mt-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.18em] text-foreground/50">
                      Trạng thái lắp ráp
                    </span>
                    <span
                      className="font-serif text-base font-bold"
                      style={{ color: ACCENT }}
                    >
                      {Math.round(explode * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[explode * 100]}
                    onValueChange={(v) => setExplode(v[0] / 100)}
                    min={0}
                    max={100}
                    step={1}
                    aria-label="Mức độ tháo rời"
                  />
                  <div className="mt-2 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-foreground/45">
                    <span>Lắp ráp</span>
                    <span>Tháo rời</span>
                  </div>
                </div>

                {/* hint callout */}
                <div
                  className="mt-4 flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed text-foreground/70"
                  style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} />
                  <span>
                    Tích chọn một bộ phận để làm nổi bật — các bộ phận khác sẽ mờ đi.
                    Kéo thanh trượt qua 30% để hiện nhãn tên từng phần.
                  </span>
                </div>

                {/* parts checklist */}
                <div className="mt-5">
                  <div className="mb-2 text-[0.62rem] uppercase tracking-[0.22em] text-foreground/50">
                    Bộ phận ({STEAM_PARTS.length})
                  </div>
                  <div className="grid max-h-[42vh] grid-cols-1 gap-2 overflow-y-auto elegant-scroll pr-1 sm:grid-cols-2 lg:max-h-[40vh]">
                    {STEAM_PARTS.map((p) => (
                      <PartRow
                        key={p.id}
                        part={p}
                        checked={highlightedPart === p.id}
                        onToggle={() =>
                          setHighlightedPart((cur) => (cur === p.id ? null : p.id))
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* footer actions */}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <button
                    onClick={openFullExhibit}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-background transition hover:gap-2"
                    style={{ background: ACCENT }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Mở hiện vật đầy đủ
                  </button>
                  <button
                    onClick={backToRoom}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2.5 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Quay về phòng
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
