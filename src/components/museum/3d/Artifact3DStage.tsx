"use client";

import { Suspense, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, ToneMapping } from "@react-three/postprocessing";
import * as THREE from "three";
import { ArtifactModel } from "./ArtifactModels";
import { Motif } from "@/lib/museum-data";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";
import { useIsDark } from "@/hooks/museum/use-is-dark";
import { X, Maximize2 } from "lucide-react";

interface StageProps {
  motif: Motif;
  accent: string;
  hero?: boolean;
  height?: number;
  interactive?: boolean;
}

const PART_INFO: Record<string, Record<string, { label: string; desc: string }>> = {
  loom: {
    frame: { label: "Khung gỗ", desc: "Khung sồi chịu lực — đỡ toàn bộ máy dệt, gồm các thanh dọc và ngang có giằng chéo." },
    spindles: { label: "Suốt chỉ", desc: "8 suốt quay đặc trưng của Spinning Jenny. Mỗi suốt kéo một sợi riêng, nhân năng suất lên 8 lần." },
    "drive-wheel": { label: "Bánh lái", desc: "Bánh quay lớn bằng gỗ — dẫn động toàn bộ cơ cấu thông qua tay quay, tạo chuyển động quay liên tục." },
    crank: { label: "Tay quay", desc: "Tay quay bằng gỗ — người thợ quay để vận hành máy. Một vòng quay = một chu kỳ kéo sợi." },
    roving: { label: "Sợi thô", desc: "Sợi len/bông sống (roving) được kéo dài và xe lại thành sợi mảnh, cuộn vào suốt." },
    shuttle: { label: "Con thoi", desc: "Mang sợi ngang qua lại giữa các sợi dọc, tạo nên mép vải. Đầu nhọn giúp luồn qua khe dệt." },
    heddles: { label: "Lá dệt", desc: "Khung kim loại có lỗ nhỏ — nâng/hạ sợi dọc tạo khe (shed) cho con thoi đi qua." },
    cloth: { label: "Vải thành phẩm", desc: "Vải đã dệt hoàn chỉnh, cuộn trên trục gỗ phía trước máy, sẵn sàng mang đi." },
  },
};

function Pedestal({ accent, dark }: { accent: string; dark: boolean }) {
  const top = dark ? "#2a1c10" : "#c9b896";
  const mid = dark ? "#1f1408" : "#b8a684";
  const base = dark ? "#170e06" : "#a8957a";
  return (
    <group position={[0, -1.05, 0]}>
      {/* top tier */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 48]} />
        <meshStandardMaterial color={top} metalness={0.4} roughness={0.6} />
      </mesh>
      {/* mid tier */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.25, 1.35, 0.18, 48]} />
        <meshStandardMaterial color={mid} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* base */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.4, 1.45, 0.16, 48]} />
        <meshStandardMaterial color={base} metalness={0.2} roughness={0.8} />
      </mesh>
      {/* glowing accent ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dark ? 1.2 : 0.7} side={THREE.DoubleSide} transparent opacity={dark ? 0.8 : 0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.24, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dark ? 0.6 : 0.35} side={THREE.DoubleSide} transparent opacity={dark ? 0.4 : 0.25} />
      </mesh>
    </group>
  );
}

function SpotlightCone({ accent }: { accent: string }) {
  return (
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.0, 4.2, 32, 1, true]} />
      <meshBasicMaterial color={accent} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SpinningWrapper({ children, spin }: { children: React.ReactNode; spin: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin && ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return <group ref={ref}>{children}</group>;
}

function StageCanvas({
  motif,
  accent,
  hero,
  dark,
  reduced,
  parts,
  selectedPart,
  setSelectedPart,
  fullscreen,
}: {
  motif: Motif;
  accent: string;
  hero?: boolean;
  dark: boolean;
  reduced: boolean;
  parts: Record<string, { label: string; desc: string }> | null;
  selectedPart: string | null;
  setSelectedPart: (id: string | null) => void;
  fullscreen: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.6, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <EffectComposer enableNormalPass={false} autoClear>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.15}
            luminanceSmoothing={0.08}
            intensity={dark ? 1.8 : 1.0}
            levels={6}
          />
          <ChromaticAberration
            offset={[0.002, 0.0005]}
            radialModulation={false}
            modulationOffset={0}
          />
          <ToneMapping adaptive luminanceThreshold={0.002} middleGrey={0.7} />
        </EffectComposer>

        <ambientLight intensity={dark ? 0.55 : 0.85} />
        <hemisphereLight args={["#fff5d8", dark ? "#3a2410" : "#8a6a3e", dark ? 0.4 : 0.6]} />
        <spotLight
          position={[0, 6, 2]}
          angle={0.5}
          penumbra={0.8}
          intensity={dark ? 5 : 3}
          color="#fff5d8"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 1.5, -2]} intensity={dark ? 1.2 : 0.6} color={accent} />
        <pointLight position={[3, -0.5, 2]} intensity={dark ? 0.8 : 0.4} color="#ffcf80" />
        <pointLight position={[0, 1, 4]} intensity={dark ? 0.6 : 0.3} color="#fff5e0" />
        <directionalLight position={[2, 4, 3]} intensity={dark ? 0.6 : 0.9} color="#ffe9c0" />

        <SpotlightCone accent={accent} />

        <Float
          speed={reduced ? 0 : 1.4}
          rotationIntensity={reduced ? 0 : 0.25}
          floatIntensity={reduced ? 0 : 0.5}
          floatingRange={reduced ? [0, 0] : [-0.08, 0.08]}
        >
          <SpinningWrapper spin={!reduced}>
            <group position={[0, 0.1, 0]} scale={hero ? 1.05 : 0.95}>
              <ArtifactModel
                motif={motif}
                accent={accent}
                spinning={!reduced}
                onPartClick={parts ? setSelectedPart : undefined}
                selectedPart={selectedPart}
              />
            </group>
          </SpinningWrapper>
        </Float>

        <Pedestal accent={accent} dark={dark} />

        <ContactShadows
          position={[0, -1.06, 0]}
          opacity={dark ? 0.55 : 0.25}
          scale={6}
          blur={2.4}
          far={4}
          color={dark ? "#000" : "#5a4222"}
        />

        {!reduced && (
          <Sparkles
            count={48}
            scale={[5, 4, 5]}
            size={2.5}
            speed={0.4}
            opacity={0.6}
            color={accent}
          />
        )}

        <Environment preset="sunset" environmentIntensity={0.35} />

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={fullscreen ? 1.6 : 2.6}
          maxDistance={fullscreen ? 10 : 6}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={!reduced}
          autoRotateSpeed={0.8}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
}

export function Artifact3DStage({ motif, accent, hero, height = 320, interactive = true }: StageProps) {
  const reduced = usePrefersReducedMotion();
  const dark = useIsDark();
  const bgTop = dark ? "#1a0f08" : "#f5ebd8";
  const bgBot = dark ? "#100804" : "#e8dcc4";

  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const parts = PART_INFO[motif] ?? null;
  const selectedData = parts && selectedPart ? parts[selectedPart] : null;

  const bgStyle = {
    background:
      "radial-gradient(ellipse 90% 60% at 50% 28%, " +
      accent +
      (dark ? "22" : "18") +
      " 0%, transparent 55%), linear-gradient(180deg, " +
      bgTop +
      " 0%, " +
      bgBot +
      " 100%)",
  };

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ height }}
        aria-label="Mô hình 3D hiện vật"
      >
        <div className="absolute inset-0" style={bgStyle} />
        {interactive && (
          <StageCanvas
            motif={motif}
            accent={accent}
            hero={hero}
            dark={dark}
            reduced={reduced}
            parts={parts}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            fullscreen={false}
          />
        )}

        <div className="pointer-events-none absolute inset-0 vignette-overlay rounded-xl" />

        {interactive && (
          <button
            onClick={() => setFullscreen(true)}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1.5 text-white/85 backdrop-blur-md transition hover:bg-black/75 hover:text-white"
            aria-label="Phóng to mô hình 3D toàn màn hình"
            title="Phóng to"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}

        {selectedData ? (
          <div className="absolute bottom-2 left-2 right-2 z-20 rounded-lg border border-amber-400/30 bg-black/85 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-[0.7rem] font-semibold text-amber-300">{selectedData.label}</span>
              <button
                onClick={() => setSelectedPart(null)}
                className="ml-auto rounded-full p-0.5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-foreground/70">
              {selectedData.desc}
            </p>
          </div>
        ) : parts ? (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Bấm vào bộ phận để xem chi tiết
          </div>
        ) : (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Kéo để xoay · Cuộn để phóng to
          </div>
        )}
      </div>

      {fullscreen && typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-auto fixed inset-0 z-[200]"
            role="dialog"
            aria-modal="true"
            aria-label="Mô hình 3D phóng to toàn màn hình"
          >
            <div className="absolute inset-0" style={bgStyle} />
            <StageCanvas
              motif={motif}
              accent={accent}
              hero={hero}
              dark={dark}
              reduced={reduced}
              parts={parts}
              selectedPart={selectedPart}
              setSelectedPart={setSelectedPart}
              fullscreen
            />
            <div className="pointer-events-none absolute inset-0 vignette-overlay" />

            <button
              onClick={() => setFullscreen(false)}
              className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/85 backdrop-blur-md transition hover:bg-black/75 hover:text-white"
              aria-label="Đóng chế độ phóng to"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </button>

            {selectedData ? (
              <div className="absolute bottom-6 left-1/2 z-20 w-full max-w-md -translate-x-1/2 rounded-lg border border-amber-400/30 bg-black/85 p-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">{selectedData.label}</span>
                  <button
                    onClick={() => setSelectedPart(null)}
                    className="ml-auto rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-white/70">{selectedData.desc}</p>
              </div>
            ) : (
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/50">
                {parts ? "Bấm vào bộ phận để xem chi tiết" : "Kéo để xoay · Cuộn để phóng to"}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
