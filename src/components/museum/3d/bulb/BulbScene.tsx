"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float, Sparkles, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { LightBulb } from "./LightBulb";
import { Annotations } from "./Annotations";
import { palette } from "./palette";
import type { BulbPart, BulbPartId } from "@/lib/bulb-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: BulbPartId | null;
  onPartClick: (id: BulbPartId) => void;
  showAnnotations: boolean;
  parts: BulbPart[];
  autoRotate: boolean;
  resetSignal: number;
  height?: number;
};

/** Mặt bàn gỗ — bóng đèn "đặt" trên này. */
function TableTop() {
  return (
    <group position={[0, -0.55, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={palette.tableWood} roughness={0.95} metalness={0} />
      </mesh>
      {/* ván gỗ — các khe sáng chạy ngang */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = (i - 6) * 0.85;
        return (
          <mesh key={i} position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[16, 0.035]} />
            <meshStandardMaterial color={palette.tableWoodLight} roughness={0.9} transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Bóng tiếp xúc dưới bóng đèn — mềm, ấm. */
function Grounding() {
  return (
    <ContactShadows
      position={[0, -0.53, 0]}
      opacity={0.55}
      scale={6}
      blur={2.6}
      far={3}
      color="#0e0a04"
    />
  );
}

export function BulbScene({
  playing,
  speed,
  selectedPart,
  onPartClick,
  showAnnotations,
  parts,
  autoRotate,
  resetSignal,
  height = 320,
}: Props) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (resetSignal > 0) controlsRef.current?.reset();
  }, [resetSignal]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
      {/* Background gradient + warm radial glow (vọng sáng từ bóng đèn) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 38%, #e8b53a22 0%, transparent 60%), linear-gradient(180deg, #1a1408 0%, #0c0804 100%)",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.5, 1.5, 3.0], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(palette.fogColor, 0.04);
        }}
      >
        {/* ===== Lights ===== */}
        <ambientLight intensity={0.4} color="#ffe9c2" />
        <hemisphereLight args={["#ffd9a0", "#2a160a", 0.45]} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.0}
          color="#fff0d0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0004}
        />
        {/* spotLight accent phía trên bóng đèn */}
        <spotLight
          position={[0, 3.5, 1.0]}
          angle={0.55}
          penumbra={0.7}
          intensity={1.3}
          color="#ffcf8a"
          distance={10}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* fill lạnh từ phía sau — tách bóng đèn khỏi nền */}
        <pointLight position={[-3, 1.5, -2.5]} intensity={0.35} color="#9fc0ff" distance={10} />

        <Suspense fallback={null}>
          <group position={[0, 0.1, 0]}>
            <LightBulb
              playing={playing}
              speed={speed}
              selectedPart={selectedPart}
              onPartClick={onPartClick}
            />
            {showAnnotations && (
              <Annotations parts={parts} selected={selectedPart} onSelect={onPartClick} />
            )}
          </group>
          <TableTop />
          <Grounding />
          {/* hạt bụi vàng caught trong ánh sáng bóng đèn */}
          <Sparkles
            count={70}
            scale={[6, 4, 6]}
            position={[0, 1.2, 0]}
            size={2.4}
            speed={0.25}
            color="#ffe0a0"
            opacity={0.55}
          />
          {/* vài mẩu bụi lớn hơn trôi nổi nhẹ */}
          <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.7}>
            <mesh position={[-2.0, 1.8, -1.0]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.5} toneMapped={false} />
            </mesh>
          </Float>
          <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh position={[2.2, 1.5, 1.1]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshStandardMaterial color={palette.filamentHot} emissive={palette.filament} emissiveIntensity={0.6} toneMapped={false} />
            </mesh>
          </Float>
          <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh position={[-1.8, 0.6, 1.4]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.4} toneMapped={false} />
            </mesh>
          </Float>
          <Environment preset="sunset" environmentIntensity={0.25} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2.2}
          maxDistance={7}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          target={[0, 0.2, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        Kéo để xoay · Cuộn để phóng to
      </div>
    </div>
  );
}
