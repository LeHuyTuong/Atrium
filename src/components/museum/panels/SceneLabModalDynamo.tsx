"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import {
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FlaskConical,
  ExternalLink,
  ArrowLeft,
  RotateCcw,
  Info,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { useMuseum } from "@/lib/store";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";
import { useDynamoStore } from "@/components/dynamo/useDynamoStore";
import Dynamo3D from "@/components/dynamo/Dynamo3D";
import { DYNAMO_PARTS, DynamoPartId } from "@/components/dynamo/dynamo-parts-data";

const ACCENT = "#e8b53a"; // Phase 2.0 color

const SCENE_LAB_PARTS = DYNAMO_PARTS;

/* ------------------------------------------------------------------ */
/*  3-D CANVAS                                                         */
/* ------------------------------------------------------------------ */
function SceneLabCanvas3D({ reduced }: { reduced: boolean }) {
  const rotationSpeed = useDynamoStore((s) => s.rotationSpeed);
  const isGenerating = useDynamoStore((s) => s.isGenerating);
  const explode = useDynamoStore((s) => s.explodedAmount);
  const highlightPart = useDynamoStore((s) => s.highlightPart);

  // Derive visible and labels based on highlightPart
  const visible = {
    housing: highlightPart === null || highlightPart === "housing",
    magnets: highlightPart === null || highlightPart === "magnets",
    armature: highlightPart === null || highlightPart === "armature",
    windings: highlightPart === null || highlightPart === "windings",
    commutator: highlightPart === null || highlightPart === "commutator",
    brushes: highlightPart === null || highlightPart === "brushes",
    shaft: highlightPart === null || highlightPart === "shaft",
    bearings: highlightPart === null || highlightPart === "bearings",
    terminals: highlightPart === null || highlightPart === "terminals",
  };

  const labels = {
    housing: highlightPart === "housing",
    magnets: highlightPart === "magnets",
    armature: highlightPart === "armature",
    windings: highlightPart === "windings",
    commutator: highlightPart === "commutator",
    brushes: highlightPart === "brushes",
    shaft: highlightPart === "shaft",
    bearings: highlightPart === "bearings",
    terminals: highlightPart === "terminals",
  };

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [6, 3.5, 9], fov: 42, near: 0.1, far: 120 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0d0907"]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-6, 5, -3]} intensity={0.55} color="#a3c4e0" />
        <directionalLight position={[0, 3, -9]} intensity={0.9} color="#fbbf24" />
        <pointLight position={[0, -5, 0]} intensity={0.35} color="#ffffff" distance={14} />

        <group position={[0, 1.0, 0]}>
          <Dynamo3D 
            rotationSpeed={rotationSpeed} 
            isGenerating={isGenerating} 
            visible={visible} 
            labels={labels} 
            explode={explode} 
          />

          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.7}
            scale={16}
            blur={2.5}
            far={6}
            color="#000000"
          />
        </group>

        {!reduced && (
          <Sparkles
            count={36}
            scale={[10, 7, 10]}
            size={2}
            speed={0.25}
            opacity={0.35}
            color={ACCENT}
          />
        )}

        <Environment preset="warehouse" environmentIntensity={0.2} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
          autoRotate={!reduced && rotationSpeed > 0 && explode === 0}
          autoRotateSpeed={0.5}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/*  CHECKLIST ROW                                                       */
/* ------------------------------------------------------------------ */
function PartRow({
  part,
  checked,
  onToggle,
}: {
  part: (typeof SCENE_LAB_PARTS)[number];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-foreground/8 bg-foreground/[0.02] p-3 text-left transition hover:border-foreground/20 hover:bg-foreground/[0.04]"
      style={checked ? { borderColor: `${ACCENT}66`, background: `${ACCENT}12` } : undefined}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle()}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
        style={checked ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: part.accent, opacity: checked ? 1 : 0.4 }}
          />
          <span
            className="truncate text-sm font-medium"
            style={{ color: checked ? ACCENT : "oklch(0.5 0.02 60 / 0.9)" }}
          >
            {part.name.vi}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-foreground/55">{part.desc.vi}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  DYNAMO MODAL                                                      */
/* ------------------------------------------------------------------ */
export function SceneLabModalDynamo() {
  const open = useMuseum((s) => s.sceneLabOpen);
  const setOpen = useMuseum((s) => s.setSceneLabOpen);
  const openExhibit = useMuseum((s) => s.openExhibit);
  const setStage = useMuseum((s) => s.setStage);
  const reduced = usePrefersReducedMotion();

  const explodedAmount = useDynamoStore((s) => s.explodedAmount);
  const setExplodedAmount = useDynamoStore((s) => s.setExplodedAmount);
  const highlightPart = useDynamoStore((s) => s.highlightPart);
  const setHighlightPart = useDynamoStore((s) => s.setHighlightPart);
  const rotationSpeed = useDynamoStore((s) => s.rotationSpeed);
  const setRotationSpeed = useDynamoStore((s) => s.setRotationSpeed);

  // Automatically pause rotation if exploded
  useEffect(() => {
    if (explodedAmount > 0 && rotationSpeed > 0) {
      setRotationSpeed(0);
    } else if (explodedAmount === 0 && rotationSpeed === 0) {
      setRotationSpeed(5);
    }
  }, [explodedAmount]);

  const resetAll = () => {
    useDynamoStore.setState({ explodedAmount: 0, manualExplode: false, highlightPart: null, rotationSpeed: 5 });
  };

  const openFullExhibit = () => {
    setOpen(false);
    window.setTimeout(() => {
      resetAll();
      openExhibit("dynamo");
    }, 200);
  };

  const backToRoom = () => {
    setOpen(false);
    window.setTimeout(() => {
      resetAll();
      setStage("room");
    }, 200);
  };

  const subtitle =
    explodedAmount > 0.3
      ? "Kéo thanh trượt để tháo rời các bộ phận"
      : "Nhấp vào mô hình 3D để xem cấu tạo bên trong";

  return (
      <DialogContent className="!max-w-7xl gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-card p-0 sm:max-w-7xl">
        <DialogTitle className="sr-only">3D Scene Lab · Máy phát điện Dynamo</DialogTitle>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid max-h-[92vh] grid-cols-1 overflow-y-auto elegant-scroll lg:grid-cols-[1.8fr_1fr] lg:overflow-hidden"
            >
              {/* LEFT: 3D canvas */}
              <div className="relative border-b border-foreground/10 lg:border-b-0 lg:border-r">
                <div
                  className="relative h-[55vh] w-full lg:h-[88vh]"
                  aria-label="Phòng thí nghiệm 3D Máy phát điện Dynamo"
                >
                  {/* Dark background gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 55% at 50% 25%, " +
                        ACCENT +
                        "18 0%, transparent 55%), linear-gradient(180deg, #100a06 0%, #0a0603 100%)",
                    }}
                  />
                  <SceneLabCanvas3D reduced={reduced} />
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
                      3D Scene Lab · Industry 2.0
                    </div>
                    <h2 className="mt-1.5 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                      Máy phát điện Dynamo
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

                {/* explode slider */}
                <div className="mt-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="uppercase tracking-[0.18em] text-foreground/50">
                      Trạng thái tháo rời
                    </span>
                    <span
                      className="font-serif text-base font-bold"
                      style={{ color: ACCENT }}
                    >
                      {Math.round(explodedAmount * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[explodedAmount * 100]}
                    onValueChange={(v) => setExplodedAmount(v[0] / 100)}
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
                    Kéo thanh trượt để quan sát chi tiết bên trong.
                  </span>
                </div>

                {/* parts checklist */}
                <div className="mt-5">
                  <div className="mb-2 text-[0.62rem] uppercase tracking-[0.22em] text-foreground/50">
                    Bộ phận ({SCENE_LAB_PARTS.length})
                  </div>
                  <div className="grid max-h-[42vh] grid-cols-1 gap-2 overflow-y-auto elegant-scroll pr-1 sm:grid-cols-2 lg:max-h-[40vh]">
                    {SCENE_LAB_PARTS.map((p) => (
                      <PartRow
                        key={p.id}
                        part={p}
                        checked={highlightPart === p.id}
                        onToggle={() =>
                          setHighlightPart(highlightPart === p.id ? null : (p.id as DynamoPartId))
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
  );
}
